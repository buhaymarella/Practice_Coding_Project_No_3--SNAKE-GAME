const game_speed = 100;
const canvas_border_color = 'black';
const canvas_background_color = "white";
const snake_color = "lightgreen";
const snake_border_color="darkgreen";
const food_color = "red";
const food_border_color = "darkred";



let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];
let score = 0; //the user score
let changingDirection = false; //when set to true the snake will change its direction 
let foodX; // food Y-coordinate
let foodY; //food Y-coordinate
let dx = 10; //Horizontal Velocity
let dy=10; //Vertical Velocity

const gameCanvas = document.getElementById("gameCanvas"); //get canvas element from html

const ctx = gameCanvas.getContext("2d"); //Return two dimensional drawing context

//START GAME!//
main(); 

createFood(); // Creates food first location

document.addEventListener("keydown", changeDirection); // call change direction whwnever a key is pressed

function main(){ //Main function of the game ---called repeatedly to advance the game
    if (didGameEnd()) return;

    setTimeout(function onTick(){
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        main();
    }, game_speed)
}

function clearCanvas(){
    ctx.fillStyle = canvas_background_color;
    ctx.strokestyle = canvas_border_color;

    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawFood(){ // draw food on canvas
    ctx.fillStyle = food_color;
    ctx.strokestyle = food_border_color;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function advanceSnake(){ /* advances the snake by changing the x-coordinates of its parts
        (According to horizontal velocity and y-coordinate of its parts)
        (Acoording to the vertical velocity)
    */

    const head = {x: snake[0].x + dx, y: snake[0].y +dy}; // create new snake head

    snake.unshift(head); // add the new head to the beginning of snake body

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if(didEatFood){
        score += 10; 

        document.getElementById('score').innerHTML = score; //Display score on the screen

        createFood(); // Generate new food location
    }else{
        snake.pop(); // remove the last part of snake body
    }
}

function didGameEnd(){ // returns TRUE if the head of the snake touched another part of the game ---- or any of the walls
    for (let i = 4; i < snake.length; i++ ){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomTen(min, max){
    return Math.round(Math.random() * (max-min)/10)*10;
}

function createFood(){ // create randomo set of coordinates for food //
    foodX = randomTen(0, gameCanvas.width - 10); // generate random number for food x-coordinate

    foodY = randomTen(0, gameCanvas.height - 10); // generate random number for food y-coordinate

    //if new food location is where the snake is currently is, generate a new food location
    snake.forEach(function isFoodOnSnake(part){
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if(foodIsoNsnake)
        createFood();
    });
}

function drawSnake(){ // draw snake on canvas
    snake.forEach(drawSnakePart); // loop through the snake parts drawing each part on the canvas.
}

function drawSnakePart(snakePart){
    ctx.fillStyle = snake_color; //give snake color and border// 
    ctx.strokestyle = snake_border_color;

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10); // draw filled rectangle 

    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10); // draw border in snake
}

/* 
    Changes the vertical and horizontal velocity of the snake according to the
    (key that was pressed),
    (The direction cannot be switched to the opposite direction, to prevent the snake form reversing)
    EX: if the snake is  RIGHT it cannot become LEFT
*/
function changeDirection(event){
    const Left_key = 37;
    const right_key = 39;
    const up_key = 38;
    const down_key = 40;


    /* Prevent snake from reversing *Example scenario: 
        snake is moving to the rigth. User presses down and immediately left.
        and the  snake immediately changes direction without taking a step down first.
    */
    if (changingDirection)
    return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown  = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === Left_key && !goingRight){
        dx = -10;
        dy = 0;
    }
    if (keyPressed == up_key && !goingDown){
        dx = 0;
        dy = -10;
    }
    if (keyPressed === right_key && !goingLeft){
        dx = 10;
        dy = 0;
    }
    if  (keyPressed === down_key && !goingUp){
        dx = 0;
        dy= 10;
    }
}
