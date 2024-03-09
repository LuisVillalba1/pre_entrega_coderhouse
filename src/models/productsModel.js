import {Schema,model } from "mongoose";

const productSchema = new Schema({
    category : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        unique : true
    },
    code : {
        type : String,
        required : true
    },
    stock : {
        type : Number,
        required : true
    },
    Status : Boolean,
    thumbnails : {
        type : [String],
        default : []
    }
})

export const productModel = model("products",productSchema)