import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-money-green rounded-2xl flex items-center justify-center shadow-lg shadow-money-green/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">PFinances AI</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your budget with AI</p>

        <button
          onClick={handleLogin}
          className="w-full bg-money-green hover:bg-money-green-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md shadow-money-green/20 flex items-center justify-center gap-2"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
