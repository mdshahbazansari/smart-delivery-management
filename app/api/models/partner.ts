import mongoose, { Schema, model, models } from 'mongoose'

const PartnerSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    currentLoad: { type: Number, default: 0, max: 3 },
    areas: [String],
    shift: {
      start: String,
      end: String,
    },
    metrics: {
      rating: { type: Number, default: 0 },
      completedOrders: { type: Number, default: 0 },
      cancelledOrders: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

const Partner = models.Partner || model('Partner', PartnerSchema)
export default Partner
