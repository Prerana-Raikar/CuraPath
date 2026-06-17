import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Enable React DevTools profiler
  const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook) {
    hook.onCommitFiberRoot = (id: any, root: any, priorityLevel: any) => {
      // Optional: Add performance monitoring here
    };
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Register service worker for better performance (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}