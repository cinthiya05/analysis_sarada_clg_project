from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from database import Base

class StudentData(Base):
    __tablename__ = "student_data"

    student_id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(100))
    dob = Column(Date)
    department = Column(String(100))
    register_num = Column(String(50), unique=True)
    university_num = Column(Integer, unique=True)

    info = relationship("StudentInfo", back_populates="student", uselist=False)
    record = relationship("StudentRecord", back_populates="student", uselist=False)
    sem_infos = relationship("StudentSemInfo", back_populates="student")

class StudentInfo(Base):
    __tablename__ = "student_info"

    student_info_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_data.student_id"))
    address = Column(String(255))
    blood_grp = Column(String(10))
    mail_id = Column(String(100))
    phone_no = Column(BigInteger)
    year = Column(Integer)

    student = relationship("StudentData", back_populates="info")
    sem_infos = relationship("StudentSemInfo", back_populates="student_info")

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

    student = relationship("StudentData", back_populates="sem_infos")
    student_info = relationship("StudentInfo", back_populates="sem_infos")

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

    student = relationship("StudentData", back_populates="record")


