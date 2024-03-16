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
    try{
        const cart = new carManager();
        const {cid} = req.params
    
        let products = await cart.getProductsCart(cid,res);
        //agregamos la propiedad para obtener el precio total de la aquisicion
        for(let i of products){
            i.productID.totalPrice = i.productID.price * i.quantity
        }
    
        res.render("cart",{products,css : "../css/cart.css",js : "../js/cart.js"});
    }
    catch(e){
        if(e instanceof Error){
            return res.status(404).send(e.message)
        }
        return res.status(500).send("Ha ocurrido un error")
    }
})

//modificamos la cantidad de productos en el carrito
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

//eliminamos un producto de un carrito
carstRouter.delete("/:cid/product/:pid",async (req,res)=>{
    try{
        const {cid,pid} = req.params;

        const cart = new carManager();

        await cart.deleteProduct(cid,pid)
        
        return res.send("Se ha eliminado el producto correctamente")
    }
    catch(e){
        if(e instanceof Error){
            return res.status(404).send(e.message)
        }
        return res.status(500).send(e)
    }
})

//eliminamos todos los productos de un carrito
carstRouter.delete("/:cid",async(req,res)=>{
    try{
        const {cid} = req.params;

        const cart = new carManager();

        await cart.deleteAllProducts(cid);

        return res.send("se han eliminado todos los productos del carrito")
    }
    catch(e){
        if(e instanceof Error){
            return res.status(404).send(e.message)
        }
        return res.send(e);
    }
})

//modificamos todo el objeto de productos de un carrito
carstRouter.put("/:cid",async(req,res)=>{
    try{
        const {body} = req;
        const {cid} = req.params;
    
        const cart = new carManager();
    
        const response = await cart.updateAllCart(cid,body)

        //enviamos como quedo el objeto
        return res.status(201).send(response);
    }   
    catch(e){
        if(e instanceof Error){
            return res.status(404).send(e.message)
        }
        return res.status(500).send(e)
    }
})
//actualizamos la cantidad de un producto que se encuentra en el carrito
carstRouter.put("/:cid/products/:pid",async(req,res)=>{
    try{
        const {body} = req;
        const {cid,pid} = req.params;

        const cart = new carManager();

        const response = await cart.updateProductQuantity(cid,body,pid)

        return res.status(201).send(response)
    }
    catch(e){
        if(e instanceof Error){
            return res.status(404).send(e.message)
        }
        return res.status(500).send(e);
    }
})


export default carstRouter