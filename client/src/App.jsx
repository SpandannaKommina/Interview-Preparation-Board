import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages (All 28 Required Modules)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import CodingPage from './pages/CodingPage';
import CodingQuestionDetailsPage from './pages/CodingQuestionDetailsPage';
import InterviewPage from './pages/InterviewPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import ResumePage from './pages/ResumePage';
import ResumePreviewPage from './pages/ResumePreviewPage';
import CompaniesPage from './pages/CompaniesPage';
import AptitudePage from './pages/AptitudePage';
import QuizResultsPage from './pages/QuizResultsPage';
import QuestionBankPage from './pages/QuestionBankPage';
import PlannerPage from './pages/PlannerPage';
import CalendarPage from './pages/CalendarPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [pagePayload, setPagePayload] = useState(null);

  // Custom navigate that can pass payload (e.g. questionId, quizData, resumeId)
  const navigateTo = (page, payload = null) => {
    setPagePayload(payload);
    setActivePage(page);
  };

  // Set default page once auth loads
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && activePage === 'landing') {
        setActivePage('dashboard');
      } else if (!isAuthenticated && (activePage === 'dashboard' || activePage === 'profile' || activePage === 'settings')) {
        setActivePage('landing');
      }
    }
  }, [isAuthenticated, loading]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      // 1. Landing Page
      case 'landing':
        return <LandingPage setActivePage={navigateTo} />;

      // 2. Login Page
      case 'login':
        return <LoginPage setActivePage={navigateTo} />;

      // 3. Signup / Register Page
      case 'register':
      case 'signup':
        return <RegisterPage setActivePage={navigateTo} />;

      // 4. Forgot Password Page
      case 'forgot-password':
        return <ForgotPasswordPage setActivePage={navigateTo} />;

      // 5. Reset Password Page
      case 'reset-password':
        return <ResetPasswordPage setActivePage={navigateTo} />;

      // 6. Student Dashboard
      case 'dashboard':
        return <DashboardPage setActivePage={navigateTo} />;

      // 7. Learning Roadmap (All 13 categories)
      case 'roadmap':
        return <RoadmapPage setActivePage={navigateTo} />;

      // 8. Coding Practice
      case 'coding':
        return <CodingPage setActivePage={navigateTo} />;

      // 9. Coding Question Details
      case 'coding-question':
        return <CodingQuestionDetailsPage setActivePage={navigateTo} questionId={pagePayload?.questionId} />;

      // 10. AI Mock Interview
      case 'interview':
        return <InterviewPage setActivePage={navigateTo} />;

      // 11. Interview History
      case 'interview-history':
        return <InterviewHistoryPage setActivePage={navigateTo} />;

      // 12. Resume Builder
      case 'resume':
        return <ResumePage setActivePage={navigateTo} />;

      // 13. Resume Preview
      case 'resume-preview':
        return <ResumePreviewPage setActivePage={navigateTo} resumeId={pagePayload?.resumeId} />;

      // 14. Company Preparation
      case 'companies':
        return <CompaniesPage setActivePage={navigateTo} />;

      // 15. Aptitude Tests
      case 'aptitude':
        return <AptitudePage setActivePage={navigateTo} />;

      // 16. Quiz Results
      case 'quiz-results':
        return <QuizResultsPage setActivePage={navigateTo} resultData={pagePayload} />;

      // 17. Interview Question Bank
      case 'questions':
        return <QuestionBankPage setActivePage={navigateTo} />;

      // 18. Study Planner
      case 'planner':
        return <PlannerPage setActivePage={navigateTo} />;

      // 19. Calendar
      case 'calendar':
        return <CalendarPage setActivePage={navigateTo} />;

      // 20. Leaderboard
      case 'leaderboard':
        return <LeaderboardPage setActivePage={navigateTo} />;

      // 21. Notifications Center
      case 'notifications':
        return <NotificationsPage setActivePage={navigateTo} />;

      // 22. Student Profile
      case 'profile':
        return <ProfilePage setActivePage={navigateTo} />;

      // 23. Settings
      case 'settings':
        return <SettingsPage setActivePage={navigateTo} />;

      // 24. Admin Dashboard
      case 'admin':
      case 'admin-dashboard':
        return <AdminPage initialTab="dashboard" setActivePage={navigateTo} />;

      // 25. User Management
      case 'admin-users':
        return <AdminPage initialTab="users" setActivePage={navigateTo} />;

      // 26. Question Management
      case 'admin-questions':
        return <AdminPage initialTab="questions" setActivePage={navigateTo} />;

      // 27. Learning Content Management
      case 'admin-content':
        return <AdminPage initialTab="content" setActivePage={navigateTo} />;

      // 28. Analytics
      case 'admin-analytics':
        return <AdminPage initialTab="analytics" setActivePage={navigateTo} />;

      default:
        return <LandingPage setActivePage={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white">
      <Navbar activePage={activePage} setActivePage={navigateTo} />
      <main className="flex-1 w-full">
        {renderPage()}
      </main>
      <Footer setActivePage={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
