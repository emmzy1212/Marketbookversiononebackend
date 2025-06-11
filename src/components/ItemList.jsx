import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineTag,
  HiUser,
  HiOutlineDocumentText,
  HiOutlineClock
} from 'react-icons/hi'
import LoadingSpinner from './LoadingSpinner'
import useAuth from '../hooks/useAuth'

function ItemList({ items, loading, onEdit, onDelete, onViewInvoice }) {
  const { user } = useAuth()

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    return statusConfig[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
        <HiOutlineTag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
        <p className="mt-1 text-gray-500">Get started by creating a new item.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {items.map((item) => (
        <div
          key={item._id}
          className="card group hover:shadow-lg transition-all duration-200"
        >
          {/* Media Display */}
          {item.mediaFiles && item.mediaFiles.length > 0 ? (
            <div className="h-48 overflow-hidden">
              {item.mediaFiles[0].type === 'image' ? (
                <img
                  src={item.mediaFiles[0].url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <video
                  src={item.mediaFiles[0].url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
          ) : item.imageUrl ? (
            <div className="h-48 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <HiOutlineTag className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                <span className="badge bg-secondary-100 text-secondary-800">
                  {item.category}
                </span>
              </div>
              <span className="text-lg font-bold text-primary-600">
                ₦{item.price.toFixed(2)}
              </span>
            </div>

            {/* Invoice Number */}
            {item.invoiceNumber && (
              <div className="text-xs text-gray-500 mb-2">
                Invoice: {item.invoiceNumber}
              </div>
            )}

            {/* Customer Info */}
            {item.customerName && (
              <div className="text-sm text-gray-600 mb-2">
                Customer: {item.customerName}
              </div>
            )}

            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>

            {/* Show creator info for admins */}
            {user?.role === 'admin' && item.createdBy && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <HiUser className="h-3 w-3" />
                <span>Created by: {item.createdBy.name}</span>
              </div>
            )}

            {/* Date and Time */}
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <HiOutlineClock className="h-3 w-3" />
              <span>{formatDate(item.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <span className={`badge ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className={`badge ${getPaymentStatusBadge(item.paymentStatus)}`}>
                  {item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)}
                </span>
              </div>

              <div className="flex gap-2">
                {/* Invoice button */}
                <button
                  onClick={() => onViewInvoice(item)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="View Invoice"
                >
                  <HiOutlineDocumentText className="h-5 w-5" />
                </button>

                {/* Edit/Delete buttons (admin or creator) */}
                {(user?.role === 'admin' || item.createdBy?._id === user?._id || item.createdBy === user?._id) && (
                  <>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                    >
                      <HiOutlinePencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItemList
