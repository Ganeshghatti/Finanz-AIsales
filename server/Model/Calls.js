// Calls.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Calls Schema
const callsSchema = new Schema({
  call_id: {
    type: String,
    required: true,
    unique: true,
  },
  corrected_duration: {
    type: String,
  },
  created_at: {
    type: String,
    required: true,
  },
  call_length: {
    type: Number,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
  },
  email: {
    type: String,
  },
  meeting_requested: {
    type: Boolean,
  },
  meeting_time: {
    type: String,
  },
});

const Calls = mongoose.model("Calls", callsSchema);
module.exports = Calls;
