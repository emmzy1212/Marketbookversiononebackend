import { useState, useEffect } from 'react';
import {
  HiCurrencyDollar,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiDocumentText
} from 'react-icons/hi';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

function FinancialSummary({ onViewItems }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const fetchFinancialSummary = async () => {
    try {
      const response = await api.getFinancialSummary();
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch financial summary');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <HiCurrencyDollar className="h-5 w-5" />
        Financial Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(summary.totalAmount)}
              </p>
              <p className="text-sm text-blue-600">{summary.totalItems} items</p>
            </div>
            <HiCurrencyDollar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Paid Amount */}
        <div
          className="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => onViewItems('paid')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(summary.paidAmount)}
              </p>
              <p className="text-sm text-green-600">{summary.paidItems} items</p>
            </div>
            <HiCheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Unpaid Amount */}
        <div
          className="bg-red-50 p-4 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => onViewItems('unpaid')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Unpaid Amount</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(summary.unpaidAmount)}
              </p>
              <p className="text-sm text-red-600">{summary.unpaidItems} items</p>
            </div>
            <HiXCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Pending Amount */}
        <div
          className="bg-yellow-50 p-4 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
          onClick={() => onViewItems('pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatCurrency(summary.pendingAmount)}
              </p>
              <p className="text-sm text-yellow-600">
                {summary.totalItems - summary.paidItems - summary.unpaidItems} items
              </p>
            </div>
            <HiClock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewItems('paid')}
          className="btn btn-outline text-sm flex items-center gap-1"
        >
          <HiDocumentText className="h-4 w-4" />
          View Paid Items
        </button>
        <button
          onClick={() => onViewItems('unpaid')}
          className="btn btn-outline text-sm flex items-center gap-1"
        >
          <HiDocumentText className="h-4 w-4" />
          View Unpaid Items
        </button>
      </div>
    </div>
  );
}

export default FinancialSummary;
