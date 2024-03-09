const socket = io();

const productsContainer = $(".products_container");

//mostramos los productos
socket.on("products",(info)=>{
    showProducts(info)
})

//mostramos el nuevo producto creado
socket.on("newProduct",(info)=>{
    $(productsContainer).append(createProduct(info));
})

//eliminamos un producto
socket.on("deletedProduct",(info)=>{
    deleteProduct(info);
})

//modificamos los valores de cierto producto
socket.on("newProductData",(info)=>{
    updateProduct(info._id,info)
})

function deleteProduct(id){
    $(`#${id}`).remove();
}

function showProducts(info){
    for(let i of info){
        console.log(i)
        //añadimos los productos al dom
        //cada ves que haya uno nuevo lo mostramos
        if(chekExisteProduct(i._id)){
            $(productsContainer).append(createProduct(i));

        }
    }
    //permitimos a cada producto poder editarlo
    $(".edit_container").on("click", function (e) {
        //obtenemos el nombre del producto
        let padre = $(e.target).closest(".product_container");
        let nombre = padre.children(".title_product_container").children()[1].textContent;

        //mostramos que producto se va a editar
        $(".edit_product_title").text("Editar " + nombre);
        //obtenemos el id del producto
        getValueEdit($(padre).attr("id"))
        //permitimos editar el producto
        $("#form_container_edit").css("display","flex");
        //ocultamos el contenedor de crear productos
        checkAndOcultForm("form_create_product");
        $("#close_form_edit").on("click",function(e){
            //ocultamos el contenedor de crear producto en caso de que este abierto
            $("#form_container_edit").css("display", "none");
        })

    });
    //permitimos a cada producto poder eliminarlo
    $(".delete_container").on("click",function(e){
        deleteExistProduct(e.target)
    })
}

//ocultamos un contenedor
function checkAndOcultForm(id){
    $(`#${id}`).css("display","none")
}

function deleteExistProduct(target){
    let padre = $(target).closest(".product_container");
    let id = $(padre).attr("id");
    socket.emit("deleteProduct",id);
}

//verificamos si ya se ha agregado el producto
function chekExisteProduct(code){
    if($(`#${code}`).length > 0){
        return false
    }
    return true
}

//modificamos los valores del producto
function updateProduct(id,newDatas){

    $(`#${id}_img`).attr("src", newDatas.thumbnails[0]);
    $(`#${id}_img`).attr("alt", newDatas.title);

    $(`#${id}_price`).text(newDatas.price);
    $(`#${id}_title`).text(newDatas.title);
    $(`#${id}_description`).text(newDatas.description);

    $(`#${id}_category`).text(newDatas.category);
    $(`#${id}_code`).text(newDatas.code);
    $(`#${id}_stock`).text(newDatas.stock)
    
}

function createProduct(product){
    //creamos un contenedor que contendra cada producto
    let productContainer = $("<div></div>")
    $(productContainer).addClass("product_container");
    $(productContainer).attr("id", product._id);

    //el contenedor de la imagen junto a la imagen en cuestion
    let imgContainer = $("<div></div>");
    $(imgContainer).addClass("product_img_container");
    let img = $("<img></img<");
    $(img).attr("alt", product.title);
    $(img).attr("id", product.id + "_img");
    $(img).attr("src",product.thumbnails[0]);

    $(productContainer).append(showData(product._id,product.category,"Categoria","category_container","_category"));

    $(imgContainer).append(img);
    $(productContainer).append(imgContainer);

    //nombre del producto
    productContainer.append(showData(product._id,product.title,"Titulo","title_product_container","_title"))

    //descripcion del producto
    productContainer.append(showData(product._id,product.description,"Descripcion","description_container","_description"))
    //precio del producto
    productContainer.append(showData(product._id,product.price,"Precio","price_container","_price"))

    //mostramos el codigo
    productContainer.append(showData(product._id,product.code,"Code","code_container","_code"))

    //permitimos editar y eliminar el producto
    let removeAndEdit = $("<div></div>");
    $(removeAndEdit).addClass("remove_and_edit_container");

    removeAndEdit.append(addEditProduct(product._id))
    removeAndEdit.append(addDeleteProcut(product._id))

    $(productContainer).append(showData(product._id,product.stock,"Stock","stock_container","_stock"));
    $(productContainer).append(removeAndEdit);

    return productContainer;
}

//añadimos el contenedor para editar un producto
function addEditProduct(id){
    let editContainer = $("<div></div>");
    $(editContainer).attr("id",id+"_edit_container");
    $(editContainer).addClass("edit_container");
    let targetForm = $("<a></a>");
    $(targetForm).attr("href", "#form_container");
    let iconEdit = $("<i></i>");
    $(iconEdit).addClass("fa-solid fa-pen-to-square");

    $(targetForm).append(iconEdit);
    $(editContainer).append(targetForm);

    return editContainer;
}

//añadimos el contenedor para poder eliminar un producto
function addDeleteProcut(id){
    let deleteContainer = $("<div></div>");
    $(deleteContainer).attr("id",id+"_delete_container");
    $(deleteContainer).addClass("delete_container");
    let iconDelete = $("<i></i>");
    $(iconDelete).addClass("fa-solid fa-trash");

    $(deleteContainer).append(iconDelete);

    return deleteContainer;
}

//mostramos el contenido de cada producto
function showData(id,valueProperty,titleValue,containerNick,idName){
    let container = $("<div></div>");
    $(container).addClass(containerNick);
    let title = $("<h5></h5>");
    $(title).text(titleValue);
    let p = $("<div></div>");
    $(p).text(valueProperty);
    $(p).attr("id",id + idName);

    $(container).append(title);
    $(container).append(p);

    return container;
}

//enviamos los nuevos valores del producto
function getValueEdit(id){
    $(".send_edit_form").on("click", function (e) {
        let editValues = {
            id : id,
            category : $("#Category_edit").val(),
            title : $("#Titulo_edit").val(),
            description : $("#Description_edit").val(),
            price : parseInt($("#Precio_edit").val()),
            code : $("#Code_edit").val(),
            stock : parseInt($("#Stock_edit").val()),
        }
        console.log(editValues);
        socket.emit("updateProduct",editValues);
    });
}

//mostramos el formulario para crear un nuevo producto
$(".create_product_buttom").on("click", function () {
    checkAndOcultForm("form_container_edit")
    $("#form_create_product").css("display", "block");

    sendCreateProductValues()
});

//cuando se aprete en el boton de enviar obtenemos los valores
function sendCreateProductValues(){
    $(".send_create_form").on("click", function (e) {
        let createValues = {
            category : $("#Category_create").val(),
            title : $("#Titulo_create").val(),
            description : $("#Description_create").val(),
            price : parseInt($("#Precio_create").val()),
            code : $("#Code_create").val(),
            stock : parseInt($("#Stock_create").val()),
            status : true
        }
        socket.emit("createProduct",createValues);
    });
}

//mostramos el error al editar un producto
socket.on("errorEdit",error=>{
    $(".error_edit").text(error);
})

//mostramos el error al crear un producto
socket.on("errorCreate",error=>{
    $(".error_create").text(error);
})


$("#delete_form_create").on("click", function () {
    console.log(true)
    $("#form_create_product").css("display", "none");
});

