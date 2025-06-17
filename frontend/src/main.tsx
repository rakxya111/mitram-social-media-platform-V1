import ReactDOM from 'react-dom/client';
import App from "./App";
import './globals.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "@/context/AuthContext"; // adjust the path if needed

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
