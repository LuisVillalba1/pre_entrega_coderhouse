import { Router } from "express";
import {promises as fs} from "fs"

const realTimeProducts = Router();
const path = "./src/database/productos.json";

realTimeProducts.get("/",async (req,res)=>{
    const data = await (fs.readFile(path,"utf-8"));
    let products = JSON.parse(data);
    res.render("realTimeProducts",{
    });
})

export default realTimeProducts;


