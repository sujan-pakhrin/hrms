import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTempPassword: {
    type: Boolean,
    default: false
  },
  tempPasswordExpiry: {
    type: Date
  },
  requiresPasswordReset: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);