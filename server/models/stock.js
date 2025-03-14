import mongoose from "mongoose";

/**
 * @typedef {Object} StockSchema
 * @property {string} name - Name of the stock item (e.g., "Apples")
 * @property {string} category - Category of the item (e.g., "Fruits")
 * @property {number} quantity - Quantity in stock
 * @property {string} unit - Unit of measurement (e.g., "kg")
 * @property {Date} [expirationDate] - Optional expiration date
 * @property {Date} addedDate - Date the item was added
 * @property {string} [notes] - Optional notes
 * @property {mongoose.Types.ObjectId} user - Reference to the user who added it
 * @property {string} [image] - URL of the stock image
 */

const StockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["Fruits", "Vegetables", "Grains", "Dairy", "Other"],
    required: true,
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    enum: ["kg", "grams", "liters", "units"],
    default: "units",
  },
  expirationDate: { type: Date },
  addedDate: { type: Date, default: Date.now },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
});

const Stock = mongoose.model("Stock", StockSchema);

export default Stock;