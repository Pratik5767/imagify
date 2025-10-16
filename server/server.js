import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => res.send('Api working'));

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));