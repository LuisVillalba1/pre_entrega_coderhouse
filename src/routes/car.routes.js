import { Router } from "express";
import { carManager } from "../config/cartsManager.js";
import { cartsModel } from "../models/cartsModel.js";

const carstRouter = Router();
//obtenemos la ruta de nuestro json de los carritos
const carRoute = "./src/database/car.json";

//creamos un nuevo carrito
carstRouter.post("/",async (req,res)=>{
    let newCart = await cartsModel.create({});

    return res.json({
        message : `El id de su carrito es: ${newCart._id}`
    })
})

//obtenemos cierto carrito
carstRouter.get("/:cid",async(req,res)=>{
    const cart = new carManager();
    const {cid} = req.params

    await cart.getProductsCart(cid,res);
})

carstRouter.post("/:cid/product/:pid",async(req,res)=>{
    const cart = new carManager();

    //obtenemos la cantidad del producto que se desea añadir
    const {quantity} = req.body;
    const {cid,pid} = req.params;

    if(!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0){
        return res.status(404).send("Por favor ingrese un quantity correcto")
    }
    
    //añadimos el producto con un numero redondo
    await cart.addProduct(cid,pid,parseInt(quantity),res);
})


export default carstRouter