//Globals
var MAX_WIDTH, MAX_HEIGHT, MAX_COUNT, GAME_SPEED, NEW_BUBBLES, INTERVAL;

function initialize(c) {
    //Add audio
    audio = new Audio('pop.mp3');
    //Add event listeners
    c.addEventListener('mousemove', function (evt) {
        mouseMove(c, evt);
    }, false);
    c.addEventListener('touch', function (evt) {
        mouseMove(c, evt);
    }, false);
    
    //Reload the page if size or orientation change
    window.onresize = function(){ main(); };
    
    //Initialize bubbles
    makeBubbles(bubbles);
}

/******************
 * @param int x
 * @param int y
 * @param int color
 * @returns {bubble}
 */
function bubble(x, y, color) {
    //x and y are optional parameters
    do {
        if (x === undefined) { this.x = rand(1, MAX_WIDTH);    }
        else { this.x = x; }
        this.dx = rand(-3.1, 3.1);
        if (x === undefined) { this.y = rand(1, MAX_HEIGHT);   }
        else { this.y = y; }
        this.dy = rand(-3.1, 3.1);
        this.r = rand(14, (MAX_WIDTH / 16));     //Max radius is 1/20 or 5% of the screen width
        this.rad = rand(1, this.r / 6);

        switch (color) {
        case 1:
            this.color = ["#ccc", "#494", "#6AD"];
            break;
        case 2:
            this.color = ["#0cc", "#44f", "#6AD"];
            break;
        case 3:
            this.color = ["#ccc", "#f9f", "#9AD"];
            break;
        case 4:
            this.color = ["#c71", "#1ce", "#ad3"];
            break;
        case 5:
            this.color = ["#fae", "#c81", "#09d"];
            break;
        default:
            this.color = ["#ccc", "#49f", "#6AD"];
        }
    } while (!this.dx && !this.dy)
}
;

function makeBubbles(bubbles) {
    for (var i = 0; i < MAX_COUNT; i++) {
        bubbles[i] = new bubble();
    }
}

function drawBubble(ctx, bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(
            bubble.x,
            bubble.y,
            bubble.rad,
            bubble.x,
            bubble.y,
            bubble.r);
    grd.addColorStop(0, bubble.color[0]);
    grd.addColorStop(1, bubble.color[1]);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = bubble.color[2];
    ctx.stroke();
}

function wrap(bubble) {
    if (bubble.x < 0)
        bubble.x += (MAX_WIDTH - 1);
    if (bubble.x > MAX_WIDTH)
        bubble.x -= (MAX_WIDTH + 1);
    if (bubble.y < 0)
        bubble.y += (MAX_HEIGHT - 1);
    if (bubble.y > MAX_HEIGHT)
        bubble.y -= (MAX_HEIGHT + 1);
}

function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function mouseMove(c, evt) {
    var mouse = getMousePos(c, evt);
    for (i = 0; i < bubbles.length; i++) {
        //Detect mouse collision
        if (mouse.x < (bubbles[i].x + bubbles[i].r+3) && mouse.x > (bubbles[i].x - bubbles[i].r-3)) {
            if (mouse.y < (bubbles[i].y + bubbles[i].r+3) && mouse.y > (bubbles[i].y - bubbles[i].r-3)) {
                audio.pause();
                audio.currentTime = 0;
                audio.play();
                bubbles.splice(i, 1);
                return;
            }
        }
    }
}

function spawnBubbles() {
    //Start bubbles?
    if (bubbles.length <= 42 && !NEW_BUBBLES){
        NEW_BUBBLES = rand(1, 6);
    }
    //Spawn bubbles
    if (NEW_BUBBLES) {
        bubbles[bubbles.length] = new bubble(-MAX_WIDTH, MAX_HEIGHT, NEW_BUBBLES);
    }
    //Stop bubbles?
    if (bubbles.length >= MAX_COUNT) {
        NEW_BUBBLES = 0;
    }   
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function runGame() {
    //Wipe screen
    ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

    //Handle bubbles
    for (var i = 0; i < bubbles.length; i++) {
        //Draw bubbles
        drawBubble(ctx, bubbles[i]);
        //Move bubbles
        bubbles[i].x += bubbles[i].dx;
        bubbles[i].y += bubbles[i].dy;
        //Wrap bubbles around screen
        wrap(bubbles[i]);
    }
    
    //Check for new bubbles
    spawnBubbles();
}

/*****************
 * START
 ******************/
function main() {
//Get canvas
var c = document.getElementById("c");
ctx = c.getContext("2d");

//Set height and width
c.width = innerWidth-30;
c.height = innerHeight-20;
MAX_WIDTH = c.width;
MAX_HEIGHT = c.height;
MAX_COUNT = 110;
GAME_SPEED = 70;
NEW_BUBBLES = false;

clearInterval(INTERVAL);

//Start game
bubbles = [];
initialize(c);
//Run game
INTERVAL = setInterval(runGame, GAME_SPEED);

}
