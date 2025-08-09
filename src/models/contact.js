import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number format'],
    },
    email: { type: String, trim: true, lowercase: true },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    photo: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: 'Invalid photo URL',
      },
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
