from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from models import StudentData, StudentInfo, StudentSemInfo, StudentRecord
from schemas import (
    FullStudentCreate, FullStudentResponse, FullStudentUpdate,
    StudentDataSchema, StudentInfoSchema, StudentSemInfoSchema, StudentRecordSchema
)

router = APIRouter()

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
