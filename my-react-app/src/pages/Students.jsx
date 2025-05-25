// src/pages/Students.jsx
import { useState } from 'react';

function Students() {
  const [formData, setFormData] = useState({
    student_name: '',
    dob: '',
    department: '',
    register_num: '',
    university_num: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/student_full/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: formData,
          info: {},       // Fill these as needed
          sem_info: {},
          record: {}
        }),
      });

      const result = await res.json();
      alert('Student Created: ' + JSON.stringify(result));
    } catch (error) {
      console.error(error);
      alert('Error submitting student data');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="student_name" value={formData.student_name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          DOB:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Department:
          <input name="department" value={formData.department} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Register No:
          <input name="register_num" value={formData.register_num} onChange={handleChange} required />
        </label>
        <br />
        <label>
          University No:
          <input type="number" name="university_num" value={formData.university_num} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Students;
