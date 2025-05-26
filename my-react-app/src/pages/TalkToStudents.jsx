import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const TalkToStudents = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);

  const getMockResponse = (input) => {
    if (input.toLowerCase().includes('exam')) {
      return "📅 The exams will start from next Monday. All the best!";
    } else if (input.toLowerCase().includes('holiday')) {
      return "🏖️ No holidays this week. Please refer to the academic calendar.";
    } else {
      return "🤖 I'm here to help! Please ask something related to your academics.";
    }
  };

  const handleSend = () => {
    if (!question.trim()) return;
    const response = getMockResponse(question);
    setChat([...chat, { type: 'user', text: question }, { type: 'bot', text: response }]);
    setQuestion('');
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>🎓 Talk To Students</Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '500px', overflowY: 'auto', mb: 2 }}>
        {chat.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
            <Paper sx={{ p: 1.5, maxWidth: '70%', backgroundColor: msg.type === 'user' ? '#1976d2' : '#e0e0e0', color: msg.type === 'user' ? 'white' : 'black' }}>
              <Typography>{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TalkToStudents;
