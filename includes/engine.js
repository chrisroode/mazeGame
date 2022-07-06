//Engine Version 1.0
class Engine {
/*
    Constructor will get a canvas named "canvas" and use it for the game.
    Main run loop will

    Virtual resolution is 320 x 180.  16:9 ratio kept all times.

*/
    constructor() {
        this.consts = {vWidth:320,vHeight:160};
        this.canvas = document.getElementById("canvas");
        this.canvas.style = "position:absolute;top:20px;left:0px;";
        console.log(this.canvas);
        this.context = canvas.getContext('2d');
        this.tStart = new Date();
        this.tEnd = new Date();
        this.transform = {sx:1,sy:1,tx:0,ty:0};
        this.joystick = [{d:0,pressed:false, target:0},{d:0,pressed:false, target:0}];
        this.menuSelect = [false,false,false,false];

    }
    //Override Subclassing Methods
    gameInit() {this.resizeCallback();return true;}
    gameUpdate(elapsedTime) {return true;}
    renderUpdate(elapsedTime) {return true;}
    inputUpdate(elapsedTime) {return true;}
    toggleMenu() {return true;}
    //Override Subclassing Methods

    resizeCallback() {
        let _t = { x:window.innerWidth/320,
                   y:window.innerHeight/160,
                  xt:0,
                  yt:0,
                  cx:window.innerWidth,
                  cy:window.innerHeight};
        if (_t.x<_t.y) {
            _t.y = _t.x;     _t.yt = (_t.cy-_t.y*160)/2;
        } else {
            _t.x = _t.y;     _t.xt = (_t.cx-_t.x*320)/2;
        }
        this.transform = {sx: _t.x, sy: _t.y, tx: _t.xt, ty: _t.yt};
        canvas.width = _t.cx;
        canvas.height = _t.cy;
        // this.transform = {sx: 1, sy: 1, tx: 0, ty: 0};
        canvas.width = 320*_t.x;
        canvas.height = 160*_t.y;
        this.canvas.style = "position:absolute;top:"+_t.yt+"px;left:"+_t.xt+"px;";
    }
    inputCallback(e) {

    }
    mainRunLoop() {
        this.tStart = new Date();
        if (document.hasFocus()) {
            var elapsedTime = ((this.tStart - this.tEnd)*0.001)%1.0;

            this.inputUpdate(elapsedTime);
            this.gameUpdate(elapsedTime);

            this.context.save();
            this.context.resetTransform();
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

            this.context.transform(this.transform.sx,0,0,
                                   this.transform.sy,
                                   0,
                                   0);
            this.renderUpdate(elapsedTime);
            this.context.restore();
        }
        this.tEnd = this.tStart;
    }

    start() {}
    stop() {}


}

//Global Functions
function gameEngineStart() {
    gameEngineTimer = setInterval(gameEngineLoop,20);
}
function gameEngineStop() {
    clearInterval(gameEngineTimer);
}
function gameEngineLoop() {
    gameEngine.mainRunLoop();
}
function gameEngineInput() {
    //
}
function gameEngineResize() {
    if (verboseG) console.log("gameEngineResize() from engine.js");
    gameEngine.canvas.width = window.innerWidth;
    gameEngine.canvas.height = window.innerHeight;
    gameEngine.resizeCallback();
}

var gameEngineTimer;
var verboseG = false;

function keyInput(e) { //Send to Engine, simplify
    if (verboseG) console.log("keyInput() from engine.js");
    switch (e.keyCode) {
        case 39:gameEngine.joystick[0].d = 1;
                gameEngine.joystick[0].pressed = true;break;
        case 37:gameEngine.joystick[0].d = 3;
                gameEngine.joystick[0].pressed = true;break;
        case 38:gameEngine.joystick[0].d = 0;
                gameEngine.joystick[0].pressed = true;break;
        case 40:gameEngine.joystick[0].d = 2;
                gameEngine.joystick[0].pressed = true;break;
        case 68:gameEngine.joystick[1].d = 1;
                gameEngine.joystick[1].pressed = true;break;
        case 65:gameEngine.joystick[1].d = 3;
                gameEngine.joystick[1].pressed = true;break;
        case 87:gameEngine.joystick[1].d = 0;
                gameEngine.joystick[1].pressed = true;break;
        case 83:gameEngine.joystick[1].d = 2;
                gameEngine.joystick[1].pressed = true;break;
        case 49: gameEngine.menuSelect[0]=true; break;
        case 50: gameEngine.menuSelect[1]=true; break;
        case 51: gameEngine.menuSelect[2]=true; break;
        case 27: gameEngine.toggleMenu();break;
        default:break;
    }
}
window.addEventListener("keydown",keyInput);
window.addEventListener("resize",gameEngineResize);
