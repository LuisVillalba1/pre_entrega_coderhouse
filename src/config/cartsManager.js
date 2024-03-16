import {promises as fs} from "fs"
import { cartsModel } from "../models/cartsModel.js";
import { productModel } from "../models/productsModel.js";

//verificamos que solo se ingresen las propiedades de product id y quantity
function verifyCorrectKeys(object){
    let keys = Object.keys(object)

    for(let i of keys){
        if(i != "productID" && i !="quantity"){
            throw new Error("Por favor solo ingrese las propiedades productID y quantity")
        }
    }
}

function verifyContentProduct(data){
    for(let i in data){
        //verificamos que se ingresen las propiedades correctas
        verifyCorrectKeys(data[i]);
        //verificamos que se ingrese la informacion de manera correcta y que tengan los valores correctos
        if(typeof data[i] != "object"){
            throw new Error("El producto ingresado debe de ser un objeto")
        }
        if(!data[i].productID || !data[i].quantity){
            throw new Error("Por favor ingrese un productID y un quantity")
        }
        if(isNaN(parseInt(data[i].quantity)) || parseInt(data[i].quantity) <= 0){
            throw new Error("quantity debe de ser un numero mayor a 0")
        }
    }
}

async function verifyExistProducts(data){
    for(let i in data){
        let cart = new carManager();
        await cart.getProduct(data[i].productID);
    }
}

export class carManager{
    constructor(){
        
    }

    async createCar(id,res) {
        try{
            //leemos el archivo de los carritos
            const response = await fs.readFile(this.path,"utf-8");
            const cars = JSON.parse(response)

            //creamos un nuevo corrito con un id unico
            cars.push({id:id,products:[]});
            await fs.writeFile(this.path,JSON.stringify(cars));

            return res.send(`Carrito creado con exito con el id ${id}`);
        }
        catch(e){
            return res.status(500).send(e.message)
        }
    }

    //obtenemos los productos de cierto carrito
    async getProductsCart(id,res){
        const cart = await cartsModel.findById(id).populate('products.productID').lean();

        if(!cart){
            throw new Error("No se ha encontrado el carrito");
        }
        //retornamos en caso de que se encuentre el carrito los productos que este posee
        return cart.products;
    }

    //verificamos que exista el producto
    async getProduct(id){
        let product = await productModel.findById(id)
        if(!product){
            throw new Error("No se ha encontrado el producto que desea agregar al carrito")
        }

    }

    //obtenemos el carrito del usuario
    async getCart(id){

        const cart = await cartsModel.findById(id);

        if(!cart){
            throw new Error("No se ha encontrado el carrito solicitado");
        }

        return cart;
    }

    async addProduct(id,productID,quantity,res){
        try{
            //obtenemos el carrito del usuario
            const cart = await this.getCart(id);
            //verificamos que el producto que quiera añadir exista
            await this.getProduct(productID);

            //buscamos el producto en el array de productos
            const indice = cart.products.findIndex(item=>item.productID == productID);
            
            //si no se encuentra añadimos el producto con su cantidad
            if(indice <= -1){
                cart.products.push({productID:productID,quantity:quantity});
            }
            //en caso de que si se encuentre sumamos la cantidad del producto
            else{
                cart.products[indice].quantity = quantity
            }
            //modificamos el carrito
            await cartsModel.findByIdAndUpdate(cart._id,cart);

            return res.send("Se ha añadido el producto correctamente");

        }
        catch(e){
            if(e instanceof Error){
                return res.status(404).send(e.message)
            }
            return res.status(500).send("Ha ocurrido un error")
        }

    }

    //eliminamos un producto del carrito
    async deleteProduct(cid,pid){
        //obtenemos el carrito del usuario
        const cart = await this.getCart(cid);
        //verificamos que el producto que quiera añadir exista
        await this.getProduct(pid);

        //buscamos el producto en el array de productos
        const indice = cart.products.findIndex(item=>item.productID == pid);   
            

        if(indice <= -1){
            throw new Error("No se ha encontrado el producto solicitado")
        }
         
        //modificamos el objeto y lo guardamos
        cart.products.splice(indice,1)


        await cartsModel.findByIdAndUpdate(cart._id,cart);

    }

    async deleteAllProducts(cid){
        //obtenemos el carrito del usuario
        const cart = await this.getCart(cid);

        //restablecemos a un array vacio
        cart.products = [];

        await cartsModel.findByIdAndUpdate(cart._id,cart);
    }

    //modificamos todos los productos de un carrito por uno nuevo dado
    async updateAllCart(cid,content){
        //obtenemos el carrito del usuario
        const cart = await this.getCart(cid);

        if(!content.products || !Array.isArray(content.products)){
            throw new Error("products es necesario y debe de ser un array de productos");
        }
        //verificamos que se ingrese solamente un id de un producto y una quantity
        verifyContentProduct(content.products)

        await verifyExistProducts(content.products)

        return await cartsModel.findByIdAndUpdate(cart._id,content,{new : true});
    }

    //actualizamos la cantidad de un producto añadido al carrito
    async updateProductQuantity(cid,content,pid){
        //verificamos que la cantidad sea valida y que se haya ingresado
        if(!content.quantity || isNaN(parseInt(content.quantity)) ||  parseInt(content.quantity) <= 0){
            throw new Error("quantity es necesario y tiene que ser un numero mayor a 0")
        }

        //obtenemos el carrito del usuario
        const cart = await this.getCart(cid);

        //buscamos el producto en el array de productos
        const indice = cart.products.findIndex(item=>item.productID == pid);
        
        if(indice <= -1){
            throw new Error("No se ha encontrado el producto solicitado")
        }

        //actualizamos la cantidad
        cart.products[indice].quantity = content.quantity;

        return await cartsModel.findByIdAndUpdate(cart._id,cart,{new : true});
    }
}