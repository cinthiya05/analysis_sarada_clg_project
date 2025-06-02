import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { getStudentById } from '../api/studentapi';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const LabelValue = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1">{value || '-'}</Typography>
  </Box>
);

const Section = ({ icon, title, children }) => (
  <Card
    sx={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafc',
      boxShadow: 3,
      borderRadius: 2,
      height: '100%', // make card full height of Grid item
      transition: 'transform 0.2s ease-in-out',
      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
    }}
  >
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#1976d2' }}
      >
        {icon}
        <Box sx={{ ml: 1, fontWeight: 'bold' }}>{title}</Box>
      </Typography>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </CardContent>
  </Card>
);

const StudentView = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setStudentData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Typography sx={{ mt: 5, textAlign: 'center' }}>
        Student not found
      </Typography>
    );
  }

  const { student, info, sem_info, record } = studentData;

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        p: 4,
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: 4,
        printColorAdjust: 'exact',
        '@media print': {
          boxShadow: 'none',
          p: 0,
          maxWidth: '100%',
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 4,
          color: '#1976d2',
          '@media print': { color: '#000' },
        }}
      >
        👨‍🎓 Student Details
      </Typography>

      <Grid container spacing={5}>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Section icon={<AccountBoxIcon color="primary" />} title="Basic Information">
            <LabelValue label="Name" value={student.student_name} />
            <LabelValue label="DOB" value={student.dob} />
            <LabelValue label="Department" value={student.department} />
            <LabelValue label="Register Number" value={student.register_num} />
            <LabelValue label="University Number" value={student.university_num} />
          </Section>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Section icon={<InfoIcon color="secondary" />} title="Additional Info">
            <LabelValue label="Address" value={info?.address} />
            <LabelValue label="Blood Group" value={info?.blood_grp} />
            <LabelValue label="Email" value={info?.mail_id} />
            <LabelValue label="Phone Number" value={info?.phone_no} />
            <LabelValue label="Year" value={info?.year} />
          </Section>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Section icon={<SchoolIcon color="success" />} title="Academic Info">
            <LabelValue label="Subject" value={sem_info?.subject} />
            <LabelValue label="Semester" value={sem_info?.semester} />
            <LabelValue label="CGPA" value={sem_info?.cgpa} />
            <LabelValue label="Mark" value={sem_info?.mark} />
            <LabelValue label="Grade" value={sem_info?.grade} />
            <LabelValue label="Status" value={sem_info?.pass_fail} />
          </Section>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Section icon={<FamilyRestroomIcon color="error" />} title="Family & Record Info">
            <LabelValue label="Father's Name" value={record?.father_name} />
            <LabelValue label="Mother's Name" value={record?.mother_name} />
            <LabelValue label="Father's Occupation" value={record?.father_occupation} />
            <LabelValue label="Aadhar Number" value={record?.aadhar_num} />
            <LabelValue label="10th Mark" value={record?.tenth_mark} />
            <LabelValue label="12th Mark" value={record?.twelfth_mark} />
            <LabelValue label="Account Number" value={record?.account_num} />
            <LabelValue label="Community" value={record?.community} />
            <LabelValue label="Religion" value={record?.religion} />
            <LabelValue label="Nationality" value={record?.nationality} />
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentView;
