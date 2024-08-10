import AuthLayout from "@/layouts/AuthLayout.tsx";
import {LoginPage} from "@/pages/auth/LoginPage.tsx";
import {RegisterPage} from "@/pages/auth/RegisterPage.tsx";
import {ChatPage} from "@/pages/ChatPage.tsx";
import {Navigate} from "react-router-dom";
import {useAuth} from "@/context/authContext.tsx";
import {ReactNode} from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace={true} />
}

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace={true} />
}

const routes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <AuthRoute><LoginPage /></AuthRoute>
      },
      {
        path: '/register',
        element: <AuthRoute><RegisterPage /></AuthRoute>
      },
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>
  }
]

export default routes