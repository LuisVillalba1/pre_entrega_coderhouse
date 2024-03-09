import { Router } from "express";
import { procesadoresAmd } from "../config/ProductManager.js";
import { productModel } from "../models/productsModel.js";

const productRouter = Router();


productRouter.get("/",async(req,res)=>{
    //mostramos la vista de productos
    await procesadoresAmd.getProducts(res)
})

//obtenemos cierto producto
productRouter.get("/:pid",async(req,res)=>{
    await procesadoresAmd.getProductById(req.params.pid,res);
})

productRouter.post("/",async(req,res)=>{
    await procesadoresAmd.addProduct(req.body,res);
})

productRouter.put("/:pid",async(req,res)=>{
    const id = req.params.pid
    await procesadoresAmd.updateProduct(id,req.body,res);
})

productRouter.delete("/:pid",async(req,res)=>{
    const id = req.params.pid;

    await procesadoresAmd.deleteProduct(id,res);
})

export default productRouter;