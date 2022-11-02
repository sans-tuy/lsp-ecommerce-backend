// Import mongoose to create the db Schema
import * as mongoose from 'mongoose';
// Use the Schema() from mongoose to define your db Schema
// Also, export the Schema to access it within the project
export const productSchema = new mongoose.Schema({
  // Details for the database info to be created for each product
  // A title field
  title: String,
  // A description field
  description: String,
  // An image URL
  image: String,
  // The price
  price: String,
  // Dates fields
  createdAt: {
    // timestamp
    // takes date type
    type: Date,
    // the field is created by default using the current timestamp
    default: Date.now,
  },
});
