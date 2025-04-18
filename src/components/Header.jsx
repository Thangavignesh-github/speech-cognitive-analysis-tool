import React from 'react';
import { Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Mic className="h-8 w-8 text-white mr-3" />
          <h1 className="text-2xl font-bold text-white">Speech Cognitive Analysis</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-white hover:text-teal-100 transition-colors">Home</a></li>
            <li><a href="#" className="text-white hover:text-teal-100 transition-colors">About</a></li>
            <li><a href="#" className="text-white hover:text-teal-100 transition-colors">Documentation</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;