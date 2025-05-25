// studentApi.js
export async function getStudents() {
  return fetch('/api/students').then(res => res.json());
}
