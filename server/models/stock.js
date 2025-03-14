import mongoose from "mongoose";

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
