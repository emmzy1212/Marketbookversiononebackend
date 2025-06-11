import { useState, useEffect } from 'react'
import Header from '../components/Header'
import ItemList from '../components/ItemList'
import ItemForm from '../components/ItemForm'
import InvoiceModal from '../components/InvoiceModal'
import FinancialSummary from '../components/FinancialSummary'
import api from '../services/api'
import { HiOutlinePlus, HiFilter } from 'react-icons/hi'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth.jsx'

function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [filter, setFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedInvoiceItem, setSelectedInvoiceItem] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const { user, logout } = useAuth()

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await api.getItems()
      setItems(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch items')
      toast.error('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  // Fetch items by payment status
  const fetchItemsByPaymentStatus = async (status) => {
    try {
      setLoading(true)
      const response = await api.getItemsByPaymentStatus(status)
      setItems(response.data)
      setPaymentFilter(status)
      setError(null)
    } catch (err) {
      setError('Failed to fetch items')
      toast.error('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchItems()
  }, [])

  // Handle creating a new item
  const handleCreateItem = async (itemData) => {
    try {
      const response = await api.createItem(itemData)
      setItems([response.data, ...items])
      setShowForm(false)
      toast.success('Item created successfully!')
      // Refresh to get updated data
      fetchItems()
    } catch (err) {
      toast.error('Failed to create item')
    }
  }

  // Handle updating an item
  const handleUpdateItem = async (id, itemData) => {
    try {
      const response = await api.updateItem(id, itemData)
      setItems(items.map(item => item._id === id ? response.data : item))
      setShowForm(false)
      setCurrentItem(null)
      toast.success('Item updated successfully!')
      // Refresh to get updated data
      fetchItems()
    } catch (err) {
      toast.error('Failed to update item')
    }
  }

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      await api.deleteItem(id)
      setItems(items.filter(item => item._id !== id))
      toast.success('Item deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete item')
    }
  }

  // Handle viewing invoice
  const handleViewInvoice = (item) => {
    setSelectedInvoiceItem(item)
    setShowInvoiceModal(true)
  }

  // Handle viewing items by payment status
  const handleViewItemsByStatus = (status) => {
    if (status === 'all') {
      fetchItems()
    } else {
      fetchItemsByPaymentStatus(status)
    }
  }

  // Filter items based on search and payment status
  const filteredItems = items.filter(item => {
    const searchTerm = filter.toLowerCase()
    const matchesSearch = (
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchTerm)) ||
      (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchTerm))
    )
    
    if (paymentFilter === 'all') {
      return matchesSearch
    }
    
    return matchesSearch && item.paymentStatus === paymentFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        filter={filter} 
        setFilter={setFilter}
        user={user}
        onLogout={logout}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Financial Summary */}
        <FinancialSummary onViewItems={handleViewItemsByStatus} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Items</h2>
            {filter && (
              <p className="text-sm text-gray-600 mt-1">
                Showing results for "{filter}"
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            {/* Payment Filter */}
            <div className="flex items-center gap-2">
              <HiFilter className="h-5 w-5 text-gray-500" />
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value)
                  handleViewItemsByStatus(e.target.value)
                }}
                className="form-input text-sm"
              >
                <option value="all">All Items</option>
                <option value="paid">Paid Items</option>
                <option value="unpaid">Unpaid Items</option>
                <option value="pending">Pending Items</option>
              </select>
            </div>

            <button 
              className="btn btn-primary flex items-center gap-2"
              onClick={() => {
                setCurrentItem(null)
                setShowForm(true)
              }}
            >
              <HiOutlinePlus className="text-lg" />
              Add New Item
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 animate-fade-in">
            {error}
          </div>
        )}
        
        {showForm && (
          <div className="mb-8 animate-slide-up">
            <ItemForm 
              currentItem={currentItem} 
              onSubmit={currentItem ? handleUpdateItem : handleCreateItem}
              onCancel={() => {
                setShowForm(false)
                setCurrentItem(null)
              }}
            />
          </div>
        )}
        
        <ItemList 
          items={filteredItems} 
          loading={loading} 
          onEdit={(item) => {
            setCurrentItem(item)
            setShowForm(true)
          }}
          onDelete={handleDeleteItem}
          onViewInvoice={handleViewInvoice}
        />

        {/* Invoice Modal */}
        <InvoiceModal
          item={selectedInvoiceItem}
          user={user}
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false)
            setSelectedInvoiceItem(null)
          }}
        />
      </main>
    </div>
  )
}

export default Dashboard