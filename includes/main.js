class NotPacman extends Engine {
    constructor() {
        super();
        this.maze = new Maze(16,8);
        this.player = []; //[new Player(5,2,this.maze)];
        this.bot = [new Bot(5,2,this.maze)];
        this.menu = new Menu(this);

        this.gameMode = {timed:false,
                         zen:false,
                         edit:false,
                         auto:false,
                         paused:false,
                         demo:true,
                         botIncrease:false};
        this.display = {menu:true,
                        color:240};
        this.hud = {score: [0],
                    time: 0,
                    remaining: 0};
        this.autoMoveTimer = {v:0.0,t:0.25};
        this.pan = {x:0,y:0,xt:0,yt:0}; //Take this out

    }
    gameInit() {
        if (super.gameInit()){
            return true;
        } else return false;

    }
    inputUpdate(elapsedTime) {
        if (this.display.menu) {
            this.menuSelect.forEach ((e,i) => {
                if (e) {
                    switch (i) {
                        case 0: this.setForZen(); break;
                        case 1: this.setForAuto(); break;
                        case 2: this.setForTwoPlayer(); break;
                        case 3: break;
                        default: break;
                    }
                    this.menuSelect[i] = false;
                }
            });
        } else {
            this.joystick.forEach((e) => {
                if (e.pressed) {
                    let p = this.player[e.target];
                    p.move(e.d);
                    if (p.getGold()) this.hud.score++;
                    else this.hud.score--;
                }
            });
        }
        this.menuSelect.forEach ((e,i) => {this.menuSelect[i] = false;});
        this.joystick.forEach ((e) => {e.pressed = false;});
        return true;
    }
    gameUpdate(elapsedTime) {
        if (this.display.menu&&!this.gameMode.demo) return true;
        this.player.forEach((e) => {
            e.updatePosition(elapsedTime);
        });
        this.bot.forEach((e) => {
            e.updatePosition(elapsedTime);
        });

        this.autoMoveTimer.v += elapsedTime;
        if (this.autoMoveTimer.v>this.autoMoveTimer.t) {
            this.autoMoveTimer.v -= this.autoMoveTimer.t;
            this.maze.refreshDistanceMap();
            this.maze.redraw.gold = true;
            this.bot.forEach((e) => {
                e.autoMove(this.maze);
                e.getGold();
            });
            if (this.maze.getGoldCount()==0) this.incrementLevel();
        }

        return true;
    }
    renderUpdate(elapsedTime) {
        this.context.save();
        //this.context.resetTransform();
        //this.context.clearRect(0,0,this.consts.vWidth,this.consts.vHeight);

        this.context.beginPath();
        this.context.moveTo(0,0);
        this.context.lineTo(320,0);
        this.context.lineTo(320,160);
        this.context.lineTo(0,160);
        this.context.closePath();
        this.context.clip();

        // Draw Maze and Player
        this.context.save();
        let scale = Math.min((this.consts.vWidth)*0.097/this.maze.width,
                             (this.consts.vHeight-10)*0.097/this.maze.height);
        this.context.transform(scale,0,0,scale*6/7,scale*10/this.maze.width,10+scale*10/this.maze.height);
        //this.context.transform(1,0,0,1,this.pan.x, this.pan.y);

        this.maze.draw(this.context);
        this.bot.forEach((e) => {
            e.draw(this.context);
        });
        this.player.forEach((e) => {
            e.draw(this.context);
        });
        this.context.restore();

        // Draw HUD
        this.context.save();
        this.context.fillStyle = "#dddddd";
        this.context.font = '8px monospace';
        this.context.fillText('score: '+this.hud.score, 12, 8);
        this.context.restore();

        //Draw Menu
        if (this.display.menu) {
            this.context.save();
            //this.context.resetTransform();
            this.menu.draw(this.context);
            this.context.restore();
        }

        if (true) { // Troubleshooting
            this.context.save();
            this.context.fillStyle = "#000080";
            this.context.fillRect(0,160,320,160);
            this.context.fillRect(320,0,320,160);
            this.context.fillRect(0,-160,320,160);
            this.context.fillRect(-320,0,320,160);
            this.context.restore();
        }

        this.context.restore();
        return true;
    }
    resizeCallback() {
        super.resizeCallback();
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
    }
    setForZen() {
        if (verboseG) console.log("setForZen() from main.js");
        this.gameMode = {timed:false,
                         zen:true,
                         edit:false,
                         auto:false,
                         paused:true,
                         demo:false};
        this.display = {menu:false,
                        color:240};
        this.hud = {score: 0,
                        time: 0,
                    remaining: 0};

        this.joystick[1].target = 0;
        let newSize = {x:5,y:3};
        this.maze = new Maze(newSize.x, newSize.y);
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
        this.player = [new Player(2,1,this.maze)];
        this.player.forEach((e) => {
            e.getGold();
        });
        this.bot = [];
        this.display.color = 240;
        this.maze.setHue(this.display.color/360);
        this.gameMode.paused = false;
    }
    setForAuto() {
        if (verboseG) console.log("setForAuto() from main.js");
        this.gameMode = {timed:false,
                         zen:false,
                         edit:false,
                         auto:true,
                         paused:true,
                         demo:false};
        this.display = {menu:false,
                        color:240};
        this.hud = {score: 0,
                        time: 0,
                    remaining: 0};

        let newSize = {x:5,y:3};
        this.maze = new Maze(newSize.x, newSize.y);
        this.player = [];
        this.bot = [new Bot(2,1,this.maze)];
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
        this.bot.forEach((e) => {
            e.getGold();
        });
        this.display.color = 240;
        this.maze.setHue(this.display.color/360);
        this.gameMode.paused = false;

    }
    setForTwoPlayer() {
        if (verboseG) console.log("setForAuto() from main.js");
        this.gameMode = {timed:false,
                         zen:false,
                         edit:false,
                         auto:false,
                         paused:true,
                         demo:false};
        this.display = {menu:false,
                        color:240};
        this.hud = {score: 0,
                        time: 0,
                    remaining: 0};
        let newSize = {x:5,y:3};
        this.joystick[1].target = 1;

        this.maze = new Maze(newSize.x, newSize.y);
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
        this.player = [new Player(3,1,this.maze),
                       new Player(1,1,this.maze)];
        this.player[1].color = "#88ee22";
        this.player.forEach((e) => {
            e.getGold();
        });
        this.bot = [];
        this.display.color = 240;
        this.maze.setHue(this.display.color/360);
        this.gameMode.paused = false;

    }
    incrementLevel() {
        if (verboseG) console.log("incrementLevel() from main.js");
        let newSize = {x:this.maze.width,y:this.maze.height};
        if (!this.gameMode.demo) {
            newSize.x = this.maze.width+1;
            newSize.y = Math.trunc(newSize.x*0.546875);
        }
        if (this.gameMode.botIncrease) {
            this.bot.push(new Bot(Math.trunc(Math.random()*newSize.x),Math.trunc(Math.random()*newSize.y),this.maze));
        }

        this.maze = new Maze(newSize.x, newSize.y);
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
        this.player.forEach((e) => {
            e.mazeRef = this.maze;
            e.getGold();
        });
        this.bot.forEach((e) => {
            e.mazeRef = this.maze;
            e.getGold();
        });
        this.display.color = (this.display.color+17)%360;
        this.maze.setHue(this.display.color/360);

    }
    toggleMenu() {
        if (verboseG) console.log("toggleMenu() from main.js");
        if (this.display.menu) this.display.menu = false;
        else this.display.menu = true;
        this.maze.redraw.maze = true;
        this.maze.redraw.gold = true;
    }
}

//Launching code
var gameEngine = new NotPacman();
gameEngine.gameInit();
gameEngineStart();
