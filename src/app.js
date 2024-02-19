import express from "express";
import productRouter from "./routes/products.routes.js"
import carstRouter from "./routes/car.routes.js";
import { engine } from "express-handlebars";
import {fileURLToPath} from "url";
import path, { dirname } from "path";
import { Server } from "socket.io";
import {promises as fs} from "fs";
import * as productManagerUtils from "./config/ProductManager.js";
import crypto from "crypto";
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 8080;

const server = app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto:${PORT}`);
});

//creamos nuestro servidor con socket.io

export const io = new Server(server);

io.on("connection",async (socket)=>{
    console.log("cliente conectado");

    let databasePath = path.join(__dirname,"database","productos.json")

    //obtenemos los productos
    let data = await fs.readFile(databasePath,"utf-8");
    let products = JSON.parse(data);

    await productManagerUtils.sendProducts(products,socket)

    //eliminamos un producto
    socket.on("deleteProduct",async(id)=>{
        try{
            await productManagerUtils.deleteProduct(databasePath,id,socket)
        }
        catch(e){
            console.log(e)
            socket.emit("errorDelete",e.message);
        }

    })

    //update de un producto
    socket.on("updateProduct",async(data)=>{
        try{

            productManagerUtils.updateProduct(databasePath,data,socket)
        }
        catch(e){
            //en caso de que ocurra un error lo enviamos
            socket.emit("errorEdit",e.message)
        }
    })

    socket.on("createProduct",async data=>{
        try{
            productManagerUtils.createProduct(databasePath,data,socket)
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
app.use("/carts",carstRouter);
app.use("/products",productRouter)



