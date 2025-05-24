from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, ForeignKey, BigInteger, text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session
from urllib.parse import quote_plus
from typing import List
from datetime import date
from fastapi import Depends
import openai

# OpenAI API Key
openai.api_key = ""

app = FastAPI()

# CORS middleware for frontend localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# Database config - your student_data DB (fixed connection)
# =====================

DB_USER = "root"
DB_PASSWORD = quote_plus("Cinthiya@30")
DB_HOST = "localhost"
DB_NAME = "college"

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# =====================
# SQLAlchemy Models
# =====================

class StudentData(Base):
    __tablename__ = "student_data"
    student_id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(100))
    dob = Column(Date)
    department = Column(String(100))
    register_num = Column(String(50))
    university_num = Column(Integer)
    student_infos = relationship("StudentInfo", back_populates="student_data")
    student_sem_infos = relationship("StudentSemInfo", back_populates="student_data")
    student_records = relationship("StudentRecord", back_populates="student_data")

class StudentInfo(Base):
    __tablename__ = "student_info"
    student_info_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_data.student_id"))
    address = Column(String(255))
    blood_grp = Column(String(10))
    mail_id = Column(String(100))
    phone_no = Column(BigInteger)
    year = Column(Integer)
    student_data = relationship("StudentData", back_populates="student_infos")
    student_sem_infos = relationship("StudentSemInfo", back_populates="student_info")

class StudentSemInfo(Base):
    __tablename__ = "student_sem_info"
    sem_info_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_data.student_id"))
    student_info_id = Column(Integer, ForeignKey("student_info.student_info_id"))
    cgpa = Column(Float)
    semester = Column(Integer)
    pass_fail = Column(String(10))
    grade = Column(String(5))
    mark = Column(Integer)
    subject = Column(String(100))
    student_data = relationship("StudentData", back_populates="student_sem_infos")
    student_info = relationship("StudentInfo", back_populates="student_sem_infos")

class StudentRecord(Base):
    __tablename__ = "student_record"
    
    student_record_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_data.student_id"))
    father_name = Column(String(100))
    mother_name = Column(String(100))
    father_occupation = Column(String(100))
    aadhar_num = Column(BigInteger)
    tenth_mark = Column(Integer)
    twelfth_mark = Column(Integer)
    account_num = Column(BigInteger)
    community = Column(String(50))
    religion = Column(String(50))
    nationality = Column(String(50))
    
    student_data = relationship("StudentData", back_populates="student_records")


# =====================
# Pydantic Schemas
# =====================

class StudentDataBase(BaseModel):
    student_id: int
    student_name: str
    dob: date
    department: str
    register_num: str
    university_num: int

    class Config:
        orm_mode = True

class StudentInfoBase(BaseModel):
    student_info_id: int
    student_id: int
    address: str
    blood_grp: str
    mail_id: str
    phone_no: int
    year: int

    class Config:
        orm_mode = True

class StudentSemInfoBase(BaseModel):
    student_id: int
    student_info_id: int
    cgpa: float
    semester: int
    pass_fail: str
    grade: str
    mark: int
    subject: str

    class Config:
        orm_mode = True

class StudentRecordBase(BaseModel):
    student_id: int
    father_name: str
    mother_name: str
    father_occupation: str
    aadhar_num: int
    tenth_mark: int
    twelfth_mark: int
    account_num: int
    community: str
    religion: str
    nationality: str

    class Config:
        orm_mode = True

# =====================
# Dependency - DB session for student_data DB
# =====================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =====================
# CRUD routes for student_data tables
# =====================

# student_data
@app.post("/student_data/", response_model=StudentDataBase)
def create_student_data(data: StudentDataBase, db: Session = Depends(get_db)):
    student = StudentData(**data.dict())
    try:
        db.add(student)
        db.commit()
        db.refresh(student)
        return student
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/student_data/", response_model=List[StudentDataBase])
def read_all_student_data(db: Session = Depends(get_db)):
    return db.query(StudentData).all()

@app.get("/student_data/{student_id}", response_model=StudentDataBase)
def read_student_data_by_id(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentData).filter(StudentData.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/student_data/{student_id}")
def update_student_data(student_id: int, data: StudentDataBase, db: Session = Depends(get_db)):
    student = db.query(StudentData).filter(StudentData.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, value in data.dict().items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return {"message": "Student data updated", "student_data": data}


@app.delete("/student_data/{student_id}")
def delete_student_data(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentData).filter(StudentData.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": f"Student data with id {student_id} deleted"}

# student_info
@app.post("/student_info/", response_model=StudentInfoBase)
def create_student_info(data: StudentInfoBase, db: Session = Depends(get_db)):
    info = StudentInfo(**data.dict())
    try:
        db.add(info)
        db.commit()
        db.refresh(info)
        return info
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/student_info/", response_model=List[StudentInfoBase])
def read_all_student_info(db: Session = Depends(get_db)):
    return db.query(StudentInfo).all()

@app.get("/student_info/{student_info_id}", response_model=StudentInfoBase)
def read_student_info_by_id(student_info_id: int, db: Session = Depends(get_db)):
    info = db.query(StudentInfo).filter(StudentInfo.student_info_id == student_info_id).first()
    if not info:
        raise HTTPException(status_code=404, detail="Student info not found")
    return info

@app.put("/student_info/{student_info_id}")
def update_student_info(student_info_id: int, data: StudentInfoBase, db: Session = Depends(get_db)):
    info = db.query(StudentInfo).filter(StudentInfo.student_info_id == student_info_id).first()
    if not info:
        raise HTTPException(status_code=404, detail="Student info not found")
    for field, value in data.dict().items():
        setattr(info, field, value)
    db.commit()
    db.refresh(info)
    return {"message": "Student info updated", "student_info": data}

@app.delete("/student_info/{student_info_id}")
def delete_student_info(student_info_id: int, db: Session = Depends(get_db)):
    info = db.query(StudentInfo).filter(StudentInfo.student_info_id == student_info_id).first()
    if not info:
        raise HTTPException(status_code=404, detail="Student info not found")
    db.delete(info)
    db.commit()
    return {"message": f"Student info with id {student_info_id} deleted"}

# student_sem_info
@app.post("/student_sem_info/", response_model=StudentSemInfoBase)
def create_student_sem_info(data: StudentSemInfoBase, db: Session = Depends(get_db)):
    sem_info = StudentSemInfo(**data.dict())
    try:
        db.add(sem_info)
        db.commit()
        db.refresh(sem_info)
        return sem_info
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/student_sem_info/", response_model=List[StudentSemInfoBase])
def read_all_student_sem_info(db: Session = Depends(get_db)):
    return db.query(StudentSemInfo).all()

@app.get("/student_sem_info/{sem_info_id}", response_model=StudentSemInfoBase)
def read_student_sem_info_by_id(sem_info_id: int, db: Session = Depends(get_db)):
    sem_info = db.query(StudentSemInfo).filter(StudentSemInfo.sem_info_id == sem_info_id).first()
    if not sem_info:
        raise HTTPException(status_code=404, detail="Student semester info not found")
    return sem_info

@app.put("/student_sem_info/{sem_info_id}")
def update_student_sem_info(sem_info_id: int, data: StudentSemInfoBase, db: Session = Depends(get_db)):
    sem_info = db.query(StudentSemInfo).filter(StudentSemInfo.sem_info_id == sem_info_id).first()
    if not sem_info:
        raise HTTPException(status_code=404, detail="Student sem info not found")
    
    for field, value in data.dict().items():
        setattr(sem_info, field, value)

    db.commit()
    db.refresh(sem_info)
    return {"message": "Student semester info updated", "student_sem_info": data}


@app.delete("/student_sem_info/{sem_info_id}")
def delete_student_sem_info(sem_info_id: int, db: Session = Depends(get_db)):
    sem_info = db.query(StudentSemInfo).filter(StudentSemInfo.sem_info_id == sem_info_id).first()
    if not sem_info:
        raise HTTPException(status_code=404, detail="Student semester info not found")
    db.delete(sem_info)
    db.commit()
    return {"message": f"Student semester info with id {sem_info_id} deleted"}

# student_record
@app.post("/student_record")
def create_student_record(data: StudentRecordBase, db: Session = Depends(get_db)):
    new_record = StudentRecord(**data.dict())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return {"message": "Student record created", "student_record": new_record}


@app.get("/student_record/", response_model=List[StudentRecordBase])
def read_all_student_record(db: Session = Depends(get_db)):
    return db.query(StudentRecord).all()

@app.get("/student_record/{student_record_id}", response_model=StudentRecordBase)
def read_student_record_by_id(student_record_id: int, db: Session = Depends(get_db)):
    record = db.query(StudentRecord).filter(StudentRecord.student_record_id == student_record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Student record not found")
    return record

@app.put("/student_record/{student_record_id}")
def update_student_record(student_record_id: int, data: StudentRecordBase, db: Session = Depends(get_db)):
    record = db.query(StudentRecord).filter(StudentRecord.student_record_id == student_record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Student record not found")
    
    for field, value in data.dict().items():
        setattr(record, field, value)
    
    db.commit()
    db.refresh(record)
    return {"message": "Student record updated", "student_record": record}

@app.delete("/student_record/{student_record_id}")
def delete_student_record(student_record_id: int, db: Session = Depends(get_db)):
    record = db.query(StudentRecord).filter(StudentRecord.student_record_id == student_record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Student record not found")
    db.delete(record)
    db.commit()
    return {"message": f"Student record with id {student_record_id} deleted"}


