import { Router } from "express";
import { procesadoresAmd } from "../config/ProductManager.js";

const productRouter = Router();


productRouter.get("/",async(req,res)=>{
    //en caso de que el usuario ingrese una query de limit
    const {limit} = req.query;
    await procesadoresAmd.getProducts(limit,res)
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