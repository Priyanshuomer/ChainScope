import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Core Web Vitals for advanced SEO tracking
import './lib/core-web-vitals'

createRoot(document.getElementById("root")!).render(<App />);
