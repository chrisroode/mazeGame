
class Player {
    constructor(horiz,vert,mazeRef) {
        this.loc = {x:horiz,y:vert,xt:horiz,yt:vert};
        this.autoPlay = true; //Make a Bot object to handle this.
        this.moveSpeed = 0.125;
        this.greyscale = false;
        this.mazeRef = mazeRef;
        this.color = "#ff5522";
    } //constructor(horiz,vert)

    draw(context) {
        context.save();
        if (!this.greyscale) context.fillStyle = this.color;
        else context.fillStyle = "#cccccc";
        context.fillRect(this.loc.x*10+2.5,this.loc.y*10+2.5,5,5);
        context.restore();
    } //draw(context)

    // Make a bot object that handles auto moving, and remove this.
    update(gameRef) {
        if (this.autoPlay) {this.autoMove(gameRef.maze);}
    }
    move(d) { // d = direction (0,1,2,3)(up right down left)
        if (this.mazeRef.checkCollision(this.loc.xt,this.loc.yt,d)) {
            switch (d) {
                case 0: this.loc.yt--; break;
                case 1: this.loc.xt++; break;
                case 2: this.loc.yt++; break;
                case 3: this.loc.xt--; break;}
        } else {
            switch (d) {
                case 0: this.loc.y -= 0.3; break;
                case 1: this.loc.x += 0.3; break;
                case 2: this.loc.y += 0.3; break;
                case 3: this.loc.x -= 0.3; break;}
        }
    } //move(d)

    //TODO, Make this time based, rethink the formula.
    updatePosition(elapsedTime) {
        this.loc.x = (this.loc.x*3+this.loc.xt)/4;
        this.loc.y = (this.loc.y*3+this.loc.yt)/4;
    } //updatePosition()

    //TODO, this should refer to the maze ref, not what is passed to it.
    autoMove(maze) {this.move(maze.pathToGold(this.loc.xt,this.loc.yt));}
    getGold() {return this.mazeRef.collectGold(this.loc.xt,this.loc.yt);}
} // class Player

class Bot extends Player {
    update() {
        this.super.update();
        this.autoMove();
        this.getGold();
    }
    autoMove() {
        if (this.mazeRef)
            this.move(this.mazeRef.pathToGold(this.loc.xt,this.loc.yt));
    }
}
