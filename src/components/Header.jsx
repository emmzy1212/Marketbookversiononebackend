import { useState, useEffect } from 'react'
import { HiOutlineSearch, HiShieldCheck, HiLogout, HiUser, HiCog, HiChartBar } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import NotificationCenter from './NotificationCenter'

function Header({ filter, setFilter }) {
  const [scrolled, setScrolled] = useState(false)
  const [debouncedFilter, setDebouncedFilter] = useState(filter)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  
  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter(debouncedFilter)
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedFilter, setFilter])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])
  
  return (
    <header className={`sticky top-0 z-10 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-3' : 'bg-gradient-to-r from-primary-600 to-accent-600 py-4'
    }`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-primary-600' : 'text-white'
              }`}>
                MarketBook
              </h1>
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <NotificationCenter />
              
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    scrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="h-5 w-5" />
                  )}
                  <span className="hidden md:inline">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <HiShieldCheck className="h-4 w-4 text-red-500" />
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500 truncate">{user?.email}</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiCog className="h-4 w-4" />
                      Profile Settings
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HiChartBar className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {/* Admin Access for Regular Users */}
                    {user?.role !== 'admin' && (
                      <div className="border-t border-gray-100 mt-1">
                        <div className="px-4 py-2 text-xs text-gray-500 font-medium bg-gray-50">
                          Admin Access
                        </div>
                        <Link
                          to="/admin/login"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HiShieldCheck className="h-4 w-4 text-red-600" />
                          Admin Login
                        </Link>
                        <Link
                          to="/admin/register"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HiShieldCheck className="h-4 w-4 text-red-600" />
                          Admin Register
                        </Link>
                      </div>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1 transition-colors"
                    >
                      <HiLogout className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiOutlineSearch className={`${scrolled ? 'text-gray-500' : 'text-white'} h-5 w-5`} />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-2 rounded-md focus:outline-none transition-all duration-300 ${
                scrolled 
                  ? 'bg-gray-100 border border-gray-200 focus:border-primary-500' 
                  : 'bg-white/20 text-white placeholder:text-white/75 focus:bg-white/30'
              }`}
              placeholder="Search by name, description, or category..."
              value={debouncedFilter}
              onChange={(e) => setDebouncedFilter(e.target.value)}
              aria-label="Search items"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header