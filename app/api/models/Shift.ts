import mongoose from 'mongoose'

const ShiftSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  start: { type: String, required: true }, // Example: "09:00 AM"
  end: { type: String, required: true }, // Example: "05:00 PM"
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
},{timestamps:true})

export default mongoose.models.Shift || mongoose.model('Shift', ShiftSchema)
