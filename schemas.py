
from typing import Optional
from datetime import date
from typing import List
from pydantic import BaseModel, EmailStr, ConfigDict, RootModel


# --- StudentData ---

class StudentDataCreate(BaseModel):
    student_name: str
    dob: date
    department: Optional[str]
    register_num: str
    university_num: int

class StudentDataSchema(StudentDataCreate):
    student_id: int
    model_config = ConfigDict(from_attributes=True)


# --- StudentInfo ---

class StudentInfoCreate(BaseModel):
    address: Optional[str]
    blood_grp: Optional[str]
    mail_id: Optional[EmailStr]
    phone_no: Optional[int]
    year: Optional[int]

class StudentInfoSchema(StudentInfoCreate):
    student_info_id: int
    student_id: int
    model_config = ConfigDict(from_attributes=True)


# --- StudentSemInfo ---

class StudentSemInfoCreate(BaseModel):
    cgpa: Optional[float]
    semester: Optional[int]
    pass_fail: Optional[str]
    grade: Optional[str]
    mark: Optional[int]
    subject: Optional[str]

class StudentSemInfoSchema(StudentSemInfoCreate):
    sem_info_id: int
    student_id: int
    student_info_id: int
    model_config = ConfigDict(from_attributes=True)


# --- StudentRecord ---

class StudentRecordCreate(BaseModel):
    father_name: Optional[str]
    mother_name: Optional[str]
    father_occupation: Optional[str]
    aadhar_num: Optional[int]
    tenth_mark: Optional[int]
    twelfth_mark: Optional[int]
    account_num: Optional[int]
    community: Optional[str]
    religion: Optional[str]
    nationality: Optional[str]

class StudentRecordSchema(StudentRecordCreate):
    student_record_id: int
    student_id: int
    model_config = ConfigDict(from_attributes=True)


# --- Full Create schema (for POST) ---

class FullStudentCreate(BaseModel):
    student: StudentDataCreate
    info: StudentInfoCreate
    sem_info: StudentSemInfoCreate
    record: StudentRecordCreate


# --- Full Response schema (for GET & PUT response) ---

class FullStudentResponse(BaseModel):
    student: StudentDataSchema
    info: Optional[StudentInfoSchema] = None
    sem_info: Optional[StudentSemInfoSchema] = None
    record: Optional[StudentRecordSchema] = None  # <-- Changed from List to single object

    model_config = ConfigDict(from_attributes=True)


# --- Full Update schema (for PUT) ---

class FullStudentUpdate(BaseModel):
    student: StudentDataCreate
    info: StudentInfoCreate
    sem_info: StudentSemInfoCreate
    record: StudentRecordCreate

class StudentFullBulkCreate(RootModel[List[FullStudentCreate]]):
    pass
