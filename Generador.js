let id = 1;
export function* GeneradorId(){
    while(true){
        yield id++;
    }
}