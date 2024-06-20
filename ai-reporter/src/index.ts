import {Routes} from "./routes";
import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

const app = express();
const corsOptions = {
    origin: ['http://localhost:4200', 'http://www.mhagnet.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Information'],
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
const port = process.env.PORT || 8001;
new Routes(app);
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
