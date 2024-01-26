import mongoose, { Schema, Document } from 'mongoose'

// Define User schema interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
}

// Create Schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// Define and export User model
const User = mongoose.model < IUser > ('users', UserSchema)
export default User
