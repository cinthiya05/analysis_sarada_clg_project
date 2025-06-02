import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper,
  Grid, InputAdornment, Stepper, Step, StepLabel
} from '@mui/material';

import {
  Person, CalendarToday, Business, Badge, School,
  Home, Bloodtype, Email, Phone, CalendarMonth,
  TrendingUp, Filter9Plus, CheckCircle, Grade, Subject, Assessment,
  FamilyRestroom, Work, CreditCard, AccountBalance, Group, Public
} from '@mui/icons-material';
import { createStudent } from '../api/studentapi';

export default function Students() {
  const [activeStep, setActiveStep] = useState(0);

  const [student, setStudent] = useState({
    student_name: '',
    dob: '',
    department: '',
    register_num: '',
    university_num: ''
  });

  const [info, setInfo] = useState({
    address: '',
    blood_grp: '',
    mail_id: '',
    phone_no: '',
    year: ''
  });

  const [semInfo, setSemInfo] = useState({
    cgpa: '',
    semester: '',
    pass_fail: '',
    grade: '',
    mark: '',
    subject: ''
  });

  const [record, setRecord] = useState({
    father_name: '',
    mother_name: '',
    father_occupation: '',
    aadhar_num: '',
    tenth_mark: '',
    twelfth_mark: '',
    account_num: '',
    community: '',
    religion: '',
    nationality: ''
  });

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = {
      student,
      info,
      sem_info: semInfo,
      record
    };

    const result = await createStudent(data);
    alert('✅ Student Created: ' + JSON.stringify(result));
  } catch (error) {
    console.error(error);
    alert('❌ Error submitting student data');
  }
};
  const steps = ['Basic Info', 'Additional Info', 'Semester Info', 'Family & Personal Info'];

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
          📝 Student Registration
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {/* Step 1 - Basic Info */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  placeholder="Full Name"
                  name="student_name"
                  fullWidth
                  required
                  value={student.student_name}
                  onChange={handleChange(setStudent)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Date of Birth"
                  name="dob"
                  type="date"
                  fullWidth
                  required
                  value={student.dob}
                  onChange={handleChange(setStudent)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Department"
                  name="department"
                  fullWidth
                  required
                  value={student.department}
                  onChange={handleChange(setStudent)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Business /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Register Number"
                  name="register_num"
                  fullWidth
                  required
                  value={student.register_num}
                  onChange={handleChange(setStudent)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="University Number"
                  name="university_num"
                  type="number"
                  fullWidth
                  required
                  value={student.university_num}
                  onChange={handleChange(setStudent)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><School /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 2 - Additional Info */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  placeholder="Address"
                  name="address"
                  fullWidth
                  required
                  value={info.address}
                  onChange={handleChange(setInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Home /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Blood Group"
                  name="blood_grp"
                  fullWidth
                  required
                  value={info.blood_grp}
                  onChange={handleChange(setInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Bloodtype /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Email"
                  name="mail_id"
                  type="email"
                  fullWidth
                  required
                  value={info.mail_id}
                  onChange={handleChange(setInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Phone Number"
                  name="phone_no"
                  type="tel"
                  fullWidth
                  required
                  value={info.phone_no}
                  onChange={handleChange(setInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Year"
                  name="year"
                  type="number"
                  fullWidth
                  required
                  value={info.year}
                  onChange={handleChange(setInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 3 - Semester Info */}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  placeholder="CGPA"
                  name="cgpa"
                  type="number"
                  fullWidth
                  required
                  value={semInfo.cgpa}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><TrendingUp /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Semester"
                  name="semester"
                  type="number"
                  fullWidth
                  required
                  value={semInfo.semester}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Filter9Plus /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Pass/Fail"
                  name="pass_fail"
                  fullWidth
                  required
                  value={semInfo.pass_fail}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CheckCircle /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Grade"
                  name="grade"
                  fullWidth
                  required
                  value={semInfo.grade}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Grade /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Mark"
                  name="mark"
                  type="number"
                  fullWidth
                  required
                  value={semInfo.mark}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Assessment /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Subject"
                  name="subject"
                  fullWidth
                  required
                  value={semInfo.subject}
                  onChange={handleChange(setSemInfo)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Subject /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          )}

          {/* Step 4 - Family & Personal Info */}
          {activeStep === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  placeholder="Father's Name"
                  name="father_name"
                  fullWidth
                  required
                  value={record.father_name}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FamilyRestroom /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Mother's Name"
                  name="mother_name"
                  fullWidth
                  required
                  value={record.mother_name}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><FamilyRestroom /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Father's Occupation"
                  name="father_occupation"
                  fullWidth
                  required
                  value={record.father_occupation}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Work /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Aadhar Number"
                  name="aadhar_num"
                  fullWidth
                  required
                  value={record.aadhar_num}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><CreditCard /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="10th Mark"
                  name="tenth_mark"
                  type="number"
                  fullWidth
                  required
                  value={record.tenth_mark}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Assessment /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="12th Mark"
                  name="twelfth_mark"
                  type="number"
                  fullWidth
                  required
                  value={record.twelfth_mark}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Assessment /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Account Number"
                  name="account_num"
                  fullWidth
                  required
                  value={record.account_num}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><AccountBalance /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Community"
                  name="community"
                  fullWidth
                  required
                  value={record.community}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Group /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Religion"
                  name="religion"
                  fullWidth
                  required
                  value={record.religion}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Public /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  placeholder="Nationality"
                  name="nationality"
                  fullWidth
                  required
                  value={record.nationality}
                  onChange={handleChange(setRecord)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Public /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                ⬅️ Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} sx={{ ml: 'auto' }}>
                Next ➡️
              </Button>
            ) : (
              <Button variant="contained" type="submit" sx={{ ml: 'auto' }}>
                ✅ Submit
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
