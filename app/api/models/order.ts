import mongoose, { Schema, model, models } from 'mongoose'

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    area: { type: String, required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'delivered'],
      default: 'pending',
    },
    scheduledFor: { type: String, required: true }, // HH:mm
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Partner' },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
)

const Order = models.Order || model('Order', OrderSchema)
export default Order
