import './App.css'
import Router from "@/components/Router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer
          autoClose={4000}
          closeOnClick
          newestOnTop
          pauseOnFocusLoss={false}
          position="top-right"
          theme="colored"
        />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App