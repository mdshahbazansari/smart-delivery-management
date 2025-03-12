import mongoose from 'mongoose'

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/smartdelivery'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error)
  }
}
