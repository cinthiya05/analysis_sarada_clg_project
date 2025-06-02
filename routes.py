from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from typing import List
from sqlalchemy import func
from models import StudentData, StudentInfo, StudentSemInfo, StudentRecord
from schemas import (
    FullStudentCreate, FullStudentResponse, FullStudentUpdate,
    StudentDataSchema, StudentInfoSchema, StudentSemInfoSchema, StudentRecordSchema,StudentFullBulkCreate
)

router = APIRouter()


@router.post("/students/bulk/", status_code=201)
def create_students_bulk(
    payload: StudentFullBulkCreate, 
    db: Session = Depends(get_db)
):
    created_ids = []

    for entry in payload.__root__:
        student_dict = entry.student.dict()
        new_student = StudentData(**student_dict)
        db.add(new_student)
        db.commit()
        db.refresh(new_student)

        info_dict = entry.info.dict()
        new_info = StudentInfo(student_id=new_student.student_id, **info_dict)
        db.add(new_info)

        sem_dict = entry.sem_info.dict()
        new_sem = StudentSemInfo(student_id=new_student.student_id, student_info_id=new_info.student_info_id, **sem_dict)
        db.add(new_sem)

        record_dict = entry.record.dict()
        new_record = StudentRecord(student_id=new_student.student_id, **record_dict)
        db.add(new_record)

        db.commit()
        created_ids.append(new_student.student_id)

    return {"inserted_student_ids": created_ids}

@router.post("/student_full/", response_model=dict)
def create_full_student(payload: FullStudentCreate, db: Session = Depends(get_db)):
    try:
        existing_student = db.query(StudentData).filter(
            (StudentData.register_num == payload.student.register_num) |
            (StudentData.university_num == payload.student.university_num)
        ).first()

        if existing_student:
            return {
                "student_id": existing_student.student_id,
                "message": "Student already exists, using existing student_id"
            }

        new_student = StudentData(**payload.student.dict())
        db.add(new_student)
        db.flush()

        student_info_data = payload.info.dict()
        student_info_data["student_id"] = new_student.student_id
        new_info = StudentInfo(**student_info_data)
        db.add(new_info)
        db.flush()

        sem_info_data = payload.sem_info.dict()
        sem_info_data.update({
            "student_id": new_student.student_id,
            "student_info_id": new_info.student_info_id
        })
        new_sem_info = StudentSemInfo(**sem_info_data)
        db.add(new_sem_info)

        record_data = payload.record.dict()
        record_data["student_id"] = new_student.student_id
        new_record = StudentRecord(**record_data)
        db.add(new_record)

        db.commit()

        return {
            "student_id": new_student.student_id,
            "student_info_id": new_info.student_info_id,
            "message": "All records created successfully"
        }

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/student_full/{student_id}", response_model=FullStudentResponse)
def get_full_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentData).filter(StudentData.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return FullStudentResponse.model_validate({
        "student": student,
        "info": student.info,
        "sem_info": student.sem_infos[0] if student.sem_infos else None,
        "record": student.record
    })


@router.get("/students_full/", response_model=list[FullStudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(StudentData).options(
        joinedload(StudentData.info),
        joinedload(StudentData.sem_infos),
        joinedload(StudentData.record)
    ).all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found")

    result = []
    for s in students:
        result.append(FullStudentResponse.model_validate({
            "student": s,
            "info": s.info,
            "sem_info": s.sem_infos[0] if s.sem_infos else None,
            "record": s.record if s.record else None  # ❗ Fixed: pass object not list
        }))

    return result


@router.put("/students/{student_id}", response_model=FullStudentResponse)
def update_full_student(
    student_id: int,
    payload: FullStudentUpdate,
    db: Session = Depends(get_db)
):
    db_student = db.query(StudentData).filter(StudentData.student_id == student_id).first()
    db_info = db.query(StudentInfo).filter(StudentInfo.student_id == student_id).first()
    db_sem_info = db.query(StudentSemInfo).filter(StudentSemInfo.student_id == student_id).first()
    db_record = db.query(StudentRecord).filter(StudentRecord.student_id == student_id).first()

    if not db_student or not db_info or not db_sem_info or not db_record:
        raise HTTPException(status_code=404, detail="Student not found")

    for key, value in payload.student.dict(exclude_unset=True).items():
        setattr(db_student, key, value)

    for key, value in payload.info.dict(exclude_unset=True).items():
        setattr(db_info, key, value)

    for key, value in payload.sem_info.dict(exclude_unset=True).items():
        setattr(db_sem_info, key, value)

    for key, value in payload.record.dict(exclude_unset=True).items():
        setattr(db_record, key, value)

    db.commit()

    return FullStudentResponse.model_validate({
        "student": db_student,
        "info": db_info,
        "sem_info": db_sem_info,
        "record": db_record
    })


@router.delete("/students/{student_id}", response_model=dict)
def delete_full_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(StudentData).filter(StudentData.student_id == student_id).first()

    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    try:
        db.query(StudentSemInfo).filter(StudentSemInfo.student_id == student_id).delete()
        db.query(StudentInfo).filter(StudentInfo.student_id == student_id).delete()
        db.query(StudentRecord).filter(StudentRecord.student_id == student_id).delete()
        db.delete(db_student)
        db.commit()

        return {"message": f"Student with ID {student_id} and related records deleted successfully."}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

@router.get("/student_data/", response_model=List[StudentDataSchema])
def read_all_student_data(db: Session = Depends(get_db)):
    return db.query(StudentData).all()


@router.get("/graph/all-charts")
async def get_all_chart_data():
    # Bar Chart: department-wise pass/fail data
    bar_chart_data = [
        {"department": "CSE", "passed": 80, "failed": 10},
        {"department": "ECE", "passed": 70, "failed": 20},
        {"department": "MECH", "passed": 65, "failed": 15},
        {"department": "CIVIL", "passed": 50, "failed": 25},
    ]

    # Pie Chart: overall pass/fail ratio
    pie_chart_data = {
        "passed": 265,
        "failed": 70,
    }

    # Line Chart: average CGPA over semesters
    line_chart_data = {
        "semesters": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        "average_cgpa": [7.5, 7.8, 8.0, 8.3],
    }

    # Horizontal Bar Chart: total students per department
    horizontal_bar_chart_data = {
        "departments": ["CSE", "ECE", "MECH", "CIVIL"],
        "student_counts": [90, 90, 80, 75],
    }

    return {
        "bar_chart": bar_chart_data,
        "pie_chart": pie_chart_data,
        "line_chart": line_chart_data,
        "horizontal_bar_chart": horizontal_bar_chart_data,
    }