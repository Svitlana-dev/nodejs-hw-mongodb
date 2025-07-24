import { Schema, model, Types } from 'mongoose';

const sessionSchema = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: 'User' },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenValidUntil: { type: Date, required: true },
  refreshTokenValidUntil: { type: Date, required: true },
});

export default model('Session', sessionSchema);
