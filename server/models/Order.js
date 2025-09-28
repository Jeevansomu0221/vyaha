const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  variant: Object
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [OrderItemSchema],
  subtotal: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String,
  status: { type: String, enum: ['Pending','Processing','Shipped','Delivered','Cancelled'], default: 'Pending' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
