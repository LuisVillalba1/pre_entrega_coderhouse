import express from "express";
import { procesadoresAmd } from "../config/ProductManager.js"

const app = express();

app.use(express.json());

const PORT = 4000;

//obtenemos los productos
app.get("/products",async(req,res)=>{
    //en caso de que el usuario ingrese una query de limit
    const {limit} = req.query;
    await procesadoresAmd.getProducts(limit,res)
})

//obtenemos cierto producto
app.get("/products/:pid",async(req,res)=>{
    await procesadoresAmd.getProductById(req.params.pid,res);
})

app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto:${PORT}`);
})