import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Mounting App...');
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');
  createRoot(rootElement).render(
    <App />
  );
  console.log('App successfully mounted');
} catch (err) {
  console.error('App mounting failed:', err);
}
