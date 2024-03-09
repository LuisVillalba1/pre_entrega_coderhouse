import { Schema,model } from "mongoose";

const cartSchema = new Schema({
    products : {
        type : [{
            productID : {
                type : Schema.Types.ObjectId,
                ref : "products"
            },
            quantity : {
                type : Number
            }
        }
        ],
        default : [],
    }
})

export const cartsModel = model("carts",cartSchema);