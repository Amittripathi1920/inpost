import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import FeedbackPage from "@/pages/FeedbackPage";
import './index.css';


import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import GeneratePost from "@/pages/GeneratePost";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      {/* Wrap everything in Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={
            isAuthenticated ? (
              <Navigate to={location.state?.from?.pathname || "/generate"} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="generate"
          element={
            <ProtectedRoute>
              <GeneratePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
