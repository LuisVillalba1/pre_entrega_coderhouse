import {promises as fs} from "fs"
export class carManager{
    constructor(path){
        this.path = path
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
        try{
            //obtenemos todos los carritos
            const response = await fs.readFile(this.path,"utf-8");

            const cars = JSON.parse(response);
            
            //buscamos un carrito
            const indice = cars.findIndex(item=>item.id == id);
    
            if(indice <= -1){
                throw new Error("No se ha encontrado el carrito");
            }
            //retornamos en caso de que se encuentre el carrito los productos que este posee
            return res.send(cars[indice].products);
        }
        catch(e){
            if(e instanceof Error){
                return res.status(404).send(e.message)
            }
            return res.status(500).send("Ha ocurrido un error")
        }
    }

    //verificamos que exista el producto
    async getProduct(id){
        
        const productRoute = "./database/productos.json";

        const responseProducts = await fs.readFile(productRoute,"utf-8");

        const products = JSON.parse(responseProducts);

        const indice = products.findIndex(item=>item.id == id);

        if(indice <= -1){
            throw new Error("No se ha encontrado el producto que desea agregar al carrito")
        }

    }

    //obtenemos el carrito del usuario
    async getCart(carts,id){

        const indice = carts.findIndex(item=> item.id == id);

        if(indice <= -1){
            throw new Error("No se ha encontrado el carrito solicitado");
        }

        return carts[indice];
    }

    async addProduct(id,productID,quantity,res){
        try{
            //obtenemos todos los carritos
            const response = await fs.readFile(this.path,"utf-8");

            const carts = JSON.parse(response);

            //obtenemos el carrito del usuario
            const cart = await this.getCart(carts,id);
            
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
                cart.products[indice].quantity += quantity
            }

            await fs.writeFile(this.path,JSON.stringify(carts));

            return res.send("Se ha añadido el producto correctamente");

        }
        catch(e){
            if(e instanceof Error){
                return res.status(404).send(e.message)
            }
            return res.status(500).send("Ha ocurrido un error")
        }

    }
}