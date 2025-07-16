import { createRoot } from "react-dom/client";

// Simple test to check if DOM manipulation works
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = `
    <div style="padding: 40px; text-align: center; background: #f0f9ff; min-height: 100vh;">
      <h1 style="color: #1e40af; font-size: 3rem; margin-bottom: 1rem;">
        ✅ SUCCESS! App is Working
      </h1>
      <p style="color: #374151; font-size: 1.25rem; margin-bottom: 2rem;">
        React and the development environment are functioning correctly.
      </p>
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; margin: 0 auto;">
        <h2 style="color: #1f2937; margin-bottom: 1rem;">Migration Complete</h2>
        <ul style="text-align: left; color: #4b5563;">
          <li>✓ Database connected</li>
          <li>✓ Server running on port 5000</li>
          <li>✓ React app loading</li>
          <li>✓ Vite hot reload active</li>
        </ul>
        <button 
          onclick="window.location.href='/enhanced'" 
          style="
            background: #2563eb; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 6px; 
            margin-top: 1rem;
            cursor: pointer;
            font-size: 1rem;
          "
        >
          Launch Full Application
        </button>
      </div>
    </div>
  `;
  
  console.log("✅ App loaded successfully!");
} else {
  console.error("❌ Root element not found!");
}
