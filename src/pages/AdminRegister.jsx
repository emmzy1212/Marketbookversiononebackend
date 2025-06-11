import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth.jsx';
import api from '../services/api';
import { HiShieldCheck, HiArrowLeft, HiInformationCircle } from 'react-icons/hi';

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    if (!formData.adminCode) {
      return toast.error('Admin code is required');
    }

    setLoading(true);

    try {
      const response = await api.registerAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode,
      });
      
      login(response.data);
      toast.success('Admin account created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Dashboard Button */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-red-200 hover:text-white transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

        <div>
          <div className="flex justify-center">
            <div className="bg-red-600 p-3 rounded-full shadow-lg">
              <HiShieldCheck className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mt-4 text-center text-4xl font-extrabold text-white">
            Admin Registration
          </h1>
          <h2 className="mt-2 text-center text-xl text-red-100">
            Create admin account
          </h2>
          <p className="mt-2 text-center text-sm text-red-200">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="font-medium text-white hover:text-red-100 underline">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-red-100 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-red-100 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-red-100 mb-2">
                Admin Code
              </label>
              <input
                id="adminCode"
                name="adminCode"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Enter admin code"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-red-100 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-red-100 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Admin Code Info */}
          <div className="bg-red-800 border border-red-600 rounded-md p-4">
            <div className="flex items-start gap-3">
              <HiInformationCircle className="h-5 w-5 text-red-200 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-100">Admin Code Required</h3>
                <p className="text-xs text-red-200 mt-1">
                  For demo purposes, use: <span className="font-mono bg-red-700 px-1 rounded">ADMIN2024</span>
                </p>
                <p className="text-xs text-red-300 mt-1">
                  In production, this would be a secure code provided by system administrators.
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-red-900 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <HiShieldCheck className="h-5 w-5 text-red-600 group-hover:text-red-500" />
              </span>
              {loading ? 'Creating account...' : 'Create Admin Account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-red-200 hover:text-white underline"
            >
              Regular user registration
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;