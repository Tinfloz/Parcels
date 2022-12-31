import express, { Request, Response, Express, application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { errorHandler } from "./middlewares/error.middleware";
import userRouter from "./routes/all.user.routes";
import chefRouter from "./routes/chef.routes";
import customerRouter from "./routes/customer.routes";
import menuRouter from "./routes/menu.routes";
import orderRouter from "./routes/order.routes";
import riderRouter from "./routes/rider.routes";

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

// routes
app.use("/api/user", userRouter);
app.use("/api/chef", chefRouter);
app.use("/api/customer", customerRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);
app.use("/api/rider", riderRouter);

app.use(errorHandler)
// listen
app.listen(port, (): void => console.log(`listening on port ${port}`))
