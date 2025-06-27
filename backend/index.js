import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './database/db.js';
import User from './models/User.js';

import authRoutes from './router/authRoutes.js';
import adminRoutes from './router/adminRoutes.js';
import problemRoutes from "./router/ProblemRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT;

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Connect to MongoDB
dbConnection();


app.get('/', (req, res) => {
  res.send('Hello world is coming from backend index.js');
});

// ✅ register and login
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use("/problems", problemRoutes);


// ✅ Start server
app.listen(port, () => console.log(`Server is running on port ${port}`));
