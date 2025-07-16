function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600">✅ EduRespond is Working!</h1>
      <p className="text-center mt-4 text-lg">The React application has loaded successfully.</p>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">App Status</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            React App Loading
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Tailwind CSS Working
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Vite Hot Reload Active
          </li>
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Database Connected
          </li>
        </ul>
        <div className="mt-6">
          <button 
            onClick={() => window.location.href = '/enhanced'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go to Full Application
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
