//importamos crypto el cual nos va ayudar para poder generar ids unicos
import crypto from "crypto";
import {promises as fs} from "fs"

const RUTA = "./database/productos.json";

//verificamos si existen todos los campos
function checkExistCamps(product){
    for(let i in product){
    //en caso de que el producto sea un string vacio o que sea null o undefined lanzamos un nuevo error
        if(product[i] == "" || !product[i] ){
            throw new Error(`Please enter a value for the property ${i}`)
        }
    }
};

async function checkExistArchivo(RUTA){
    try{
    //en caso de que no exista el archivo nos retornara una exeption
    await fs.stat(RUTA);
    }
    catch(e){
        console.log(e);
    }
}

checkExistArchivo(RUTA);

//creamos nuestro product manager
class ProductManager{
    constructor(path){
        this.products = [];
        this.path = path;
    }

    //obtnemos todos los productos
    async getProducts(limit,res){
        //obtenemos los productos
        let data = await fs.readFile(this.path,"utf-8");
        let response = JSON.parse(data);

        //retornamos los productos, en caso de que exista limite, retornamos los deseados
        if(limit && parseInt(limit) > 0){
            return res.send(response.slice(0,limit))

        }
        //si no existe limit retornamos todos los resultados
        else if(!limit){
            return res.send(response);
        }
        return res.status(404).send("Ingrese un limit correcto")
    }

    //añadimos un nuevo producto y si ya existe le sumamos el stock
    async addProduct(product){
        try{
            checkExistCamps(product);
            //obtnemos los productos
            let response = await fs.readFile(this.path,"utf-8");
            let products = JSON.parse(response);

            let indice = products.findIndex((item)=>item.code == product.code)

            //agregamos el producto a nuestro archivo json
            if(indice == -1){
                products.push(product);
                await fs.writeFile(this.path,JSON.stringify(products));
                return "Product add successfully"
            }
            //sumamos el stock del producto correspondiente
            products[indice].stock += product.stock;
            await fs.writeFile(this.path,JSON.stringify(products));
            return "Product add successfully";
        }
        catch(e){
            console.log(e);
        }
    }

    //obtenemos un producto segun su id
    async getProductById(id,res){
        try{
            const products = await fs.readFile(this.path,"utf-8");
            const response = JSON.parse(products);
        
            const product = response.find(item=>item.id == id);
            
            //si se encuentra el producto lo devolvemos, si no lanzamos una exepcion
            if(product){
                return res.send(product);
            }
            
            return res.send("No se ha encontrado el producto");

        }
        catch(e){
            console.log(e);
        }
    }
    
    //modificamos un producto segun su id y nuevos valores ingresados
    async updateProduct(id,newData){
        //obtenemos los productos
        let products = await this.getProducts();

        //si no se encuentra el producto por el id, lanzamos una exepcion
        let indice = products.findIndex(item=>item.id == id);

        if(indice == -1){
            throw new Error("Product not found")
        }

        //obtenemos el producto en concreto con los nuevos valores
        let newValues = changeValues(newData,products[indice]);

        //modificamos los valores y guardamos la informacion
        products[indice] = newValues;

        await fs.writeFile(this.path,JSON.stringify(products));

        return "Product updated!"
    }

    //eliminamos un producto segun el id
    async deleteProduct(id){
        try{
            //obtenemos todos los productos y verificamos que exista el producto ingresado
            const products = await this.getProducts();

            const indeceProduct = products.findIndex(item=>item.id == id);
    
            if(indeceProduct == -1){
                throw new Error("Product not found")
            }

            //eliminamos el producto
            products.splice(indeceProduct,1);

            await fs.writeFile(this.path,JSON.stringify(products));

            return "Product deleted :c"
        }
        catch(e){
            console.log(e);
        }
    }
}

//cambiamos los valores de un objeto segun otro dado
function changeValues(newData,product){
    //verificamos que sea un objeto el que se haya ingresado
    if(typeof newData != "object"){
        throw new Error("Please enter a object");
    }

    //obtenemos las propiedades del nuevo objeto
    let newDataProperties = Object.keys(newData);
    
    //no permitimos que el nuevo objeto tenga la propiedad id, ya que no lo queremos modificar
    if(newDataProperties.includes("id")){
        throw new Error("You cant enter a new id");
    }

    //obtenemos las propiedades del producto a modificar
    let properties = Object.keys(product);

    //modificamos los valores del producto viejo
    for(let i in newData){
        if(properties.includes(i)){
            product[i] = newData[i]
        }
    }

    return product;
}

//creamos nuestra clase product
class Product {
    constructor(id,title,desctiption,price,thumbnail,code,stock){
        this.id = id;
        this.title = title;
        this.desctiption = desctiption;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

//creamos nuestro product manager
export const procesadoresAmd = new ProductManager(RUTA);


//funcion para crear un nuevo producto con un id unico
function createProduct(title,desctiption,price,thumbnail,code,stock){
    let id = crypto.randomBytes(10).toString("hex");
    
    return new Product(id,title,desctiption,price,thumbnail,code,stock);   
}

//creamos dos productos
const product1 = createProduct("Procesador ryzen 3600","Procesador serie 3000",20,"../main",1,400);
const product12 =  createProduct("Procesador ryzen 3700x","Procesador serie 3000",20,"../main",2,800);


// añadimos un producto
// await procesadoresAmd.addProduct(product1);

//obtenemos todos los productos
// await procesadoresAmd.getProducts().then(info=>console.log(info));

//obtenemso un producto
// await procesadoresAmd.getProductById("ec559246af781a104d83").then(info=>console.log(info))

let newObject = {
    title : "AMD ryzen 3500",
    desctiption : "procesador serie 3000x"
}

//modificamos un producto
// await procesadoresAmd.updateProduct("dc1f22fec8f01bf02481",newObject).then(info=>console.log(info));

//eliminamos un producto
// await procesadoresAmd.deleteProduct("dc1f22fec8f01bf02481").then(info=>console.log(info));


