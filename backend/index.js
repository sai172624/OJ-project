import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './database/db.js';
import User from './models/User.js';
import authRoutes from './router/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
dbConnection();

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Hello world is coming from backend index.js');
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);

// ✅ Start server
app.listen(port, () => console.log(`Server is running on port ${port}`));
