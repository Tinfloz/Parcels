import express, { Request, Response, Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());

// connect to mongo 
mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions).then((res): void => console.log("connected to mongo db"))
    .catch((err): void => console.log(err))

// test route
app.get("/", (req: Request, res: Response): void => {
    res.json({
        success: true,
        message: "server is up and running!"
    });
});

app.use(errorHandler)
// listen
app.listen(port, (): void => console.log(`listening on port ${port}`))
