import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  status: {
    type: String,
    enum: ['assigned', 'completed', 'canceled'], // Ensure "assigned" is listed
    default: 'assigned',
  },
  assignedAt: { type: Date, default: Date.now },
})

const Assignment =
  mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema)

export default Assignment
