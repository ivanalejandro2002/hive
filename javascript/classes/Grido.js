import {Cell} from './Cell.js';
export class Grido{
    constructor(size){

        let tablero = [[]];

        for(let i =0;i<size;++i){
            for(let j = 0; j<size; ++j){
                tablero[i].push(new Cell(false,0,0,"Z"));
            }
            tablero.push([]);
        }

        this.grid = tablero;
    }
    assign(celula,y,x){
        this.grid[y][x] = celula;
    }

    erase(y,x){
        this.grid[y][x].exists = 0;
    }
}