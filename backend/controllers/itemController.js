import Item from '../models/itemModel.js';
import Notification from '../models/notificationModel.js';
import { createAuditLog } from '../middleware/auditMiddleware.js';

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getItems = async (req, res) => {
  try {
    let items;
    
    // If user is admin, get all items; otherwise, get only user's items
    if (req.user.role === 'admin') {
      items = await Item.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });
    } else {
      items = await Item.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    }
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Private
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item or is admin
    if (req.user.role !== 'admin' && item.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      inStock, 
      imageUrl,
      customerName,
      customerPhone,
      customerEmail,
      paymentStatus,
      dueDate,
      notes
    } = req.body;
    
    // Handle uploaded files
    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = req.files.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        filename: file.filename,
        size: file.size
      }));
    }
    
    const newItem = await Item.create({
      name,
      description,
      category,
      price,
      inStock,
      imageUrl,
      mediaFiles,
      customerName,
      customerPhone,
      customerEmail,
      paymentStatus,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes,
      createdBy: req.user._id,
    });
    
    const populatedItem = await Item.findById(newItem._id).populate('createdBy', 'name email');
    
    // Create audit log
    await createAuditLog(
      req.user, 
      'CREATE', 
      'ITEM', 
      newItem._id, 
      `Created item: ${name} (Invoice: ${newItem.invoiceNumber})`, 
      req
    );

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Item Created',
      message: `Your item "${name}" has been created successfully with invoice number ${newItem.invoiceNumber}.`,
      type: 'SUCCESS',
    });

    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      inStock, 
      imageUrl,
      customerName,
      customerPhone,
      customerEmail,
      paymentStatus,
      dueDate,
      notes
    } = req.body;
    
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item or is admin
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldData = {
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      inStock: item.inStock,
      paymentStatus: item.paymentStatus,
    };
    
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      const newMediaFiles = req.files.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        filename: file.filename,
        size: file.size
      }));
      item.mediaFiles = [...item.mediaFiles, ...newMediaFiles];
    }
    
    item.name = name || item.name;
    item.description = description || item.description;
    item.category = category || item.category;
    item.price = price !== undefined ? price : item.price;
    item.inStock = inStock !== undefined ? inStock : item.inStock;
    item.imageUrl = imageUrl || item.imageUrl;
    item.customerName = customerName || item.customerName;
    item.customerPhone = customerPhone || item.customerPhone;
    item.customerEmail = customerEmail || item.customerEmail;
    item.paymentStatus = paymentStatus || item.paymentStatus;
    item.dueDate = dueDate ? new Date(dueDate) : item.dueDate;
    item.notes = notes || item.notes;
    
    const updatedItem = await item.save();
    const populatedItem = await Item.findById(updatedItem._id).populate('createdBy', 'name email');
    
    // Create audit log
    const changes = [];
    Object.keys(oldData).forEach(key => {
      if (oldData[key] !== updatedItem[key]) {
        changes.push(`${key}: ${oldData[key]} → ${updatedItem[key]}`);
      }
    });
    
    await createAuditLog(
      req.user, 
      'UPDATE', 
      'ITEM', 
      item._id, 
      `Updated item: ${item.name} (${changes.join(', ')})`, 
      req
    );

    // Create notification
    await Notification.create({
      user: item.createdBy,
      title: 'Item Updated',
      message: `Your item "${item.name}" has been updated.`,
      type: 'INFO',
    });

    res.status(200).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item or is admin
    if (req.user.role !== 'admin' && item.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Create audit log before deletion
    await createAuditLog(
      req.user, 
      'DELETE', 
      'ITEM', 
      item._id, 
      `Deleted item: ${item.name} (Invoice: ${item.invoiceNumber})`, 
      req
    );

    // Create notification
    await Notification.create({
      user: item.createdBy,
      title: 'Item Deleted',
      message: `Your item "${item.name}" has been deleted.`,
      type: 'WARNING',
    });
    
    await Item.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all items (Admin only)
// @route   GET /api/items/admin/all
// @access  Private/Admin
export const getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get item statistics (Admin only)
// @route   GET /api/items/stats
// @access  Private/Admin
export const getItemStats = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const inStockItems = await Item.countDocuments({ inStock: true });
    const outOfStockItems = await Item.countDocuments({ inStock: false });
    const paidItems = await Item.countDocuments({ paymentStatus: 'paid' });
    const unpaidItems = await Item.countDocuments({ paymentStatus: 'unpaid' });
    
    // Get items by category
    const itemsByCategory = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get payment statistics
    const paymentStats = await Item.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$price' }
        }
      }
    ]);

    // Get recent items (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentItems = await Item.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.status(200).json({
      totalItems,
      inStockItems,
      outOfStockItems,
      paidItems,
      unpaidItems,
      recentItems,
      itemsByCategory,
      paymentStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's financial summary
// @route   GET /api/items/financial-summary
// @access  Private
// @desc    Get user's financial summary (NGN version, no formatting)
// @route   GET /api/items/financial-summary
// @access  Private
export const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await Item.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$price', 0]
            }
          },
          unpaidAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'unpaid'] }, '$price', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$price', 0]
            }
          },
          totalItems: { $sum: 1 },
          paidItems: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0]
            }
          },
          unpaidItems: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'unpaid'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = summary[0] || {
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0,
      pendingAmount: 0,
      totalItems: 0,
      paidItems: 0,
      unpaidItems: 0
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('getFinancialSummary Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get items by payment status
// @route   GET /api/items/by-payment-status/:status
// @access  Private
export const getItemsByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const userId = req.user.role === 'admin' ? undefined : req.user._id;
    
    const query = { paymentStatus: status };
    if (userId) {
      query.createdBy = userId;
    }
    
    const items = await Item.find(query)
      .populate('createdBy', 'name email phone location')
      .sort({ createdAt: -1 });
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};