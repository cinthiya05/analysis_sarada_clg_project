import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Pagination,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getStudentsdata } from '../api/studentapi';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentsdata();
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleEdit = (id) => {
    navigate(`/student-edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      console.log('Deleting student with ID:', id);
    }
  };

  const paginatedStudents = students.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading students...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '1200px',
        height: '700px',
        margin: '0 auto',
        padding: 3,
        backgroundColor: '#fafafa',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📋 Student List
      </Typography>

      <Paper elevation={2} sx={{ flexGrow: 1, overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>DOB</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Register Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>University Number</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.student_id} hover sx={{ height: 60 }}>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.dob}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.register_num}</TableCell>
                  <TableCell>{student.university_num}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton color="primary" onClick={() => navigate(`/student-view/${student.student_id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => handleEdit(student.student_id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(student.student_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(students.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default StudentList;
