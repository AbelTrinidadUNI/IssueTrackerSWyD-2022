import { Tarea } from "./Tarea.js";


let tareas = []; //lista que contendra todas las tareas

//contiene las acciones que se ejecutaran inicialmente
function init() {
    recuperarDatos();
    actualizarVista();
}

//actualiza las tareas en las columnas
function actualizarVista() {
    //vacia las columnas
    document.getElementById("columna-pendiente").innerHTML = "";
    document.getElementById("columna-enProceso").innerHTML = "";
    document.getElementById("columna-hecho").innerHTML = "";
    
    //agrega cada tarea en su correspondiente columna
    tareas.forEach((tarea) => {
        if (tarea.estado === Tarea.ESTADO_PENDIENTE) {
            document.getElementById("columna-pendiente").innerHTML += toStringTarea(tarea);
        } else if (tarea.estado === Tarea.ESTADO_PROCESO) {
            document.getElementById("columna-enProceso").innerHTML += toStringTarea(tarea);
        } else if (tarea.estado === Tarea.ESTADO_HECHO) {
            document.getElementById("columna-hecho").innerHTML += toStringTarea(tarea);
        }
    });
    //agrega el evento de eliminacion en cada boton de las tarjetas 
    asignaraAtionEliminacion();

}

//recupera datos del local storage y los mapea a la lista de tareasa
function recuperarDatos() {
    const tareasObj = JSON.parse(localStorage.getItem("tareas") ?? "[]");
    tareas = tareasObj.map(i => new Tarea(i.titulo, i.descripcion, i.responsable, i.fechaEntrega, i.estado));
}

//actualiza las tareas en el local storage y luego actualiza la vista
function actualizarStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    actualizarVista();
    //asignaraAtionEliminacion();
}

//obtiene todos los botones que son para eliminar las tareas y les asigna un evento con el cual se eliminara la tarea de la lista
function asignaraAtionEliminacion(){
    document.querySelectorAll(".btn-close").forEach(i => {
        i.addEventListener("click", (e) => {
            const pos = buscarTarea(parseInt(i.id));
            tareas.splice(pos, 1);
            actualizarStorage();
            
        });
    });
}

//busca una tarea en la lista basado en el id y si la encuentra retorna su posicion de lo contrario -1
function buscarTarea(idTarea) {
    for (let index = 0; index < tareas.length; index++) {
        if (idTarea === tareas[index].id) {
            return index;
        }
    }
    return -1;
}

//oculta el modal 
function modalHide() {
    document.getElementById("modal-backdrop").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflowY = "visible";
}

//muestra el modal
function modalShow() {
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    document.getElementById("modal-backdrop").style.display = "block";
}

/*
    Permite transferir una tarea desde una columna a otra columna
    Recibe el id de la card (tarjeta) y el id de la columna de destino 
*/
function transferirCard(idCard, idColDestino) {
    const id = idCard; //id de la card
    /*
        Se mueve la card a la columna de destino.
        Se reemplaza la palabra "contenedor" por "columna" porque la columna esta envuelta en un contenedor 
        el cual contiene el titulo de la columna y la lista de cards de la columna.
    */
    //document.getElementById(idColDestino.replace("contenedor", "columna")).appendChild(document.getElementById(id));

    //se obtiene la posicion de la tarea
    const pos = buscarTarea(parseInt(id));
    if (pos >= 0) {
        //se verifica en que contenedo se va a colocar y de acuerdo a eso de actualiza su estado
        if (idColDestino === "contenedor-pendiente") {
            tareas[pos].estado = Tarea.ESTADO_PENDIENTE;
        } else if (idColDestino === "contenedor-enProceso") {
            tareas[pos].estado = Tarea.ESTADO_PROCESO;
        } else if (idColDestino === "contenedor-hecho") {
            tareas[pos].estado = Tarea.ESTADO_HECHO;
        }

        //se actualiza el local storage
        actualizarStorage();
    }

    return true;
}

//Bloquea las acciones predeterminados de un evento recibido
function bloquear(e) {
    e.preventDefault();
}

//Se gruarda el id del elemento el cual se quiere mover con drag
function startDrag(e) {
    e.dataTransfer.setData("id", e.target.id);
}

/*
    Se itera la ruta del elemento recibido y se verifica si tiene un id si los tiene se verifica que su id este compuesto por la 
    palabra "contenedor-" y si es asi se procede a transferir la tarea a la nueva columna
*/
function drop(e) {
    //a la funcion trasferirCar se le pas el id de la card y el id del contendor de destino
    e.path.forEach(i => i.id && i.id.includes("contenedor-") && transferirCard(e.dataTransfer.getData("id"), i.id));
}


//Mapea la tarea a una card de la vista
function toStringTarea(tarea) {
    return `<div class="tarea" id="${tarea.id}" draggable="true">
                <div class="contenedor">
                    <div class="card-header">
                        <h5 class="titulo-tarea">Titulo: ${tarea.titulo}</h5>
                        <button class="btn btn-danger btn-sm delete-btn btn-close" id="delete${tarea.id}"></button>
                    </div>

                    <div class="card-body">
                        <div class="descripcion-tarea">
                            Descripcion: ${tarea.descripcion}
                        </div>
                        <div class="responsable-tarea">
                            Asignado a: <span class="responsable-nombre">${tarea.responsable}</span>
                        </div>
                        <div class="fecha-entrega">
                            Entrega: ${new Date(tarea.fechaEntrega).toDateString()}
                        </div>
                        <div class="estado-tarea" id='estado${tarea.id}'>
                            Estado: ${tarea.estado}
                        </div>
                    </div>
                </div>
            </div>`
}

//Cuando se de click sobre el boton de guardar del modal
document.getElementById("btn-guardar").addEventListener("click", () => {
    //se obtienen los valores de los inputs
    const titulo = document.getElementById("inputTitulo").value;
    const descripcion = document.getElementById("inputDescripcion").value;
    const responsable = document.getElementById("inputResponsable").value;
    const entrega = new Date(document.getElementById("inputEntrega").value);
    entrega.setDate(entrega.getDate() + 1);//se suma un dia mas a la fecha para que aparezca bien en la vista

    //se verifica si los valores del input sean correctos
    if (titulo.length > 0 && descripcion.length > 0 && responsable.length > 0 && entrega != "Invalid Date") {
        //se agrega la nueva tarea a la lista
        tareas.push(new Tarea(titulo, descripcion, responsable, entrega.toDateString()));
        actualizarStorage(); //se actualiza el local storage
        modalHide();//se oculta el modal
    } else {
        alert("Complete todos los campos antes de guardar la tarea");
    }

});

//accion al momento de hacer click sobre el boton de agregar
document.getElementById("modal-show").addEventListener("click", (e) => {
    modalShow();
        //se limpian los inputs
        document.getElementById("inputTitulo").value = "";
        document.getElementById("inputDescripcion").value = "";
        document.getElementById("inputResponsable").value = "";
        document.getElementById("inputEntrega").value = "";
});

//accion al hacer click sobre el boton de canclar del modal
document.getElementById("modal-hide").addEventListener("click", (e) => {
    modalHide();
});


//Las acciones que suceden durante el movimiento del contenedor seran bloqueados
document.addEventListener("dragover", (e) => {
    bloquear(e);
});
//accion que se realizara cuando se suelte el contenedor
document.addEventListener("drop", (e) => {
    drop(e);
});
//accion que se realizara al momento de iniciar el arrastre
document.addEventListener("dragstart", (e) => {
    startDrag(e);
});

//accion a realizarse cuando se termine de cargar la pagina
window.onload = (e) => {
    init();
};