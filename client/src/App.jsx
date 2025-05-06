import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import EditStudent from './pages/EditStudent';
import Teachers from './pages/Teachers';
import EditTeacher from './pages/EditTeacher';
import CourseProfile from './pages/CourseProfile';
import TeacherProfile from './pages/TeacherProfile';
import StudentProfile from './pages/StudentProfile';
import Payments from './pages/Payments';
import DashboardLayout from './components/DashboardLayout';
import 'react-toastify/dist/ReactToastify.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/courses"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Courses />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/courses/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <CourseProfile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/students"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Students />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/students/:id/edit"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EditStudent />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/teachers"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Teachers />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/teachers/:id/edit"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <EditTeacher />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id/edit"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher-profile/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <TeacherProfile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/student-profile/:id"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <StudentProfile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
           <Route
            path="/dashboard/payments"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Payments />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        
        
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
