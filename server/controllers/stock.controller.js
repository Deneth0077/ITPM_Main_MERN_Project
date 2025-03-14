import Stock from "../models/stock.js"; // Import Stock model
import { cloudinary } from "../index.js"; // Import cloudinary instance from server.js

/**
 * Uploads an image to Cloudinary if provided
 * @param {Object} file - The uploaded file from Multer
 * @returns {Promise<string|null>} - Cloudinary URL or null
 */
const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.buffer, { // Use buffer with memoryStorage
    folder: "homestock",
  });
  return result.secure_url;
};

/**
 * Creates a new stock item
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createStock = async (req, res) => {
  try {
    const { name, category, quantity, unit, expirationDate, notes, user } = req.body;
    const imageUrl = await uploadImageToCloudinary(req.file);

    const newStock = new Stock({
      name,
      category,
      quantity,
      unit,
      expirationDate,
      notes,
      user,
      image: imageUrl,
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    res.status(500).json({ message: "Error creating stock item", error: error.message });
  }
};

/**
 * Retrieves all stock items
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find().populate("user", "name email");
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error: error.message });
  }
};

/**
 * Retrieves a stock item by ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getStockDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id).populate("user", "name email");
    if (!stock) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock item", error: error.message });
  }
};

/**
 * Updates a stock item
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const imageUrl = await uploadImageToCloudinary(req.file);

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { ...updates, ...(imageUrl && { image: imageUrl }) }, // Only update image if new one is uploaded
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }
    res.status(200).json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: "Error updating stock item", error: error.message });
  }
};

/**
 * Deletes a stock item
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    if (stock.image) {
      const publicId = stock.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`homestock/${publicId}`);
    }

    await stock.deleteOne();
    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock item", error: error.message });
  }
};