import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    mediaFiles: [{
      url: String,
      type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
      },
      filename: String,
      size: Number
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Customer management fields
    customerName: {
      type: String,
      default: '',
    },
    customerPhone: {
      type: String,
      default: '',
    },
    customerEmail: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending'],
      default: 'unpaid',
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Generate invoice number before saving
itemSchema.pre('save', function(next) {
  if (!this.invoiceNumber && this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.invoiceNumber = `INV-${timestamp}-${random}`;
  }
  next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;