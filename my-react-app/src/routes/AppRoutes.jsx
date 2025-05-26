import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import TalkToStudents from '../pages/TalkToStudents';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="talk-to-students" element={<TalkToStudents />} />
      </Route>
    </Routes>
  );
}
