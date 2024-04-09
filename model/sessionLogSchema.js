import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  logoutTime: {
    type: Date
  }
});

const SessionLog = mongoose.model('SessionLog', sessionLogSchema);

export default SessionLog;
