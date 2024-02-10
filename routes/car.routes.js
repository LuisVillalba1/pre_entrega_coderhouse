import { Router } from "express";
import crypto from "crypto"
import { carManager } from "../config/cartsManager.js";

const carstRouter = Router();
//obtenemos la ruta de nuestro json de los carritos
const carRoute = "./database/car.json";

//creamos un nuevo carrito
carstRouter.post("/",async (req,res)=>{
    const id = crypto.randomBytes(10).toString("hex");

    const newCar = new carManager(carRoute);

    await newCar.createCar(id,res);
})


carstRouter.get("/:cid",async(req,res)=>{
    const cart = new carManager(carRoute);
    const {cid} = req.params

    await cart.getProductsCart(cid,res);
})

carstRouter.post("/:cid/product/:pid",async(req,res)=>{
    const cart = new carManager(carRoute);

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