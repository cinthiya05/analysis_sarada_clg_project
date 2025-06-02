const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function getStudents() {
  
  return fetch(`http://localhost:8000/student_full/`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch students');
      return res.json();
    });
}

export async function createStudent(data) {
  return fetch(`http://localhost:8000/student_full/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) throw new Error('Failed to create student');
    return res.json();
  });
}

export async function getStudentsdata() {
  return fetch(`${API_BASE}/student_data/`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch students');
      return res.json();
    });
}


export async function getStudentById(id) {
  const res = await fetch(`http://localhost:8000/student_full/${id}`);
  if (!res.ok) throw new Error('Failed to fetch student details');
  return res.json();
}


