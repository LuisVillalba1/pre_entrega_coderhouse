import express from "express";
import { engine } from "express-handlebars";
import {fileURLToPath} from "url";
import path, { dirname } from "path";
import { Server } from "socket.io";
import * as productManagerUtils from "./config/ProductManager.js";
import mongoose from "mongoose";
import { productModel } from "./models/productsModel.js";
import indexRouter from "./routes/index.routes.js";
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 8080;

const server = app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto:${PORT}`);
});

//creamos nuestro servidor con socket.io
export const io = new Server(server);

//coneccion con la base de datos 

mongoose.connect("mongodb+srv://luisvillalb03:realg4li@coder.1vbxxvc.mongodb.net/?retryWrites=true&w=majority&appName=coder")
.then(console.log("conneccion exitosa"))
.catch((e)=>console.log(e))


io.on("connection",async (socket)=>{
    console.log("cliente conectado");

    //obtenemos los productos
    let products = await productModel.find();

    await productManagerUtils.sendProducts(products,socket)

    //eliminamos un producto
    socket.on("deleteProduct",async(id)=>{
        try{
            await productManagerUtils.deleteProduct(id,socket)
        }
        catch(e){
            socket.emit("errorDelete",e.message);
        }

    })

    //update de un producto
    socket.on("updateProduct",async(data)=>{
        try{
            productManagerUtils.updateProduct(data,socket)
        }
        catch(e){
            //en caso de que ocurra un error lo enviamos
            socket.emit("errorEdit",e.message)
        }
    })

    socket.on("createProduct",async data=>{
        try{
            productManagerUtils.createProduct(data,socket)
        }
        catch(e){
            socket.emit("errorCreate",e.message);
        }
    })
})


//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views",path.join(__dirname,"views"));

//routes
app.use(indexRouter)


