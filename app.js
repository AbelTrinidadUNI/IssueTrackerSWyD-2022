import { Tarea } from "./Tarea.js";


let tareas = [];
function init() {
    recuperarDatos();
    actualizarVista();

}

function actualizarVista() {
    document.getElementById("columna-pendiente").innerHTML = "";
    document.getElementById("columna-enProceso").innerHTML = "";
    document.getElementById("columna-hecho").innerHTML = "";
    tareas.forEach((tarea) => {
        if (tarea.estado === Tarea.ESTADO_PENDIENTE) {
            document.getElementById("columna-pendiente").innerHTML += toStringTarea(tarea);
        } else if (tarea.estado === Tarea.ESTADO_PROCESO) {
            document.getElementById("columna-enProceso").innerHTML += toStringTarea(tarea);
        } else if (tarea.estado === Tarea.ESTADO_HECHO) {
            document.getElementById("columna-hecho").innerHTML += toStringTarea(tarea);
        }
    });

}

function recuperarDatos() {
    const tareasObj = JSON.parse(localStorage.getItem("tareas") ?? "[]");
    tareas = tareasObj.map(i => new Tarea(i.titulo, i.descripcion, i.responsable, i.fechaEntrega, i.estado));
}

function actualizarStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    //recuperarDatos();
    actualizarVista();

}

function buscarTarea(idTarea) {
    for (let index = 0; index < tareas.length; index++) {
        if (idTarea === tareas[index].id) {
            return index;
        }
    }
    return -1;
}


function modalHide() {
    document.getElementById("modal-backdrop").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflowY = "visible";
}

function modalShow() {
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    document.getElementById("modal-backdrop").style.display = "block";

}

function transferirCard(e, idColDestino) {
    const id = e.dataTransfer.getData("id"); //id de la card
    document.getElementById(idColDestino.replace("contenedor", "columna")).appendChild(document.getElementById(id));

    const pos = buscarTarea(parseInt(id));
    if (pos >= 0) {
        if (idColDestino === "contenedor-pendiente") {
            tareas[pos].estado = Tarea.ESTADO_PENDIENTE;
        } else if (idColDestino === "contenedor-enProceso") {
            tareas[pos].estado = Tarea.ESTADO_PROCESO;
        } else if (idColDestino === "contenedor-hecho") {
            tareas[pos].estado = Tarea.ESTADO_HECHO;
        }
        document.getElementById(`estado${tareas[pos].id}`).value = tareas[pos].estado;
        actualizarStorage();
    }

    return true;
}

function bloquear(e) {
    e.preventDefault();
}

function startDrag(e) {
    e.dataTransfer.setData("id", e.target.id);
}

function drop(e) {
    e.path.forEach(i => i.id && i.id.includes("contenedor-") && transferirCard(e, i.id));
}







document.addEventListener("dragover", (e) => {
    bloquear(e);
});

document.addEventListener("drop", (e) => {
    drop(e);
});

document.addEventListener("dragstart", (e) => {
    startDrag(e);
});

window.onload = (e) => {
    init();

    eliminador();

};

function eliminador(){
    //se eliminara la tarea seleccionada
    const botones = new Array(...(document.getElementsByClassName("delete-btn")));
    botones.forEach(i => {
        i.addEventListener("click", (e) => {
            const idTarea = parseInt(e.target.id.replace("delete", ""));
            const pos = buscarTarea(idTarea);
            tareas.splice(pos, 1);
            actualizarStorage();
            console.log(tareas)
            eliminador();
        })
    })
}

document.getElementById("btn-guardar").addEventListener("click", () => {
    const titulo = document.getElementById("inputTitulo").value;
    const descripcion = document.getElementById("inputDescripcion").value;
    const responsable = document.getElementById("inputResponsable").value;
    const entrega = new Date(document.getElementById("inputEntrega").value);

    if (titulo.length > 0 && descripcion.length > 0 && responsable.length > 0 && entrega != "Invalid Date") {
        tareas.push(new Tarea(titulo, descripcion, responsable, entrega.toDateString()));
        actualizarStorage();
        modalHide();
    } else {
        alert("Complete todos los campos antes de guardar la tarea");
    }

});

export function saludar(id) {
    alert("hola : ", id);
}



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



document.getElementById("modal-show").addEventListener("click", (e) => {
    modalShow();
});

document.getElementById("modal-hide").addEventListener("click", (e) => {
    modalHide();
});
