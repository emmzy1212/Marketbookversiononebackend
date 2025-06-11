import { useState, useEffect } from 'react';
import { 
  HiUsers, 
  HiShoppingBag, 
  HiChartBar, 
  HiClock, 
  HiEye,
  HiShieldCheck,
  HiTrendingUp,
  HiRefresh
} from 'react-icons/hi';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [itemStats, setItemStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, itemStatsResponse, auditResponse] = await Promise.all([
        api.getDashboardStats(),
        api.getItemStats(),
        api.getAuditLogs({ limit: 10 })
      ]);

      setStats(dashboardResponse.data);
      setItemStats(itemStatsResponse.data);
      setAuditLogs(auditResponse.data.logs);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'text-green-600 bg-green-100';
      case 'UPDATE': return 'text-blue-600 bg-blue-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'LOGIN': return 'text-purple-600 bg-purple-100';
      case 'REGISTER': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HiShieldCheck className="h-8 w-8 text-red-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">System overview and analytics</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary flex items-center gap-2"
          >
            <HiRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.stats.totalUsers || 0}</p>
                <p className="text-sm text-green-600">
                  +{stats?.stats.recentUsers || 0} this month
                </p>
              </div>
              <HiUsers className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{itemStats?.totalItems || 0}</p>
                <p className="text-sm text-green-600">
                  +{itemStats?.recentItems || 0} this month
                </p>
              </div>
              <HiShoppingBag className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.stats.totalAdmins || 0}</p>
                <p className="text-sm text-gray-500">System administrators</p>
              </div>
              <HiShieldCheck className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.stats.recentActivity || 0}</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
              <HiTrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiChartBar className="h-5 w-5" />
              Activity by Type
            </h3>
            <div className="space-y-3">
              {stats?.activityByAction?.map((activity) => (
                <div key={activity._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity._id)}`}>
                      {activity._id}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">{activity.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items by Category */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiShoppingBag className="h-5 w-5" />
              Items by Category
            </h3>
            <div className="space-y-3">
              {itemStats?.itemsByCategory?.slice(0, 5).map((category) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{category._id}</span>
                    <p className="text-sm text-gray-500">
                      Avg: ${category.avgPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-lg shadow-md mt-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiClock className="h-5 w-5" />
              Recent Activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.user?.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;