let contador = 0;
import { GeneradorId } from "./Generador.js";

export class Tarea {
    static ESTADO_PENDIENTE = "Pendiente";
    static ESTADO_PROCESO = "En proceso";
    static ESTADO_HECHO = "Hecho";
    constructor(titulo, descripcion, responsable, fechaEntrega, estado = "pendiente"){
        this.id = GeneradorId().next().value;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.responsable = responsable;
        this.fechaEntrega = fechaEntrega;
        this.estado = estado.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }

    
    
    
}

