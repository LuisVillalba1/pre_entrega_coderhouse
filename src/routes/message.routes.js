import { Router } from "express";
import { messageModel } from "../models/messagesModel.js";

const messageRoute = Router();

//obtenemos todos los mensajes
messageRoute.get("/",async(req,res)=>{
    res.send(await messageModel.find());
})

export default messageRoute;