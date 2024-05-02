let og_img;
let puzzle;
const cols = 4;
const rows = 4;

let selectImage;
let button;

let imageNames = ["elephant.jpg", "mammal.jpg", "mammal2.jpg", "raccoon.jpg"];

function preload() {
  selectImage = Math.floor(Math.random() * 5);
  og_img = loadImage("assets/images/" + imageNames[selectImage]);
}

function setup() {
  createCanvas(400, 400);

  og_img.resize(400, 400);

  // instantiate a puzzle object
  puzzle = new Puzzle(cols, rows, og_img, width, height);
  // create the tiles
  puzzle.createTiles();

  // shuffle the tiles in the puzzle
  puzzle.tileOrder = fisherYates(puzzle.tileOrder);
}

function draw() {
  background(125);
  puzzle.drawTiles();
  puzzle.puzzleBoundary();
  puzzle.isGameOver();
}

function mousePressed() {
  puzzle.clickedTile();
}
