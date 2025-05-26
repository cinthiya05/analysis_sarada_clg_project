// src/pages/Dashboard.jsx
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const departmentData = [
  { department: 'CSE', passed: 90, failed: 10 },
  { department: 'ECE', passed: 80, failed: 20 },
  { department: 'MECH', passed: 70, failed: 30 },
  { department: 'CIVIL', passed: 60, failed: 40 },
];

const pieData = [
  { name: 'Passed', value: 300 },
  { name: 'Failed', value: 100 },
];

const COLORS = ['#4caf50', '#f44336'];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4, background: 'linear-gradient(to right, #e3f2fd, #ffffff)', minHeight: '100vh' }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}>
        🎓 Student Management Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Card sx={{ width: 320, height: 230, borderRadius: 4, background: 'linear-gradient(145deg, #ffffff, #e3f2fd)', boxShadow: 6, '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease-in-out' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                📊 Student Records
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Use the student form to add or view student data in your system.
              </Typography>
              <Button fullWidth variant="contained" startIcon={<SchoolIcon />} onClick={() => navigate('/students')} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                Go to Student Form
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card sx={{ width: 320, height: 230, borderRadius: 4, background: 'linear-gradient(145deg, #ffffff, #fce4ec)', boxShadow: 6, '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease-in-out' }}>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                💬 Talk to Students
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Chat with students and answer common academic questions.
              </Typography>
              <Button fullWidth variant="contained" color="error" startIcon={<ChatIcon />} onClick={() => navigate('/talk-to-students')} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                Open Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4} mt={6}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              📈 Department-wise Pass/Fail Count
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={departmentData}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="passed" stackId="a" fill="#4caf50" name="Passed" />
                <Bar dataKey="failed" stackId="a" fill="#f44336" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              🥧 Overall Pass/Fail Ratio
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
