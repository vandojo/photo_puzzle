class Puzzle {
  constructor(cols, rows, imgSource, imgW, imgH) {
    this.cols = cols;
    this.rows = rows;
    this.imgSource = imgSource;
    this.imgW = imgW;
    this.imgH = imgH;
    // width of image divided by number of columns
    this.tileW = imgW / cols;

    // height of image divided by number of rows
    this.tileH = imgH / rows;

    // array of all tiles
    this.tiles = [];

    // order of tiles
    this.tileOrder = [];
  }

  // Function to create the tiles in the puzzle
  createTiles = () => {
    // loop through all tiles - column row combination
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // create image object for current tile
        let imgSection = createImage(this.tileW, this.tileH);

        // current tile number
        let tileNo = i + j * this.cols;

        // get starting coordinates for current tile
        let x = i * this.tileW;
        let y = j * this.tileH;

        // copy the pixels from corresponding area
        // from original image to the tile
        // x,y, are where to copy from in the original image
        // 0, 0 because need to copy to start of image pixel buffer.
        imgSection.copy(
          this.imgSource,
          x,
          y,
          this.tileW,
          this.tileH,
          0,
          0,
          this.tileW,
          this.tileH
        );

        let tileObj = {tileNo: tileNo, imgSection: imgSection};

        // add the tile number to the array holding the order of tiles
        this.tileOrder.push(tileObj.tileNo);
        this.tiles.push(tileObj);
      }
    }

    // last step is to remove the final tile
    // this gives the user a starting point
    this.tileOrder.pop();
    this.tiles.pop();
    // -9999 refers to empty spot
    this.tileOrder.push(-1);
  };

  // function to draw the tiles of the puzzle
  drawTiles = () => {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // current tile number
        let tileNo = i + j * this.cols;
        let currentTile = this.tileOrder[tileNo];

        // get starting coordinates for current tile
        let x = i * this.tileW;
        let y = j * this.tileH;

        if (currentTile > -1) {
          let imgSection = this.tiles[currentTile].imgSection;
          image(imgSection, x, y, this.tileW, this.tileH);
        }
      }
    }
  };

  // function that is called when a tile is clicked
  clickedTile = () => {
    // these represent the x, y coordinates in the grid
    // of the tile that has been clicked
    let tileX = Math.floor(mouseX / this.tileW);
    let tileY = Math.floor(mouseY / this.tileH);

    this.moveTiles(tileX, tileY);
  };

  // function that returns x and y indices of missing tile
  missingTile = () => {
    for (let i = 0; i < this.tileOrder.length; i++) {
      if (this.tileOrder[i] == -1) {
        let missingTileX = i % this.cols;
        let missingTileY = Math.floor(i / this.rows);
        return [missingTileX, missingTileY, i];
      }
    }
  };

  // function that returns a bool
  // depending on whether the tile that has been clicked
  // is adjancent to the missing tile
  adjacentMissingTile = (tileX, tileY, missingTileX, missingTileY) => {
    // this returns true is the tiles are diagonal to each other
    // diagonal moves are illegal, thus the function returns false
    if (tileX !== missingTileX && tileY !== missingTileY) {
      return false;
    }

    // return true if absolute distance between
    // row or column of tile and missing tile
    // is equal to 1
    if (abs(tileX - missingTileX) == 1 || abs(tileY - missingTileY) == 1) {
      return true;
    }

    return false;
  };

  // move two elements in the tile array
  move = (tileA, tileB) => {
    let temp = this.tileOrder[tileA];
    this.tileOrder[tileA] = this.tileOrder[tileB];
    this.tileOrder[tileB] = temp;
  };

  moveTiles = (tileX, tileY) => {
    // get location of the missing tile
    const [missingTileX, missingTileY, missingIndex] = this.missingTile();

    if (this.adjacentMissingTile(tileX, tileY, missingTileX, missingTileY)) {
      let tileIndex = tileX + tileY * this.cols;
      this.move(missingIndex, tileIndex);
    }
  };

  puzzleBoundary = () => {
    stroke(0, 255, 0);
    strokeWeight(5);
    noFill();
    rect(0, 0, this.imgW, this.imgH);
  };

  solved = () => {
    for (let i = 0; i < this.tileOrder.length - 1; i++) {
      // if two elements at the same index have different values
      // then the image is not fixed and return false
      if (this.tileOrder[i] !== this.tiles[i].tileNo) {
        return false;
      }
    }
    // the image is correct, return true
    return true;
  };

  isGameOver = () => {
    if (this.solved()) {
      textSize(20);
      textAlign(CENTER, CENTER);
      fill(0);
      text("Congratulations, you won!", this.imgW / 2, this.imgH / 2);
      noFill();
    }
  };
}
