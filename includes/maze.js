
class Maze {
    constructor(width,height) {
        if (verboseG) console.log("new Maze from maze.js");
        this.width = width;         this.height = height;
        this.cells = new Array();   this.redraw = {maze: true, gold: true};
        this.mazeImg, this.goldImg;
        this.color = {r:32,g:0,b:255,greyscale:false};
        this.loops = {percent:false, value:15};
        for (let i=0; i<width*height; i++) {
            let newCell = {walls:[1,1,1,1],
                           visited:0,
                           highlight:false,
                           distance:0,
                           exits:0};
            if (i<width)               newCell.walls[0] = -1;
            if (i%width==width-1)      newCell.walls[1] = -1;
            if (i+width>=width*height) newCell.walls[2] = -1;
            if (i%width==0)            newCell.walls[3] = -1;
            this.cells.push(newCell);
        }
        this.carveMaze();
    } //constructor(widthm,height)

    buildWall(i,d) { //i= index, d = direction (0,1,2,3)(up right down left)
        let _ret = false;
        if (this.cells[i].walls[d] == 0) {
            _ret = true;
            this.cells[i].walls[d] = 1;
            this.cells[this.neighbor(i,d)].walls[(d+2)%4]=1;
        }
        return _ret;
    } //buildWall(i,d)

    carveMaze() {//Method to make the maze.
        // Make Maze
        let mazeCoord = Math.trunc(Math.random()*this.width*this.height);
        let stack = new Array(); //counts our path.
        stack.push(mazeCoord);
        do {// Find the possible directions
            let cell = stack[stack.length-1];
            let dirs = new Array();
            for (var i=0; i<4; i++) {
                if (this.cells[cell].walls[i] == 1) {
                    let v = 1;
                    switch (i) {
                        case 0: v = this.cells[cell-this.width].visited; break;
                        case 1: v = this.cells[cell+1].visited; break;
                        case 2: v = this.cells[cell+this.width].visited; break;
                        case 3: v = this.cells[cell-1].visited; break;}
                    if (v==0) dirs.push(i);
                }
            }
            if (dirs.length>0) {
                let dir = dirs[Math.trunc(Math.random()*12)%dirs.length];
                this.removeWall(cell,dir);
                switch (dir) {
                    case 0: stack.push(cell-this.width); break;
                    case 1: stack.push(cell+1); break;
                    case 2: stack.push(cell+this.width); break;
                    case 3: stack.push(cell-1); break;
                }
            } else { stack.pop();}
            this.cells[cell].visited = 1;
        } while (stack.length > 0 && stack.length < this.cells.length);

        for (let i=0; i<this.width*3; i++) {
          if (this.removeWall(Math.trunc(Math.random()*this.cells.length),
                              Math.trunc(Math.random()*4))) i--;}



        this.cells.forEach((cell) => {
            cell.walls.forEach((e) => {
                if (e==0) cell.exits++;
            });
        });

        this.cells.forEach((c,i) => {
            if (c.exits==1) {
                c.distance=-1;
                let pCells = [i];
                let ind = i;
                let dir = 0;
                c.walls.forEach((e,direction) => {
                    if (e==0) dir = direction;
                });
                let safety=-2;
                do {
                    safety++;
                    ind = this.neighbor(ind,dir);
                    pCells.push(ind);
                    let newDir = dir;
                    for (let bob=0;bob<3;bob++) {
                        newDir = (newDir+1)%4;
                        if (this.cells[ind].walls[newDir] == 0) dir = newDir;
                    }
                } while (Math.max(this.numberOfExits(ind),safety)<3);
                pCells.forEach((e) => {
                    this.cells[e].distance=-1;
                });
            }
        });
        this.redraw.maze = true;

    } //carveMaze()
    
    cellIndex(x,y) {return this.width*y+x;}
    cellCoord(index) {return {x:index%this.width,
                              y:Math.trunc(index/this.width)};}

    checkCollision(x,y,d) { //d = direction (0,1,2,3)(up right down left)
        var _ret = false; var i = y*this.width + x;
        if (this.cells[i].walls[d]==0) _ret = true;
        return _ret;
    } //checkCollision(x,y,d);

    collectGold(x,y) {
        if (this.cells[this.cellIndex(x,y)].visited==1) {
            this.cells[this.cellIndex(x,y)].visited=0;
            this.cells[this.cellIndex(x,y)].distance+=30;
            this.redraw.gold = true;
            return true;
        } else {
            this.cells[this.cellIndex(x,y)].distance+=30;
            return false;
        }

    }
    draw(context) {
        context.save();
        let _w = this.width;
        let _h = this.height;
        if (this.redraw.maze) { //this.redraw.maze


            context.beginPath();            context.moveTo(0,_h*10);
            context.lineTo(0,0);            context.lineTo(_w*10,0);
            context.lineTo(_w*10,_h*10);    context.lineTo(0,_h*10);
            for (let i=0; i<_w; i++) {
                for (let j=0; j<_h; j++) {
                    if (this.cells[j*_w+i].walls[2]==1) {
                        context.moveTo(i*10,(j+1)*10);
                        context.lineTo((i+1)*10,(j+1)*10);}
                    if (this.cells[j*_w+i].walls[1]==1) {
                        context.moveTo((i+1)*10,j*10);
                        context.lineTo((i+1)*10,(j+1)*10);}
                }
            }


            context.lineCap = "square";
            if (!this.color.greyscale) { context.strokeStyle =
                'rgb('+this.color.r*0.75+','+this.color.g*0.75+','+this.color.b*0.75+')';}
            else {context.strokeStyle = "#777777";}
            context.lineWidth = 2 ;
            context.stroke();
            if (!this.color.greyscale) { context.strokeStyle =
                'rgb('+this.color.r+','+this.color.g+','+this.color.b+')';}
            else {context.strokeStyle = "#999999";}
            context.lineWidth = 0.85 ;
            context.stroke();

            context.resetTransform();
            this.mazeImg = new Image(canvas.width,canvas.height);
            this.mazeImg.src = canvas.toDataURL('image/jpeg');
            this.redraw.maze=false;
        } else {
            context.resetTransform();
            context.drawImage(this.mazeImg,0,0);
        }
        context.restore();
        context.save();

        if (this.redraw.gold) { //this.redraw.gold
            for (let i=0; i<_w; i++) {
                for (let j=0; j<_h; j++) {

                    /*if (this.numberOfExits(j*_w+i)==1) {
                        context.fillStyle = "#ff000088";
                        context.fillRect((i+0.2)*10,(j+0.2)*10,6,6);
                    }
                    if (this.numberOfExits(j*_w+i)>2) {
                        context.fillStyle = "#0000ff88";
                        context.fillRect((i+0.2)*10,(j+0.2)*10,6,6);
                    }
                    if (this.cells[j*_w+i].distance==-1) {
                        context.fillStyle = "#ffffff44";
                        context.fillRect((i+0.3)*10,(j+0.3)*10,4,4);
                    }*/
                    if (this.cells[j*_w+i].visited==1) {
                        if (!this.color.greyscale) {
                            let b = Math.trunc(Math.random()*32);
                            context.fillStyle = 'rgb('+(b+32)*4+','+(b+32)*4+','+b+')';
                        }
                        else context.fillStyle = "#dddddd";
                        context.fillRect((i+0.4)*10,(j+0.4)*10,2,2);
                    } else {
                        let z = Math.max(96 - this.cells[j*_w+i].distance*8,0);
                        context.fillStyle = 'rgb('+z+','+z+','+z+')';
                        context.fillRect((i+0.4)*10,(j+0.4)*10,2,2);
                    }

                }
            }
            this.goldImg = new Image(canvas.width,canvas.height);
            this.goldImg.src = canvas.toDataURL('image/jpeg');
            this.redraw.gold=false;
            context.resetTransform();
        } else {
            context.resetTransform();
            context.drawImage(this.goldImg,0,0);
        }
        context.restore();
    } // draw(context)

    getGoldCount() {
        let _ret = 0;
        this.cells.forEach((e) => {
            _ret += e.visited;
        });
        return _ret;
    }

    neighbor(index,direction) { //no range check!
        let nIndex = null;
        switch (direction) {
            case 0: nIndex = index-this.width; break;
            case 1: nIndex = index+1; break;
            case 2: nIndex = index+this.width; break;
            case 3: nIndex = index-1; break;
            default: break;}
        return nIndex;
    } //neighbor(index,direction)

    numberOfExits(_i) {return this.cells[_i].exits;}

    pathToGold(x,y) { // Returns direction 0-3 of shortest path to gold.

        let chosenExit = new Array();
        let test = this.width*this.height;
        let localIndex = this.cellIndex(x,y);
        this.cells[localIndex].walls.forEach((e,i) => {
            if (e==0) {
                let localNeighbor = this.neighbor(localIndex,i);
                let distTest = this.cells[localNeighbor].distance;
                if (distTest<test) {chosenExit = new Array(); chosenExit.push(i); test = distTest;}
                if (distTest==test) {chosenExit.push(i);}
            }
        })
        this.cells.forEach((e,i) => {
          let newD = this.width*this.height;
          if (e.visited==0) {
            e.walls.forEach((f,j) => {
              if (f==0) {
                newD = Math.min(this.cells[this.neighbor(i,j)].distance,newD);}
            });
            e.distance=newD+1;
          }
        });
        return chosenExit[Math.trunc(Math.random()*chosenExit.length)];
    } // pathToGold(x,y)

    refreshDistanceMap() {
        for (let times=0;times<3;times++){
          let _md = this.cells.length;
          this.cells.forEach((e,i) => {
              _md = this.cells.length;
              if (e.visited==0) {
                e.walls.forEach((f,j) => {
                  if (f==0) { _md =
                    Math.min(this.cells[this.neighbor(i,j)].distance,_md);}
                });
              e.distance=_md+1;
            }
          });
        }
    } //refreshDistanceMap()

    removeWall(i,d) { //i= index, d = direction (0,1,2,3)(up right down left)
        let _ret = false;
        if (this.cells[i].walls[d] == 1) {
            _ret = true;
            this.cells[i].walls[d] = 0;
            this.cells[this.neighbor(i,d)].walls[(d+2)%4]=0;
        }
        return _ret;
    } //removeWall()

    setHue(h) { var r,g,b,i,j,k;
        i = Math.floor(h * 6);
        j = h*6-i;      k = 1-j;
        switch (i % 6) {
            case 0: r = 0.85-j*0.25, g = j*0.6, b = 0; break;
            case 1: r = k*0.6, g = 0.6, b = 0; break;
            case 2: r = 0, g = 0.6, b = j; break;
            case 3: r = 0, g = k*0.6, b = 1.0; break;
            case 4: r = j*0.85, g = 0, b = 1.0-j*0.15; break;
            case 5: r = 0.85, g = 0, b = k; break;}
        this.color = { r: Math.round(r * 255),
                       g: Math.round(g * 255),
                       b: Math.round(b * 255)};
    } //setHue(h)
} //class Maze
