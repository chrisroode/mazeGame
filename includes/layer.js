
class Layer {
    getImage() {return this.context.getImageData(0,0,this.size.w,this.size.h);}
    getContext() {return this.context;}
    constructor(width,height) {
        this.offset = {x:0,
                       y:0};
        this.size = {w:width,
                     h:height};
        this.transform = {xscale: 1,
                          yscale: 1,
                       xtranlate: 0,
                      ytranslate: 0};
        this.needsRender = true;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size.w;
        this.canvas.height = this.size.h;
        this.context = this.canvas.getContext('2d');

    } //constructor(width,height)


    draw() {
        let ctx = this.context;
        ctx.save();
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0,0,this.size.w/2,this.size.h/2);
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(0,this.size.h/2,this.size.w/2,this.size.h/2);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.size.w/2,0,this.size.w/2,this.size.h/2);
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(this.size.w/2,this.size.h/2,this.size.w/2,this.size.h/2);
        ctx.restore();
    } // draw(context)


} //class Maze
