import './App.css'
import Router from "@/components/Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {

  return (
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
  )
}

export default App
