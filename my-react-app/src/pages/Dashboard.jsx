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
        {[{
          title: '📊 Student Records',
          description: 'Use the student form to add or view student data in your system.',
          buttonText: 'Go to Student Form',
          icon: <SchoolIcon />,
          navigateTo: '/students',
          color: 'primary',
          background: 'linear-gradient(145deg, #ffffff, #e3f2fd)',
        }, {
          title: '💬 Talk to Students',
          description: 'Chat with students and answer common academic questions.',
          buttonText: 'Open Chat',
          icon: <ChatIcon />,
          navigateTo: '/talk-to-students',
          color: 'error',
          background: 'linear-gradient(145deg, #ffffff, #fce4ec)',
        }].map((card, index) => (
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

      {/* Charts - Full width one below the other */}
      <Grid container spacing={4} direction="column" alignItems="center">
        {/* Chart 1: Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, height: 370, maxWidth: 900, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              📊 Department-wise Pass/Fail
            </Typography>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'right' }},
              }}
            />
          </Card>
        </Grid>

        {/* Chart 2: Pie Chart */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              height: 370,
              maxWidth: 900,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              🥧 Overall Pass/Fail Ratio
            </Typography>
            <Box sx={{ height: 250, width: 250 }}>
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
              />
            </Box>
          </Card>
        </Grid>

        {/* Chart 3: Line Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, height: 370, maxWidth: 900, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              📈 CGPA Trend
            </Typography>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </Card>
        </Grid>

        {/* Chart 4: Horizontal Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, height: 370, maxWidth: 900, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              🧮 Students per Department
            </Typography>
            <Bar
              data={deptCountData}
              options={{
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { position: 'right' } },
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}