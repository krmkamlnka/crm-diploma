import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './context/authStore'
import { useThemeStore } from './context/themeStore'

// Layout components
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import InviteUserPage from './pages/admin/InviteUserPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

// Instructor pages
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import CoursesPage from './pages/instructor/CoursesPage'
import CourseManagementPage from './pages/instructor/CourseManagementPage'
import StudentsPage from './pages/instructor/StudentsPage'
import StudentDetailPage from './pages/instructor/StudentDetailPage'
import InstructorCalendarPage from './pages/instructor/InstructorCalendarPage'
import InstructorSettingsPage from './pages/instructor/InstructorSettingsPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import CalendarPage from './pages/student/CalendarPage'
import GradesPage from './pages/student/GradesPage'
import AIAssistantPage from './pages/student/AIAssistantPage'
import PaymentsPage from './pages/student/PaymentsPage'
import StudentSettingsPage from './pages/student/SettingsPage'

function App() {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore()
  const { theme } = useThemeStore()

  // Check authentication status on app mount (only if not already authenticated)
  useEffect(() => {
    console.log('[App] useEffect triggered, isAuthenticated:', isAuthenticated, 'user:', user?.email)
    if (!isAuthenticated && !user) {
      console.log('[App] User not authenticated, calling checkAuth()')
      checkAuth()
    } else {
      console.log('[App] User already authenticated, skipping checkAuth()')
    }
  }, [checkAuth, isAuthenticated])

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />
    }

    return <>{children}</>
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'

    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return '/admin'
      case 'instructor':
        return '/instructor'
      case 'student':
        return '/student'
      default:
        return '/login'
    }
  }

  return (
    <Router>
      <Routes>
        {/* Public routes - always light theme */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected routes with layout */}
        <Route element={<MainLayout />}>
          {/* Redirect root to appropriate dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ?
                <Navigate to={getDashboardRoute()} replace /> :
                <Navigate to="/login" replace />
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invite"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <InviteUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CourseManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students/:studentId"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/calendar"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/settings"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/calendar"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <GradesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-assistant"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payments"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
