import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './context/authStore'

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
import InstructorAIAssistantPage from './pages/instructor/InstructorAIAssistantPage'
import InstructorAnalyticsPage from './pages/instructor/InstructorAnalyticsPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import CalendarPage from './pages/student/CalendarPage'
import GradesPage from './pages/student/GradesPage'
import AIAssistantPage from './pages/student/AIAssistantPage'
import PaymentsPage from './pages/student/PaymentsPage'
import DeadlinesPage from './pages/student/DeadlinesPage'
import StudentSettingsPage from './pages/student/SettingsPage'

function App() {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore()

  // Check authentication status on app mount only once
  useEffect(() => {
    console.log('[App] Initial auth check')
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    // If authenticated but user data not yet loaded, show loading
    if (!user) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        </div>
      )
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to={getDashboardRoute()} replace />
    }

    return <>{children}</>
  }

  const getDashboardRoute = () => {
    if (!user) return '/admin' // Default fallback

    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/admin'
      case 'INSTRUCTOR':
        return '/instructor'
      case 'STUDENT':
        return '/student'
      default:
        return '/admin'
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
              !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : !user ? (
                // Still loading user data
                <div className="flex h-screen items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                </div>
              ) : (
                <Navigate to={getDashboardRoute()} replace />
              )
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invite"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <InviteUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <CourseManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students/:studentId"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/calendar"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/settings"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/ai-assistant"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorAIAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/analytics"
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/calendar"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <GradesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/ai-assistant"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/deadlines"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <DeadlinesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payments"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
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
