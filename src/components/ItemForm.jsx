import { useState, useEffect } from 'react'
import { HiX, HiCloudUpload, HiTrash } from 'react-icons/hi'

const initialFormState = {
  name: '',
  description: '',
  category: '',
  price: '',
  inStock: true,
  imageUrl: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  paymentStatus: 'unpaid',
  dueDate: '',
  notes: ''
}

function ItemForm({ currentItem, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name,
        description: currentItem.description,
        category: currentItem.category,
        price: currentItem.price.toString(),
        inStock: currentItem.inStock,
        imageUrl: currentItem.imageUrl || '',
        customerName: currentItem.customerName || '',
        customerPhone: currentItem.customerPhone || '',
        customerEmail: currentItem.customerEmail || '',
        paymentStatus: currentItem.paymentStatus || 'unpaid',
        dueDate: currentItem.dueDate ? new Date(currentItem.dueDate).toISOString().split('T')[0] : '',
        notes: currentItem.notes || ''
      })
    }
  }, [currentItem])
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number'
    }
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }
    
    return newErrors
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    const urls = files.map(file => (
      file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    ))
    setPreviewUrls(urls)
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    const submitData = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        submitData.append(key, formData[key])
      }
    })
    selectedFiles.forEach(file => {
      submitData.append('mediaFiles', file)
    })

    if (currentItem) {
      onSubmit(currentItem._id, submitData)
    } else {
      onSubmit(submitData)
    }
  }

  const formatNaira = (amount) => {
    const num = Number(amount)
    if (isNaN(num)) return ''
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(num)
  }

  return (
    <div className="card p-6 relative animate-slide-up">
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <HiX className="h-5 w-5" />
      </button>
      
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {currentItem ? 'Edit Item' : 'Add New Item'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Item Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Item Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="form-label">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="category" className="form-label">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="price" className="form-label">Price (₦) *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              {formData.price && !isNaN(Number(formData.price)) && (
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: <span className="font-medium">{formatNaira(formData.price)}</span>
                </p>
              )}
            </div>
            <div>
              <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="form-input"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="form-label">Customer Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="form-input"
                placeholder="Customer's full name"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="form-label">Customer Phone</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="(080) 123-4567"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="form-label">Customer Email</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`form-input ${errors.customerEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="customer@example.com"
              />
              {errors.customerEmail && <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>}
            </div>
            <div>
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Media Files</h3>
          <div>
            <label htmlFor="imageUrl" className="form-label">Image URL (optional)</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Upload Files (Images/Videos)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <HiCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">Images/videos up to 50MB each</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      {file.type.startsWith('image/') ? (
                        <img src={previewUrls[index]} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">Video</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            className="form-input"
            placeholder="Additional notes or comments..."
          ></textarea>
        </div>

        {/* In Stock */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
            In Stock
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {currentItem ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ItemForm
