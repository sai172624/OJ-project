import express from 'express';
import cors from 'cors';
import { dbConnection } from './database/db.js';
import dotenv from 'dotenv';
import compilerRoutes from './routes/compilerRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT 

// Middlewares
app.use(cors());
app.use(express.json());



// Connect to MongoDB
dbConnection();

// Routes

app.use('/api', compilerRoutes);

app.get('/', (req, res) => {
    res.send('Hello world is coming from compiler index.js');
});

app.listen(PORT, () => {
  console.log(`🚀 compiler Server running on port `);
});
