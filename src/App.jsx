import React from 'react';
import { AnalysisProvider } from './context/AnalysisContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <AnalysisProvider>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </AnalysisProvider>
  );
}

export default App;