import { Schema,model } from "mongoose";

const messagesSchema = new Schema({
    user :{
        type : String
    },
    message : {
        type : String
    }
})

export const messageModel = model("messages",messagesSchema);