import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth.jsx';
import api from '../services/api';
import { HiShieldCheck, HiArrowLeft } from 'react-icons/hi';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.loginUser(formData);
      
      // Check if user has admin role
      if (response.data.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      
      login(response.data);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
            Admin Access
          </h1>
          <h2 className="mt-2 text-center text-xl text-red-100">
            Sign in to admin portal
          </h2>
          <p className="mt-2 text-center text-sm text-red-200">
            Don't have an admin account?{' '}
            <Link to="/admin/register" className="font-medium text-white hover:text-red-100 underline">
              Register here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-red-100 mb-2">
                Admin Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your admin email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                className="appearance-none relative block w-full px-3 py-3 border border-red-600 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-white"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
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
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-red-200 hover:text-white underline"
            >
              Regular user login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;