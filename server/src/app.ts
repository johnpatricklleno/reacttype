import express from 'express';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';
import cors from "cors";

dotenv.config();
const app = express();

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:5173",
};


app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', projectRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;