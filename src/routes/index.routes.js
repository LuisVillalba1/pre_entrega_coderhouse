import { Router } from "express";
import carstRouter from "./car.routes.js";
import productRouter from "./products.routes.js";
import messageRoute from "./message.routes.js";

const indexRouter = Router();

//routes
indexRouter.use("/carts",carstRouter);
indexRouter.use("/products",productRouter)
indexRouter.use("/message",messageRoute);

export default indexRouter