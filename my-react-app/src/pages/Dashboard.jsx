import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: 6,
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: '#1976d2',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        🎓 Student Management Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Card
            sx={{
              width: 320,
              height: 230,
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff, #e3f2fd)',
              boxShadow: 6,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                📊 Student Records
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Use the student form to add or view student data in your system.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SchoolIcon />}
                onClick={() => navigate('/students')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Go to Student Form
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card
            sx={{
              width: 320,
              height: 230,
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff, #fff3e0)',
              boxShadow: 6,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                👥 Manage Users
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Control permissions and roles for staff and faculty users.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<PeopleAltIcon />}
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card
            sx={{
              width: 320,
              height: 230,
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff, #e8f5e9)',
              boxShadow: 6,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" color="success.main" gutterBottom>
                🏆 Reports & Analytics
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Generate insightful student performance and attendance reports.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<EmojiEventsIcon />}
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
