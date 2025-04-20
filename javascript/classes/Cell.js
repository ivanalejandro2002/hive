export class Cell{
    //Exists "0,1"
    //color "0,1"
    //Type "Q,M,P,S,B,L,G,A"
    //Number "1,2,3"
    constructor(exists,color, number, type){
        this.exists = exists;
        if(exists==true){
            this.exists = true;
            this.color = color;
            this.number = number;
            this.type = type;
        }
    }
}