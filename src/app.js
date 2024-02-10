import express from "express";
import productRouter from "../routes/products.routes.js";
import carstRouter from "../routes/car.routes.js";

const app = express();

app.use(express.json());
app.use("/products",productRouter)
app.use("/carts",carstRouter);
const PORT = 4000;

app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto:${PORT}`);
})