// src/pages/Dashboard.jsx
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ChatIcon from '@mui/icons-material/Chat';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

// Chart Data
const pieChartData = {
  labels: ['Passed', 'Failed'],
  datasets: [
    {
      data: [300, 100],
      backgroundColor: ['#66bb6a', '#ef5350'],
      borderColor: ['#388e3c', '#c62828'],
      borderWidth: 2,
    },
  ],
};

const barChartData = {
  labels: ['CSE', 'ECE', 'MECH', 'CIVIL'],
  datasets: [
    {
      label: 'Passed',
      data: [90, 80, 70, 60],
      backgroundColor: '#4caf50',
    },
    {
      label: 'Failed',
      data: [10, 20, 30, 40],
      backgroundColor: '#f44336',
    },
  ],
};

const lineChartData = {
  labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  datasets: [
    {
      label: 'Average CGPA',
      data: [7.5, 7.8, 8.0, 8.3],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#1976d2',
      pointRadius: 5,
    },
  ],
};

const deptCountData = {
  labels: ['CSE', 'ECE', 'MECH', 'CIVIL'],
  datasets: [
    {
      label: 'Total Students',
      data: [120, 100, 85, 70],
      backgroundColor: '#42a5f5',
    },
  ],
};

const chartCardStyles = {
  p: 2,
  height: 230,
  width: 320,
  borderRadius: 4,
  boxShadow: 4,
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: 8,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: 4,
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}
      >
        🎓 Student Management Dashboard
      </Typography>

      {/* Action Cards */}
      <Grid container spacing={4} justifyContent="center" mb={4}>
        {[
          {
            title: '📊 Student Records',
            description:
              'Use the student form to add or view student data in your system.',
            buttonText: 'Go to Student Form',
            icon: <SchoolIcon />,
            navigateTo: '/students',
            color: 'primary',
            background: 'linear-gradient(145deg, #ffffff, #e3f2fd)',
          },
          {
            title: '💬 Talk to Students',
            description:
              'Chat with students and answer common academic questions.',
            buttonText: 'Open Chat',
            icon: <ChatIcon />,
            navigateTo: '/talk-to-students',
            color: 'error',
            background: 'linear-gradient(145deg, #ffffff, #fce4ec)',
          },
          {
            title: '📈 Students Stats',
            description:
              'View detailed statistics about student performance and enrollment.',
            buttonText: 'View Stats',
            icon: <SchoolIcon />,
            navigateTo: '/student-stats',
            color: 'secondary',
            background: 'linear-gradient(145deg, #ffffff, #ede7f6)',
          },
        ].map((card, index) => (
          <Grid item key={index}>
            <Card
              sx={{
                width: 320,
                height: 230,
                borderRadius: 4,
                background: card.background,
                boxShadow: 6,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 10,
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <CardContent>
                <Typography variant="h6" color={card.color} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {card.description}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color={card.color}
                  startIcon={card.icon}
                  onClick={() => navigate(card.navigateTo)}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart Cards in a single row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
          overflowX: 'auto',
          paddingBottom: 2,
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#90caf9', borderRadius: 4 },
        }}
      >
        {/* Bar Chart */}
        <Card sx={chartCardStyles}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            📊 Department-wise Pass/Fail
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
                layout: { padding: 10 },
              }}
              height={140}
            />
          </Box>
        </Card>

        {/* Pie Chart */}
        <Card sx={chartCardStyles}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            🥧 Overall Pass/Fail Ratio
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 20,
                      padding: 10,
                    },
                  },
                },
              }}
              height={160}
              width={160}
            />
          </Box>
        </Card>

        {/* Line Chart */}
        <Card sx={chartCardStyles}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            📈 CGPA Trend
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
                layout: { padding: 10 },
              }}
              height={140}
            />
          </Box>
        </Card>

        {/* Horizontal Bar Chart */}
        <Card sx={chartCardStyles}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            🧮 Students per Department
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Bar
              data={deptCountData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
                layout: { padding: 10 },
              }}
              height={140}
            />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
