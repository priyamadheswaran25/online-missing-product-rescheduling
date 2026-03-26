import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  orderId: { type: String, required: true },
  productName: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  issueType: { type: String, required: true },
  rescheduleDate: { type: Date, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Cancel'] }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
