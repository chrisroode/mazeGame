
class Menu {
    constructor(gameRef) {
        this.game = gameRef;
        this.color = 0;
    } //constructor(widthm,height)

    draw(context) {
        this.color = (this.color+10)%360;
        context.save();
        context.fillStyle = "#000000dd";
        context.fillRect(40,0,240,180);

        context.save();
        context.font = '24px monospace';
        context.fillStyle =
            'rgb('+this.getColor().r+','+this.getColor().g+','+this.getColor().b+')';
        //context.fillStyle = "#88ddff";
        context.fillText("It's Not Pacman!", 45, 15);
        context.restore();

        context.font = '8px monospace';
        context.fillStyle = "#88ddff";
        //context.fillText('Time Trial:  5 minute, 10 minute, 15 minute', 50, 35);
        context.fillText('Press 1 to play Play Zen Game', 50, 45);
        context.fillText('Press 2 to see Autoplay', 50, 55);
        context.fillText('Press 3 to play two player.', 50, 65);
        //context.fillText('Play custom maps', 50, 75);
        context.fillStyle = "#88aacc";
        context.fillText('How to play: Collect all the gold in the maze', 50, 95);
        context.fillText('to unlock a bigger maze with more gold.  Hurry', 50, 105);
        context.fillText('up, because the time is limited!  Use arrow', 50, 115);
        context.fillText('keys or WASD, whatever your preference.', 50, 125);
        context.restore();
    } // draw(context)

    getColor() { var r,g,b,i,j,k;
        let h = this.color/360;
        i = Math.floor(h * 6);
        j = h*6-i;      k = 1-j;
        switch (i % 6) {
            case 0: r = 1.0, g = j, b = 0; break;
            case 1: r = k, g = 1.0, b = 0; break;
            case 2: r = 0, g = 1.0, b = j; break;
            case 3: r = 0, g = k, b = 1.0; break;
            case 4: r = j, g = 0, b = 1.0; break;
            case 5: r = 1.0, g = 0, b = k; break;}
        let ret =    { r: Math.round(r * 255),
                       g: Math.round(g * 255),
                       b: Math.round(b * 255)};
        return ret;
    } //setHue(h)
} //class Menu
