/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BOARD_WIDTH: () => (/* binding */ BOARD_WIDTH),
/* harmony export */   PLAYER_1_BOARD_ID: () => (/* binding */ PLAYER_1_BOARD_ID),
/* harmony export */   PLAYER_2_BOARD_ID: () => (/* binding */ PLAYER_2_BOARD_ID),
/* harmony export */   TILES: () => (/* binding */ TILES),
/* harmony export */   TILE_CLASSES: () => (/* binding */ TILE_CLASSES)
/* harmony export */ });
const BOARD_WIDTH = 10;
const PLAYER_1_BOARD_ID = "player1Board";
const PLAYER_2_BOARD_ID = "player2Board";
const TILES = {
  WATER: "W",
  MISS: "O",
  HIT: "X"
};
const TILE_CLASSES = {
  WATER: "water-cell",
  MISS: "miss-cell",
  HIT: "hit-cell",
  SHIP: "ship-cell"
};


/***/ }),

/***/ "./src/domBoardHandler.js":
/*!********************************!*\
  !*** ./src/domBoardHandler.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDOMBoardHandler: () => (/* binding */ createDOMBoardHandler)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");

const createDOMBoardHandler = () => {
  let boardDisplay = null;
  let player1Board = null;
  let player2Board = null;
  let activeBoard = null;
  const selectCellEvent = (gridCell, resolve) => {
    const attackCoordinates = [gridCell.getAttribute("data-x"), gridCell.getAttribute("data-y")];

    // console.log(`[${attackCoordinates[0]}, ${attackCoordinates[1]}]`);

    resolve(attackCoordinates);
    deactivateCurrentBoard();
  };

  // Create a grid to store information about a player's board
  function createGridDisplay(grid, id) {
    const board = document.createElement("span");
    board.id = id;
    board.classList.add("game-board");

    // Create grid cells with cell information stored and displayed
    grid.forEach((row, x) => {
      row.forEach((cell, y) => {
        const gridCell = document.createElement("span");
        gridCell.classList.add("grid-cell");
        gridCell.classList.add(cell === _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER ? _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER : _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
        gridCell.setAttribute("data-x", x);
        gridCell.setAttribute("data-y", y);
        gridCell.setAttribute("data-player-id", id);
        gridCell.textContent = cell;
        board.appendChild(gridCell);
      });
    });
    boardDisplay.prepend(board);
  }
  function createHiddenDisplay(grid, id) {
    const board = document.createElement("span");
    board.id = id;
    board.classList.add("game-board");

    // Create grid cells with cell information stored and displayed
    grid.forEach((row, x) => {
      row.forEach((_, y) => {
        const gridCell = document.createElement("span");
        gridCell.classList.add("grid-cell");
        gridCell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
        gridCell.setAttribute("data-x", x);
        gridCell.setAttribute("data-y", y);
        gridCell.setAttribute("data-player-id", id);
        board.appendChild(gridCell);
      });
    });
    boardDisplay.prepend(board);
  }

  // Remove ability to attack cells on opponent's board
  function deactivateCurrentBoard() {
    // Clone the parent node to remove all event listeners
    const clonedBoard = activeBoard.cloneNode(true);
    boardDisplay.replaceChild(clonedBoard, activeBoard);

    // Update references
    if (activeBoard === player1Board) {
      player1Board = clonedBoard;
    } else {
      player2Board = clonedBoard;
    }
    activeBoard = clonedBoard;
    activeBoard.childNodes.forEach(cell => {
      cell.classList.remove("clickable");
    });
  }
  return {
    // Create and render display of both players boards
    renderInitialBoard(player1Grid, player2Grid) {
      let hideSecondBoard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      boardDisplay = document.querySelector(".board-display");
      createGridDisplay(player1Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID);
      if (hideSecondBoard) {
        createHiddenDisplay(player2Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID);
      } else {
        createGridDisplay(player2Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID);
      }
      player1Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID}`);
      player2Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID}`);
      activeBoard = player2Board;

      // Position player 1's board facing screen
      player1Board.classList.add("focused-board");
      player2Board.classList.add("unfocused-board");
    },
    // Flip the rendered board display
    flipBoards() {
      // Flip player 1 board cells
      player1Board.classList.toggle("focused-board");
      player1Board.classList.toggle("unfocused-board");

      // Flip player 2 board cells
      player2Board.classList.toggle("focused-board");
      player2Board.classList.toggle("unfocused-board");
      this.switchActiveBoard();

      // Switch board positions
      boardDisplay.prepend(boardDisplay.lastChild);
    },
    // Make all attackable cells on opponent's board selectable for attacks
    async activateCurrentBoard() {
      return new Promise(resolve => {
        Array.from(activeBoard.childNodes).forEach(cell => {
          if (
          // Tile hasn't already been attacked
          ![_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.HIT, _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.MISS].some(tileType => cell.classList.contains(tileType))) {
            console.log(cell);
            // Make selectable by click
            cell.addEventListener("click", () => selectCellEvent(cell, resolve));
            cell.classList.add("clickable");
          }
        });
      });
    },
    receiveAttack(_ref, hit) {
      let [x, y] = _ref;
      const attackedCell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"][data-player-id="${activeBoard.id}"]`);
      attackedCell.textContent = hit ? _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.HIT : _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER;
      attackedCell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
      attackedCell.classList.remove("clickable");
      attackedCell.classList.add(hit ? _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.HIT : _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.MISS);
    },
    // Change which board is active
    switchActiveBoard() {
      activeBoard = activeBoard === player1Board ? player2Board : player1Board;
    }
  };
};


/***/ }),

/***/ "./src/domMessageHandler.js":
/*!**********************************!*\
  !*** ./src/domMessageHandler.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDOMMessageHandler: () => (/* binding */ createDOMMessageHandler)
/* harmony export */ });
const createDOMMessageHandler = () => {
  // Create message banner
  // const modal = document.createElement("div");
  // modal.classList.add("modal");
  const messageBanner = document.createElement("div");
  messageBanner.classList.add("message-banner");
  // modal.appendChild(messageBanner);
  document.querySelector("body").prepend(messageBanner);
  return {
    displayCurrentTurn() {
      let playerTurn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      messageBanner.textContent = playerTurn ? "Your turn! Make an attack" : `Opponent Turn! Making an attack`;
    },
    displayAttackResult(hit) {
      messageBanner.textContent = hit ? "Ship hit!" : "Shot missed!";
    },
    displayWinner(name) {
      messageBanner.textContent = `Victory for ${name}!`;
    }
  };
};


/***/ }),

/***/ "./src/gameHandler.js":
/*!****************************!*\
  !*** ./src/gameHandler.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGameHandler: () => (/* binding */ createGameHandler)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _domBoardHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domBoardHandler */ "./src/domBoardHandler.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _domMessageHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./domMessageHandler */ "./src/domMessageHandler.js");




const createGameHandler = () => {
  function switchActivePlayer() {
    activePlayer = activePlayer === player1 ? player2 : player1;
  }
  function switchActiveBoard() {
    activeBoard = activeBoard === player1Board ? player2Board : player1Board;
  }
  let boardHandler = null;
  let messageHandler = null;
  let player1 = null;
  let player1Board = null;
  let player2 = null;
  let player2Board = null;
  let activePlayer = null;
  let activeBoard = null;
  return {
    setupGame() {
      boardHandler = (0,_domBoardHandler__WEBPACK_IMPORTED_MODULE_1__.createDOMBoardHandler)();
      messageHandler = (0,_domMessageHandler__WEBPACK_IMPORTED_MODULE_3__.createDOMMessageHandler)();
      player1 = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(false);
      player1Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();
      player2 = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(true);
      player2Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();
      activePlayer = player1;
      activeBoard = player2Board;

      // Place ships player 1
      player1Board.placeShip([[3, 3], [7, 3]]);
      player1Board.placeShip([[3, 4], [6, 4]]);
      player1Board.placeShip([[3, 5], [5, 5]]);
      player1Board.placeShip([[3, 6], [5, 6]]);
      player1Board.placeShip([[3, 7], [4, 7]]);

      // Place ships player 2
      player2Board.placeShip([[9, 9], [5, 9]]);
      player2Board.placeShip([[9, 8], [6, 8]]);
      player2Board.placeShip([[9, 7], [7, 7]]);
      player2Board.placeShip([[9, 6], [7, 6]]);
      player2Board.placeShip([[9, 5], [8, 5]]);
      boardHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid(), player2.isComputer);
    },
    // Main game loop
    async playGame() {
      let gameOver = false;
      while (!gameOver) {
        console.log("New turn");
        messageHandler.displayCurrentTurn(!activePlayer.isComputer);
        let validAttack = false;
        while (!validAttack) {
          let attack = null;
          let hit = null;

          // Get computer player move
          if (activePlayer.isComputer) {
            // Pause to simulate computer thinking
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Ask computer for attack
            attack = activePlayer.provideAttackCoordinates();
          }

          // Get human player move
          else {
            // Ask human player for attack
            attack = await boardHandler.activateCurrentBoard();
          }

          // Try that attack on opponent board
          try {
            hit = activeBoard.receiveAttack(attack);
            boardHandler.receiveAttack(attack, hit);
            validAttack = true;
            messageHandler.displayAttackResult(hit);
          } catch {
            // If attack is invalid, ask again
          }
        }

        // Otherwise, register it and then await input from other player
        if (activeBoard.isFleetSunk()) {
          // Game over
          gameOver = true;
          messageHandler.displayWinner("Player 1");
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Switch player turns
        switchActivePlayer();
        switchActiveBoard();
        boardHandler.switchActiveBoard();
        // boardHandler.flipBoards();
      }
    }
  };
};


/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGameboard: () => (/* binding */ createGameboard)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


const createGameboard = () => {
  const MAX_SHIPS = 5;
  const allowedLengths = [{
    number: 2,
    remaining: 1
  }, {
    number: 3,
    remaining: 2
  }, {
    number: 4,
    remaining: 1
  }, {
    number: 5,
    remaining: 1
  }];
  const grid = Array.from({
    length: _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH
  }, () => {
    return Array.from({
      length: _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH
    }).fill(_constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER);
  });
  const placedShips = [];

  // Checks whether a given pair of coordinates is valid for placing a ship
  function isValidCoords(startx, starty, endx, endy) {
    // Ship placed off the board
    if ([startx, starty, endx, endy].some(coord => coord < 0 || coord >= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH)) {
      return false;
    }

    // Ship placed diagonally
    if (startx !== endx && starty !== endy) {
      return false;
    }

    // Check for ships already in the grid
    for (let x = startx; x <= endx; x += 1) {
      for (let y = starty; y <= endy; y += 1) {
        // Ship already placed there
        if (grid[x][y] !== _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER) {
          return false;
        }
      }
    }
    return true;
  }
  return {
    // Place a ship on the game board based on start and end coordinates
    placeShip(_ref) {
      let [[startx, starty], [endx, endy]] = _ref;
      // Max ships already placed
      if (placedShips.length >= MAX_SHIPS) {
        throw new Error("Ship capacity reached");
      }

      // Invalid coordinates
      if (!isValidCoords(startx, starty, endx, endy)) {
        throw new Error("Invalid coordinates");
      }
      const shipLength = 1 + Math.max(Math.abs(startx - endx), Math.abs(starty - endy));

      // Check ship length validity
      const obj = allowedLengths.find(obj => obj.number === shipLength);
      if (obj === undefined || obj.remaining <= 0) {
        throw new Error("Invalid ship length");
      }
      try {
        // Create ship
        const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_1__.createShip)(shipLength);
        placedShips.push(newShip);

        // Add ship references to the grid
        const [minX, maxX] = [Math.min(startx, endx), Math.max(startx, endx)];
        const [minY, maxY] = [Math.min(starty, endy), Math.max(starty, endy)];
        for (let x = minX; x <= maxX; x += 1) {
          for (let y = minY; y <= maxY; y += 1) {
            grid[x][y] = placedShips.length - 1;
          }
        }
        obj.remaining -= 1;
        return true;
      } catch (error) {
        return error;
      }
    },
    receiveAttack(_ref2) {
      let [x, y] = _ref2;
      if ([x, y].some(coord => coord < 0 || coord >= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH)) {
        throw new Error("Invalid coordinates");
      }
      const square = grid[x][y];

      // Duplicate attack
      if (square === _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.MISS || square === _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.HIT) {
        throw new Error("Already attacked this square");
      }

      // Miss
      if (square === _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER) {
        grid[x][y] = _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.MISS;
        return false;
      }

      // Hit
      placedShips[square].hit();
      grid[x][y] = _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.HIT;
      return true;
    },
    isFleetSunk() {
      return placedShips.every(ship => ship.isSunk());
    },
    getGrid() {
      return grid;
    }
  };
};


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPlayer: () => (/* binding */ createPlayer)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");

const createPlayer = isComputer => {
  // Fill an array with all possible attacks on the board
  const possibleAttacks = [];
  for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; x += 1) {
    for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; y += 1) {
      possibleAttacks.push([x, y]);
    }
  }
  return {
    isComputer,
    provideAttackCoordinates() {
      // Pick a random attack
      const attackNumber = Math.floor(Math.random() * possibleAttacks.length);

      // Remove attack from all possible attacks and return it
      const attack = possibleAttacks.splice(attackNumber, 1)[0];
      return attack;
    }
  };
};


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createShip: () => (/* binding */ createShip)
/* harmony export */ });
const createShip = shipLength => {
  // Error checking
  if (typeof shipLength !== "number" || isNaN(shipLength) || shipLength < 1) {
    throw new Error("Invalid ship length");
  }
  const length = shipLength;
  let hits = 0;
  return {
    // Checks whether the ship has more hits than lives
    isSunk() {
      return hits >= length;
    },
    // Add damagae to the ship and check for sinking
    hit() {
      hits += 1;
    }
  };
};


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
    --grid-cell-gap: 1px;
    --grid-padding: 2px;
    --grid-cell-size: 2rem;

    --banner-background: #00000099;
}

/*
 * ------------------------------------------------------------
 * General Styling
 * ------------------------------------------------------------
 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.board-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    background-color: #000000;
}

.game-board {
    display: flex;
    gap: var(--grid-cell-gap);

    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));
    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));

    padding: 2px;

    background-color: #000000;
}

.focused-board {
    flex-wrap: wrap;
}

.unfocused-board {
    flex-direction: row-reverse;
    flex-wrap: wrap-reverse;
}

.grid-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--grid-cell-size);
    height: var(--grid-cell-size);
}

.clickable {
    cursor: pointer;
}
.clickable:hover {
    background-color: rgb(0, 183, 255);
}

.water-cell {
    background-color: aqua;
}

.ship-cell {
    background-color: grey;
}

.miss-cell {
    background-color: #ffffff;
}

.hit-cell {
    background-color: red;
}

/* .modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    align-items: start;

    width: 100%;
    height: 100%;

    overflow: auto;
} */

.message-banner {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 10%;
    width: 100%;

    margin-bottom: 1.5rem;
    padding: 1.5rem 0;

    font-size: xxx-large;
    font-weight: bold;
    color: white;
    background-color: var(--banner-background);
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;AAClC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,2BAA2B;IAC3B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;AACjC;;AAEA;IACI,eAAe;AACnB;AACA;IACI,kCAAkC;AACtC;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;;;;;;;;;;;;;GAaG;;AAEH;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,qBAAqB;IACrB,iBAAiB;;IAEjB,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 2rem;\r\n\r\n    --banner-background: #00000099;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.focused-board {\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.unfocused-board {\r\n    flex-direction: row-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n}\r\n.clickable:hover {\r\n    background-color: rgb(0, 183, 255);\r\n}\r\n\r\n.water-cell {\r\n    background-color: aqua;\r\n}\r\n\r\n.ship-cell {\r\n    background-color: grey;\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n/* .modal {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 2;\r\n\r\n    display: flex;\r\n    align-items: start;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    overflow: auto;\r\n} */\r\n\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    margin-bottom: 1.5rem;\r\n    padding: 1.5rem 0;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameHandler */ "./src/gameHandler.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");


const battleShips = (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createGameHandler)();
battleShips.setupGame();
battleShips.playGame();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsV0FBVyxHQUFHLEVBQUU7QUFDdEIsTUFBTUMsaUJBQWlCLEdBQUcsY0FBYztBQUN4QyxNQUFNQyxpQkFBaUIsR0FBRyxjQUFjO0FBRXhDLE1BQU1DLEtBQUssR0FBRztFQUNWQyxLQUFLLEVBQUUsR0FBRztFQUNWQyxJQUFJLEVBQUUsR0FBRztFQUNUQyxHQUFHLEVBQUU7QUFDVCxDQUFDO0FBRUQsTUFBTUMsWUFBWSxHQUFHO0VBQ2pCSCxLQUFLLEVBQUUsWUFBWTtFQUNuQkMsSUFBSSxFQUFFLFdBQVc7RUFDakJDLEdBQUcsRUFBRSxVQUFVO0VBQ2ZFLElBQUksRUFBRTtBQUNWLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWb0I7QUFFckIsTUFBTUMscUJBQXFCLEdBQUdBLENBQUEsS0FBTTtFQUNoQyxJQUFJQyxZQUFZLEdBQUcsSUFBSTtFQUN2QixJQUFJQyxZQUFZLEdBQUcsSUFBSTtFQUN2QixJQUFJQyxZQUFZLEdBQUcsSUFBSTtFQUN2QixJQUFJQyxXQUFXLEdBQUcsSUFBSTtFQUN0QixNQUFNQyxlQUFlLEdBQUdBLENBQUNDLFFBQVEsRUFBRUMsT0FBTyxLQUFLO0lBQzNDLE1BQU1DLGlCQUFpQixHQUFHLENBQ3RCRixRQUFRLENBQUNHLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFDL0JILFFBQVEsQ0FBQ0csWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUNsQzs7SUFFRDs7SUFFQUYsT0FBTyxDQUFDQyxpQkFBaUIsQ0FBQztJQUUxQkUsc0JBQXNCLENBQUMsQ0FBQztFQUM1QixDQUFDOztFQUVEO0VBQ0EsU0FBU0MsaUJBQWlCQSxDQUFDQyxJQUFJLEVBQUVDLEVBQUUsRUFBRTtJQUNqQyxNQUFNQyxLQUFLLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUM1Q0YsS0FBSyxDQUFDRCxFQUFFLEdBQUdBLEVBQUU7SUFDYkMsS0FBSyxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxZQUFZLENBQUM7O0lBRWpDO0lBQ0FOLElBQUksQ0FBQ08sT0FBTyxDQUFDLENBQUNDLEdBQUcsRUFBRUMsQ0FBQyxLQUFLO01BQ3JCRCxHQUFHLENBQUNELE9BQU8sQ0FBQyxDQUFDRyxJQUFJLEVBQUVDLENBQUMsS0FBSztRQUNyQixNQUFNakIsUUFBUSxHQUFHUyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDL0NWLFFBQVEsQ0FBQ1csU0FBUyxDQUFDQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ25DWixRQUFRLENBQUNXLFNBQVMsQ0FBQ0MsR0FBRyxDQUNsQkksSUFBSSxLQUFLNUIsNkNBQUssQ0FBQ0MsS0FBSyxHQUNkRyxvREFBWSxDQUFDSCxLQUFLLEdBQ2xCRyxvREFBWSxDQUFDQyxJQUN2QixDQUFDO1FBQ0RPLFFBQVEsQ0FBQ2tCLFlBQVksQ0FBQyxRQUFRLEVBQUVILENBQUMsQ0FBQztRQUNsQ2YsUUFBUSxDQUFDa0IsWUFBWSxDQUFDLFFBQVEsRUFBRUQsQ0FBQyxDQUFDO1FBQ2xDakIsUUFBUSxDQUFDa0IsWUFBWSxDQUFDLGdCQUFnQixFQUFFWCxFQUFFLENBQUM7UUFDM0NQLFFBQVEsQ0FBQ21CLFdBQVcsR0FBR0gsSUFBSTtRQUUzQlIsS0FBSyxDQUFDWSxXQUFXLENBQUNwQixRQUFRLENBQUM7TUFDL0IsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUZMLFlBQVksQ0FBQzBCLE9BQU8sQ0FBQ2IsS0FBSyxDQUFDO0VBQy9CO0VBRUEsU0FBU2MsbUJBQW1CQSxDQUFDaEIsSUFBSSxFQUFFQyxFQUFFLEVBQUU7SUFDbkMsTUFBTUMsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDNUNGLEtBQUssQ0FBQ0QsRUFBRSxHQUFHQSxFQUFFO0lBQ2JDLEtBQUssQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDOztJQUVqQztJQUNBTixJQUFJLENBQUNPLE9BQU8sQ0FBQyxDQUFDQyxHQUFHLEVBQUVDLENBQUMsS0FBSztNQUNyQkQsR0FBRyxDQUFDRCxPQUFPLENBQUMsQ0FBQ1UsQ0FBQyxFQUFFTixDQUFDLEtBQUs7UUFDbEIsTUFBTWpCLFFBQVEsR0FBR1MsUUFBUSxDQUFDQyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQy9DVixRQUFRLENBQUNXLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztRQUNuQ1osUUFBUSxDQUFDVyxTQUFTLENBQUNDLEdBQUcsQ0FBQ3BCLG9EQUFZLENBQUNILEtBQUssQ0FBQztRQUMxQ1csUUFBUSxDQUFDa0IsWUFBWSxDQUFDLFFBQVEsRUFBRUgsQ0FBQyxDQUFDO1FBQ2xDZixRQUFRLENBQUNrQixZQUFZLENBQUMsUUFBUSxFQUFFRCxDQUFDLENBQUM7UUFDbENqQixRQUFRLENBQUNrQixZQUFZLENBQUMsZ0JBQWdCLEVBQUVYLEVBQUUsQ0FBQztRQUUzQ0MsS0FBSyxDQUFDWSxXQUFXLENBQUNwQixRQUFRLENBQUM7TUFDL0IsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUZMLFlBQVksQ0FBQzBCLE9BQU8sQ0FBQ2IsS0FBSyxDQUFDO0VBQy9COztFQUVBO0VBQ0EsU0FBU0osc0JBQXNCQSxDQUFBLEVBQUc7SUFDOUI7SUFDQSxNQUFNb0IsV0FBVyxHQUFHMUIsV0FBVyxDQUFDMkIsU0FBUyxDQUFDLElBQUksQ0FBQztJQUMvQzlCLFlBQVksQ0FBQytCLFlBQVksQ0FBQ0YsV0FBVyxFQUFFMUIsV0FBVyxDQUFDOztJQUVuRDtJQUNBLElBQUlBLFdBQVcsS0FBS0YsWUFBWSxFQUFFO01BQzlCQSxZQUFZLEdBQUc0QixXQUFXO0lBQzlCLENBQUMsTUFBTTtNQUNIM0IsWUFBWSxHQUFHMkIsV0FBVztJQUM5QjtJQUNBMUIsV0FBVyxHQUFHMEIsV0FBVztJQUV6QjFCLFdBQVcsQ0FBQzZCLFVBQVUsQ0FBQ2QsT0FBTyxDQUFFRyxJQUFJLElBQUs7TUFDckNBLElBQUksQ0FBQ0wsU0FBUyxDQUFDaUIsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUN0QyxDQUFDLENBQUM7RUFDTjtFQUVBLE9BQU87SUFDSDtJQUNBQyxrQkFBa0JBLENBQUNDLFdBQVcsRUFBRUMsV0FBVyxFQUEyQjtNQUFBLElBQXpCQyxlQUFlLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxRQUFBRCxTQUFBLFFBQUFFLFNBQUEsR0FBQUYsU0FBQSxNQUFHLEtBQUs7TUFDaEV0QyxZQUFZLEdBQUdjLFFBQVEsQ0FBQzJCLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztNQUV2RC9CLGlCQUFpQixDQUFDeUIsV0FBVyxFQUFFNUMseURBQWlCLENBQUM7TUFDakQsSUFBSThDLGVBQWUsRUFBRTtRQUNqQlYsbUJBQW1CLENBQUNTLFdBQVcsRUFBRTVDLHlEQUFpQixDQUFDO01BQ3ZELENBQUMsTUFBTTtRQUNIa0IsaUJBQWlCLENBQUMwQixXQUFXLEVBQUU1Qyx5REFBaUIsQ0FBQztNQUNyRDtNQUVBUyxZQUFZLEdBQUdhLFFBQVEsQ0FBQzJCLGFBQWEsQ0FBRSxJQUFHbEQseURBQWtCLEVBQUMsQ0FBQztNQUM5RFcsWUFBWSxHQUFHWSxRQUFRLENBQUMyQixhQUFhLENBQUUsSUFBR2pELHlEQUFrQixFQUFDLENBQUM7TUFDOURXLFdBQVcsR0FBR0QsWUFBWTs7TUFFMUI7TUFDQUQsWUFBWSxDQUFDZSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxlQUFlLENBQUM7TUFDM0NmLFlBQVksQ0FBQ2MsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7SUFDakQsQ0FBQztJQUVEO0lBQ0F5QixVQUFVQSxDQUFBLEVBQUc7TUFDVDtNQUNBekMsWUFBWSxDQUFDZSxTQUFTLENBQUMyQixNQUFNLENBQUMsZUFBZSxDQUFDO01BQzlDMUMsWUFBWSxDQUFDZSxTQUFTLENBQUMyQixNQUFNLENBQUMsaUJBQWlCLENBQUM7O01BRWhEO01BQ0F6QyxZQUFZLENBQUNjLFNBQVMsQ0FBQzJCLE1BQU0sQ0FBQyxlQUFlLENBQUM7TUFDOUN6QyxZQUFZLENBQUNjLFNBQVMsQ0FBQzJCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztNQUVoRCxJQUFJLENBQUNDLGlCQUFpQixDQUFDLENBQUM7O01BRXhCO01BQ0E1QyxZQUFZLENBQUMwQixPQUFPLENBQUMxQixZQUFZLENBQUM2QyxTQUFTLENBQUM7SUFDaEQsQ0FBQztJQUVEO0lBQ0EsTUFBTUMsb0JBQW9CQSxDQUFBLEVBQUc7TUFDekIsT0FBTyxJQUFJQyxPQUFPLENBQUV6QyxPQUFPLElBQUs7UUFDNUIwQyxLQUFLLENBQUNDLElBQUksQ0FBQzlDLFdBQVcsQ0FBQzZCLFVBQVUsQ0FBQyxDQUFDZCxPQUFPLENBQUVHLElBQUksSUFBSztVQUNqRDtVQUNJO1VBQ0EsQ0FBQyxDQUFDeEIsb0RBQVksQ0FBQ0QsR0FBRyxFQUFFQyxvREFBWSxDQUFDRixJQUFJLENBQUMsQ0FBQ3VELElBQUksQ0FDdENDLFFBQVEsSUFBSzlCLElBQUksQ0FBQ0wsU0FBUyxDQUFDb0MsUUFBUSxDQUFDRCxRQUFRLENBQ2xELENBQUMsRUFDSDtZQUNFRSxPQUFPLENBQUNDLEdBQUcsQ0FBQ2pDLElBQUksQ0FBQztZQUNqQjtZQUNBQSxJQUFJLENBQUNrQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFDM0JuRCxlQUFlLENBQUNpQixJQUFJLEVBQUVmLE9BQU8sQ0FDakMsQ0FBQztZQUNEZSxJQUFJLENBQUNMLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQztVQUNuQztRQUNKLENBQUMsQ0FBQztNQUNOLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRHVDLGFBQWFBLENBQUFDLElBQUEsRUFBU0MsR0FBRyxFQUFFO01BQUEsSUFBYixDQUFDdEMsQ0FBQyxFQUFFRSxDQUFDLENBQUMsR0FBQW1DLElBQUE7TUFDaEIsTUFBTUUsWUFBWSxHQUFHN0MsUUFBUSxDQUFDMkIsYUFBYSxDQUN0QyxzQkFBcUJyQixDQUFFLGNBQWFFLENBQUUsc0JBQXFCbkIsV0FBVyxDQUFDUyxFQUFHLElBQy9FLENBQUM7TUFFRCtDLFlBQVksQ0FBQ25DLFdBQVcsR0FBR2tDLEdBQUcsR0FBR2pFLDZDQUFLLENBQUNHLEdBQUcsR0FBR0gsNkNBQUssQ0FBQ0MsS0FBSztNQUN4RGlFLFlBQVksQ0FBQzNDLFNBQVMsQ0FBQ2lCLE1BQU0sQ0FBQ3BDLG9EQUFZLENBQUNILEtBQUssQ0FBQztNQUNqRGlFLFlBQVksQ0FBQzNDLFNBQVMsQ0FBQ2lCLE1BQU0sQ0FBQyxXQUFXLENBQUM7TUFDMUMwQixZQUFZLENBQUMzQyxTQUFTLENBQUNDLEdBQUcsQ0FDdEJ5QyxHQUFHLEdBQUc3RCxvREFBWSxDQUFDRCxHQUFHLEdBQUdDLG9EQUFZLENBQUNGLElBQzFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7SUFDQWlELGlCQUFpQkEsQ0FBQSxFQUFHO01BQ2hCekMsV0FBVyxHQUNQQSxXQUFXLEtBQUtGLFlBQVksR0FBR0MsWUFBWSxHQUFHRCxZQUFZO0lBQ2xFO0VBQ0osQ0FBQztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzNLRCxNQUFNMkQsdUJBQXVCLEdBQUdBLENBQUEsS0FBTTtFQUNsQztFQUNBO0VBQ0E7RUFDQSxNQUFNQyxhQUFhLEdBQUcvQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7RUFDbkQ4QyxhQUFhLENBQUM3QyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztFQUM3QztFQUNBSCxRQUFRLENBQUMyQixhQUFhLENBQUMsTUFBTSxDQUFDLENBQUNmLE9BQU8sQ0FBQ21DLGFBQWEsQ0FBQztFQUVyRCxPQUFPO0lBQ0hDLGtCQUFrQkEsQ0FBQSxFQUFvQjtNQUFBLElBQW5CQyxVQUFVLEdBQUF6QixTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxJQUFJO01BQ2hDdUIsYUFBYSxDQUFDckMsV0FBVyxHQUFHdUMsVUFBVSxHQUNoQywyQkFBMkIsR0FDMUIsaUNBQWdDO0lBQzNDLENBQUM7SUFFREMsbUJBQW1CQSxDQUFDTixHQUFHLEVBQUU7TUFDckJHLGFBQWEsQ0FBQ3JDLFdBQVcsR0FBR2tDLEdBQUcsR0FBRyxXQUFXLEdBQUcsY0FBYztJQUNsRSxDQUFDO0lBRURPLGFBQWFBLENBQUNDLElBQUksRUFBRTtNQUNoQkwsYUFBYSxDQUFDckMsV0FBVyxHQUFJLGVBQWMwQyxJQUFLLEdBQUU7SUFDdEQ7RUFDSixDQUFDO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCdUM7QUFDa0I7QUFDWjtBQUNnQjtBQUU5RCxNQUFNRyxpQkFBaUIsR0FBR0EsQ0FBQSxLQUFNO0VBQzVCLFNBQVNDLGtCQUFrQkEsQ0FBQSxFQUFHO0lBQzFCQyxZQUFZLEdBQUdBLFlBQVksS0FBS0MsT0FBTyxHQUFHQyxPQUFPLEdBQUdELE9BQU87RUFDL0Q7RUFFQSxTQUFTNUIsaUJBQWlCQSxDQUFBLEVBQUc7SUFDekJ6QyxXQUFXLEdBQ1BBLFdBQVcsS0FBS0YsWUFBWSxHQUFHQyxZQUFZLEdBQUdELFlBQVk7RUFDbEU7RUFFQSxJQUFJeUUsWUFBWSxHQUFHLElBQUk7RUFDdkIsSUFBSUMsY0FBYyxHQUFHLElBQUk7RUFFekIsSUFBSUgsT0FBTyxHQUFHLElBQUk7RUFDbEIsSUFBSXZFLFlBQVksR0FBRyxJQUFJO0VBRXZCLElBQUl3RSxPQUFPLEdBQUcsSUFBSTtFQUNsQixJQUFJdkUsWUFBWSxHQUFHLElBQUk7RUFFdkIsSUFBSXFFLFlBQVksR0FBRyxJQUFJO0VBQ3ZCLElBQUlwRSxXQUFXLEdBQUcsSUFBSTtFQUV0QixPQUFPO0lBQ0h5RSxTQUFTQSxDQUFBLEVBQUc7TUFDUkYsWUFBWSxHQUFHM0UsdUVBQXFCLENBQUMsQ0FBQztNQUN0QzRFLGNBQWMsR0FBR2YsMkVBQXVCLENBQUMsQ0FBQztNQUUxQ1ksT0FBTyxHQUFHTCxxREFBWSxDQUFDLEtBQUssQ0FBQztNQUM3QmxFLFlBQVksR0FBR21FLDJEQUFlLENBQUMsQ0FBQztNQUVoQ0ssT0FBTyxHQUFHTixxREFBWSxDQUFDLElBQUksQ0FBQztNQUM1QmpFLFlBQVksR0FBR2tFLDJEQUFlLENBQUMsQ0FBQztNQUVoQ0csWUFBWSxHQUFHQyxPQUFPO01BQ3RCckUsV0FBVyxHQUFHRCxZQUFZOztNQUUxQjtNQUNBRCxZQUFZLENBQUM0RSxTQUFTLENBQUMsQ0FDbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1QsQ0FBQztNQUNGNUUsWUFBWSxDQUFDNEUsU0FBUyxDQUFDLENBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNULENBQUM7TUFDRjVFLFlBQVksQ0FBQzRFLFNBQVMsQ0FBQyxDQUNuQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDTixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDVCxDQUFDO01BQ0Y1RSxZQUFZLENBQUM0RSxTQUFTLENBQUMsQ0FDbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1QsQ0FBQztNQUNGNUUsWUFBWSxDQUFDNEUsU0FBUyxDQUFDLENBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNULENBQUM7O01BRUY7TUFDQTNFLFlBQVksQ0FBQzJFLFNBQVMsQ0FBQyxDQUNuQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDTixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDVCxDQUFDO01BQ0YzRSxZQUFZLENBQUMyRSxTQUFTLENBQUMsQ0FDbkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ04sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1QsQ0FBQztNQUNGM0UsWUFBWSxDQUFDMkUsU0FBUyxDQUFDLENBQ25CLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNOLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNULENBQUM7TUFDRjNFLFlBQVksQ0FBQzJFLFNBQVMsQ0FBQyxDQUNuQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDTixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDVCxD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LElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBa0Q7QUFDN0I7QUFFckIsTUFBTUMsV0FBVyxHQUFHMUQsK0RBQWlCLENBQUMsQ0FBQztBQUN2QzBELFdBQVcsQ0FBQ25ELFNBQVMsQ0FBQyxDQUFDO0FBQ3ZCbUQsV0FBVyxDQUFDL0MsUUFBUSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbUJvYXJkSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZG9tTWVzc2FnZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJPQVJEX1dJRFRIID0gMTA7XHJcbmNvbnN0IFBMQVlFUl8xX0JPQVJEX0lEID0gXCJwbGF5ZXIxQm9hcmRcIjtcclxuY29uc3QgUExBWUVSXzJfQk9BUkRfSUQgPSBcInBsYXllcjJCb2FyZFwiO1xyXG5cclxuY29uc3QgVElMRVMgPSB7XHJcbiAgICBXQVRFUjogXCJXXCIsXHJcbiAgICBNSVNTOiBcIk9cIixcclxuICAgIEhJVDogXCJYXCIsXHJcbn07XHJcblxyXG5jb25zdCBUSUxFX0NMQVNTRVMgPSB7XHJcbiAgICBXQVRFUjogXCJ3YXRlci1jZWxsXCIsXHJcbiAgICBNSVNTOiBcIm1pc3MtY2VsbFwiLFxyXG4gICAgSElUOiBcImhpdC1jZWxsXCIsXHJcbiAgICBTSElQOiBcInNoaXAtY2VsbFwiLFxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPQVJEX1dJRFRILFxyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlRE9NQm9hcmRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgbGV0IGJvYXJkRGlzcGxheSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIyQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IGFjdGl2ZUJvYXJkID0gbnVsbDtcclxuICAgIGNvbnN0IHNlbGVjdENlbGxFdmVudCA9IChncmlkQ2VsbCwgcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGF0dGFja0Nvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiksXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgWyR7YXR0YWNrQ29vcmRpbmF0ZXNbMF19LCAke2F0dGFja0Nvb3JkaW5hdGVzWzFdfV1gKTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShhdHRhY2tDb29yZGluYXRlcyk7XHJcblxyXG4gICAgICAgIGRlYWN0aXZhdGVDdXJyZW50Qm9hcmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgZ3JpZCB0byBzdG9yZSBpbmZvcm1hdGlvbiBhYm91dCBhIHBsYXllcidzIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVHcmlkRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcclxuICAgICAgICAgICAgICAgICAgICBjZWxsID09PSBUSUxFUy5XQVRFUlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFRJTEVfQ0xBU1NFUy5XQVRFUlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFRJTEVfQ0xBU1NFUy5TSElQLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCB4KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteVwiLCB5KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIsIGlkKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnRleHRDb250ZW50ID0gY2VsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChncmlkQ2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBib2FyZERpc3BsYXkucHJlcGVuZChib2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSGlkZGVuRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKF8sIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS14XCIsIHgpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIiwgaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJvYXJkRGlzcGxheS5wcmVwZW5kKGJvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYWJpbGl0eSB0byBhdHRhY2sgY2VsbHMgb24gb3Bwb25lbnQncyBib2FyZFxyXG4gICAgZnVuY3Rpb24gZGVhY3RpdmF0ZUN1cnJlbnRCb2FyZCgpIHtcclxuICAgICAgICAvLyBDbG9uZSB0aGUgcGFyZW50IG5vZGUgdG8gcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICBjb25zdCBjbG9uZWRCb2FyZCA9IGFjdGl2ZUJvYXJkLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICBib2FyZERpc3BsYXkucmVwbGFjZUNoaWxkKGNsb25lZEJvYXJkLCBhY3RpdmVCb2FyZCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSByZWZlcmVuY2VzXHJcbiAgICAgICAgaWYgKGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQpIHtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjdGl2ZUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcblxyXG4gICAgICAgIGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBDcmVhdGUgYW5kIHJlbmRlciBkaXNwbGF5IG9mIGJvdGggcGxheWVycyBib2FyZHNcclxuICAgICAgICByZW5kZXJJbml0aWFsQm9hcmQocGxheWVyMUdyaWQsIHBsYXllcjJHcmlkLCBoaWRlU2Vjb25kQm9hcmQgPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBib2FyZERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkLWRpc3BsYXlcIik7XHJcblxyXG4gICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIxR3JpZCwgUExBWUVSXzFfQk9BUkRfSUQpO1xyXG4gICAgICAgICAgICBpZiAoaGlkZVNlY29uZEJvYXJkKSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVIaWRkZW5EaXNwbGF5KHBsYXllcjJHcmlkLCBQTEFZRVJfMl9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIyR3JpZCwgUExBWUVSXzJfQk9BUkRfSUQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMV9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzJfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUG9zaXRpb24gcGxheWVyIDEncyBib2FyZCBmYWNpbmcgc2NyZWVuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNsYXNzTGlzdC5hZGQoXCJ1bmZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gRmxpcCB0aGUgcmVuZGVyZWQgYm9hcmQgZGlzcGxheVxyXG4gICAgICAgIGZsaXBCb2FyZHMoKSB7XHJcbiAgICAgICAgICAgIC8vIEZsaXAgcGxheWVyIDEgYm9hcmQgY2VsbHNcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZsaXAgcGxheWVyIDIgYm9hcmQgY2VsbHNcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN3aXRjaCBib2FyZCBwb3NpdGlvbnNcclxuICAgICAgICAgICAgYm9hcmREaXNwbGF5LnByZXBlbmQoYm9hcmREaXNwbGF5Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBhbGwgYXR0YWNrYWJsZSBjZWxscyBvbiBvcHBvbmVudCdzIGJvYXJkIHNlbGVjdGFibGUgZm9yIGF0dGFja3NcclxuICAgICAgICBhc3luYyBhY3RpdmF0ZUN1cnJlbnRCb2FyZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbGUgaGFzbid0IGFscmVhZHkgYmVlbiBhdHRhY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhW1RJTEVfQ0xBU1NFUy5ISVQsIFRJTEVfQ0xBU1NFUy5NSVNTXS5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRpbGVUeXBlKSA9PiBjZWxsLmNsYXNzTGlzdC5jb250YWlucyh0aWxlVHlwZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2VsbEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldLCBoaXQpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0YWNrZWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXVtkYXRhLXBsYXllci1pZD1cIiR7YWN0aXZlQm9hcmQuaWR9XCJdYCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC50ZXh0Q29udGVudCA9IGhpdCA/IFRJTEVTLkhJVCA6IFRJTEVTLldBVEVSO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgYXR0YWNrZWRDZWxsLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgICAgICAgICBoaXQgPyBUSUxFX0NMQVNTRVMuSElUIDogVElMRV9DTEFTU0VTLk1JU1MsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIHdoaWNoIGJvYXJkIGlzIGFjdGl2ZVxyXG4gICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCkge1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NQm9hcmRIYW5kbGVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgLy8gQ3JlYXRlIG1lc3NhZ2UgYmFubmVyXHJcbiAgICAvLyBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAvLyBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XHJcbiAgICBjb25zdCBtZXNzYWdlQmFubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lc3NhZ2VCYW5uZXIuY2xhc3NMaXN0LmFkZChcIm1lc3NhZ2UtYmFubmVyXCIpO1xyXG4gICAgLy8gbW9kYWwuYXBwZW5kQ2hpbGQobWVzc2FnZUJhbm5lcik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5wcmVwZW5kKG1lc3NhZ2VCYW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGlzcGxheUN1cnJlbnRUdXJuKHBsYXllclR1cm4gPSB0cnVlKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBwbGF5ZXJUdXJuXHJcbiAgICAgICAgICAgICAgICA/IFwiWW91ciB0dXJuISBNYWtlIGFuIGF0dGFja1wiXHJcbiAgICAgICAgICAgICAgICA6IGBPcHBvbmVudCBUdXJuISBNYWtpbmcgYW4gYXR0YWNrYDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5QXR0YWNrUmVzdWx0KGhpdCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gaGl0ID8gXCJTaGlwIGhpdCFcIiA6IFwiU2hvdCBtaXNzZWQhXCI7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheVdpbm5lcihuYW1lKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBgVmljdG9yeSBmb3IgJHtuYW1lfSFgO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgfTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTUJvYXJkSGFuZGxlciB9IGZyb20gXCIuL2RvbUJvYXJkSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcclxuaW1wb3J0IHsgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgfSBmcm9tIFwiLi9kb21NZXNzYWdlSGFuZGxlclwiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgYWN0aXZlUGxheWVyID0gYWN0aXZlUGxheWVyID09PSBwbGF5ZXIxID8gcGxheWVyMiA6IHBsYXllcjE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPVxyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBib2FyZEhhbmRsZXIgPSBudWxsO1xyXG4gICAgbGV0IG1lc3NhZ2VIYW5kbGVyID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMiA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgYWN0aXZlUGxheWVyID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlciA9IGNyZWF0ZURPTUJvYXJkSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBtZXNzYWdlSGFuZGxlciA9IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKGZhbHNlKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIyID0gY3JlYXRlUGxheWVyKHRydWUpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9IHBsYXllcjE7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcHMgcGxheWVyIDFcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbMywgM10sXHJcbiAgICAgICAgICAgICAgICBbNywgM10sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCA0XSxcclxuICAgICAgICAgICAgICAgIFs2LCA0XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzMsIDVdLFxyXG4gICAgICAgICAgICAgICAgWzUsIDVdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbMywgNl0sXHJcbiAgICAgICAgICAgICAgICBbNSwgNl0sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCA3XSxcclxuICAgICAgICAgICAgICAgIFs0LCA3XSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMlxyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA5XSxcclxuICAgICAgICAgICAgICAgIFs1LCA5XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDhdLFxyXG4gICAgICAgICAgICAgICAgWzYsIDhdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgN10sXHJcbiAgICAgICAgICAgICAgICBbNywgN10sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA2XSxcclxuICAgICAgICAgICAgICAgIFs3LCA2XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDVdLFxyXG4gICAgICAgICAgICAgICAgWzgsIDVdLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZW5kZXJJbml0aWFsQm9hcmQoXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgICAgIHBsYXllcjIuaXNDb21wdXRlcixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWluIGdhbWUgbG9vcFxyXG4gICAgICAgIGFzeW5jIHBsYXlHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZ2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHR1cm5cIik7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5Q3VycmVudFR1cm4oIWFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWxpZEF0dGFjayA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICghdmFsaWRBdHRhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0YWNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGl0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGNvbXB1dGVyIHBsYXllciBtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhdXNlIHRvIHNpbXVsYXRlIGNvbXB1dGVyIHRoaW5raW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBjb21wdXRlciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGFjdGl2ZVBsYXllci5wcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBodW1hbiBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgaHVtYW4gcGxheWVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYXdhaXQgYm9hcmRIYW5kbGVyLmFjdGl2YXRlQ3VycmVudEJvYXJkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdGhhdCBhdHRhY2sgb24gb3Bwb25lbnQgYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXQgPSBhY3RpdmVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZWNlaXZlQXR0YWNrKGF0dGFjaywgaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRBdHRhY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5QXR0YWNrUmVzdWx0KGhpdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGF0dGFjayBpcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCByZWdpc3RlciBpdCBhbmQgdGhlbiBhd2FpdCBpbnB1dCBmcm9tIG90aGVyIHBsYXllclxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUJvYXJkLmlzRmxlZXRTdW5rKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIG92ZXJcclxuICAgICAgICAgICAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheVdpbm5lcihcIlBsYXllciAxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggcGxheWVyIHR1cm5zXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVQbGF5ZXIoKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIC8vIGJvYXJkSGFuZGxlci5mbGlwQm9hcmRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRILCBUSUxFUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZWJvYXJkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgTUFYX1NISVBTID0gNTtcclxuXHJcbiAgICBjb25zdCBhbGxvd2VkTGVuZ3RocyA9IFtcclxuICAgICAgICB7IG51bWJlcjogMiwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDMsIHJlbWFpbmluZzogMiB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA0LCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogNSwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0pLmZpbGwoVElMRVMuV0FURVIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHBhaXIgb2YgY29vcmRpbmF0ZXMgaXMgdmFsaWQgZm9yIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkQ29vcmRzKHN0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5KSB7XHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgb2ZmIHRoZSBib2FyZFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgW3N0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5XS5zb21lKFxyXG4gICAgICAgICAgICAgICAgKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgZGlhZ29uYWxseVxyXG4gICAgICAgIGlmIChzdGFydHggIT09IGVuZHggJiYgc3RhcnR5ICE9PSBlbmR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBzaGlwcyBhbHJlYWR5IGluIHRoZSBncmlkXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0eDsgeCA8PSBlbmR4OyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0eTsgeSA8PSBlbmR5OyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYWxyZWFkeSBwbGFjZWQgdGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChncmlkW3hdW3ldICE9PSBUSUxFUy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBQbGFjZSBhIHNoaXAgb24gdGhlIGdhbWUgYm9hcmQgYmFzZWQgb24gc3RhcnQgYW5kIGVuZCBjb29yZGluYXRlc1xyXG4gICAgICAgIHBsYWNlU2hpcChbW3N0YXJ0eCwgc3RhcnR5XSwgW2VuZHgsIGVuZHldXSkge1xyXG4gICAgICAgICAgICAvLyBNYXggc2hpcHMgYWxyZWFkeSBwbGFjZWRcclxuICAgICAgICAgICAgaWYgKHBsYWNlZFNoaXBzLmxlbmd0aCA+PSBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgY2FwYWNpdHkgcmVhY2hlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSW52YWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWRDb29yZHMoc3RhcnR4LCBzdGFydHksIGVuZHgsIGVuZHkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID1cclxuICAgICAgICAgICAgICAgIDEgKyBNYXRoLm1heChNYXRoLmFicyhzdGFydHggLSBlbmR4KSwgTWF0aC5hYnMoc3RhcnR5IC0gZW5keSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgc2hpcCBsZW5ndGggdmFsaWRpdHlcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYWxsb3dlZExlbmd0aHMuZmluZCgob2JqKSA9PiBvYmoubnVtYmVyID09PSBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmoucmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IGNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBzaGlwIHJlZmVyZW5jZXMgdG8gdGhlIGdyaWRcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttaW5YLCBtYXhYXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGFydHgsIGVuZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0eCwgZW5keCksXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW21pblksIG1heFldID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0eSwgZW5keSksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoc3RhcnR5LCBlbmR5KSxcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBwbGFjZWRTaGlwcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvYmoucmVtYWluaW5nIC09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xyXG4gICAgICAgICAgICBpZiAoW3gsIHldLnNvbWUoKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBncmlkW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgLy8gRHVwbGljYXRlIGF0dGFja1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSBUSUxFUy5NSVNTIHx8IHNxdWFyZSA9PT0gVElMRVMuSElUKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbHJlYWR5IGF0dGFja2VkIHRoaXMgc3F1YXJlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNaXNzXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuTUlTUztcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhpdFxyXG4gICAgICAgICAgICBwbGFjZWRTaGlwc1tzcXVhcmVdLmhpdCgpO1xyXG4gICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuSElUO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXNGbGVldFN1bmsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWRTaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R3JpZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdyaWQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfTtcclxuIiwiaW1wb3J0IHsgQk9BUkRfV0lEVEggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZVBsYXllciA9IChpc0NvbXB1dGVyKSA9PiB7XHJcbiAgICAvLyBGaWxsIGFuIGFycmF5IHdpdGggYWxsIHBvc3NpYmxlIGF0dGFja3Mgb24gdGhlIGJvYXJkXHJcbiAgICBjb25zdCBwb3NzaWJsZUF0dGFja3MgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEJPQVJEX1dJRFRIOyB4ICs9IDEpIHtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1dJRFRIOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgcG9zc2libGVBdHRhY2tzLnB1c2goW3gsIHldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0NvbXB1dGVyLFxyXG5cclxuICAgICAgICBwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByYW5kb20gYXR0YWNrXHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja051bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhdHRhY2sgZnJvbSBhbGwgcG9zc2libGUgYXR0YWNrcyBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFjayA9IHBvc3NpYmxlQXR0YWNrcy5zcGxpY2UoYXR0YWNrTnVtYmVyLCAxKVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2s7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVQbGF5ZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlU2hpcCA9IChzaGlwTGVuZ3RoKSA9PiB7XHJcbiAgICAvLyBFcnJvciBjaGVja2luZ1xyXG4gICAgaWYgKHR5cGVvZiBzaGlwTGVuZ3RoICE9PSBcIm51bWJlclwiIHx8IGlzTmFOKHNoaXBMZW5ndGgpIHx8IHNoaXBMZW5ndGggPCAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xyXG4gICAgbGV0IGhpdHMgPSAwO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIHNoaXAgaGFzIG1vcmUgaGl0cyB0aGFuIGxpdmVzXHJcbiAgICAgICAgaXNTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGl0cyA+PSBsZW5ndGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGRhbWFnYWUgdG8gdGhlIHNoaXAgYW5kIGNoZWNrIGZvciBzaW5raW5nXHJcbiAgICAgICAgaGl0KCkge1xyXG4gICAgICAgICAgICBoaXRzICs9IDE7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVTaGlwIH07XHJcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XHJcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcclxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XHJcbiAgICAtLWdyaWQtY2VsbC1zaXplOiAycmVtO1xyXG5cclxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEdlbmVyYWwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbioge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZ2FwOiAycmVtO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xyXG5cclxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG4gICAgaGVpZ2h0OiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG5cclxuICAgIHBhZGRpbmc6IDJweDtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uZm9jdXNlZC1ib2FyZCB7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi51bmZvY3VzZWQtYm9hcmQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XHJcbn1cclxuXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XHJcbn1cclxuXHJcbi5jbGlja2FibGUge1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbi5jbGlja2FibGU6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDAsIDE4MywgMjU1KTtcclxufVxyXG5cclxuLndhdGVyLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcclxufVxyXG5cclxuLnNoaXAtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG59XHJcblxyXG4ubWlzcy1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcbn1cclxuXHJcbi5oaXQtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbn1cclxuXHJcbi8qIC5tb2RhbCB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgei1pbmRleDogMjtcclxuXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xyXG5cclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG5cclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG59ICovXHJcblxyXG4ubWVzc2FnZS1iYW5uZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICAgIHBhZGRpbmc6IDEuNXJlbSAwO1xyXG5cclxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLHNCQUFzQjs7SUFFdEIsOEJBQThCO0FBQ2xDOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLHNCQUFzQjtJQUN0QixTQUFTO0lBQ1QsVUFBVTtBQUNkOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7O0lBRVQseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHlCQUF5Qjs7SUFFekIsOEdBQThHO0lBQzlHLCtHQUErRzs7SUFFL0csWUFBWTs7SUFFWix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxlQUFlO0FBQ25COztBQUVBO0lBQ0ksMkJBQTJCO0lBQzNCLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2Qiw0QkFBNEI7SUFDNUIsNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjtBQUNBO0lBQ0ksa0NBQWtDO0FBQ3RDOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kscUJBQXFCO0FBQ3pCOztBQUVBOzs7Ozs7Ozs7Ozs7O0dBYUc7O0FBRUg7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsV0FBVztJQUNYLFdBQVc7O0lBRVgscUJBQXFCO0lBQ3JCLGlCQUFpQjs7SUFFakIsb0JBQW9CO0lBQ3BCLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osMENBQTBDO0FBQzlDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXHJcXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XFxyXFxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XFxyXFxuICAgIC0tZ3JpZC1jZWxsLXNpemU6IDJyZW07XFxyXFxuXFxyXFxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcXHJcXG59XFxyXFxuXFxyXFxuLypcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKiBHZW5lcmFsIFN0eWxpbmdcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKi9cXHJcXG4qIHtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG5ib2R5IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5ib2FyZC1kaXNwbGF5IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGdhcDogMnJlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWUtYm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xcclxcblxcclxcbiAgICB3aWR0aDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG4gICAgaGVpZ2h0OiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcblxcclxcbiAgICBwYWRkaW5nOiAycHg7XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcclxcbn1cXHJcXG5cXHJcXG4udW5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQtY2VsbCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xcclxcbiAgICBoZWlnaHQ6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcXHJcXG59XFxyXFxuXFxyXFxuLmNsaWNrYWJsZSB7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuLmNsaWNrYWJsZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAxODMsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbi53YXRlci1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAtY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XFxyXFxufVxcclxcblxcclxcbi5taXNzLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0LWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi8qIC5tb2RhbCB7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICB6LWluZGV4OiAyO1xcclxcblxcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogc3RhcnQ7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuXFxyXFxuICAgIG92ZXJmbG93OiBhdXRvO1xcclxcbn0gKi9cXHJcXG5cXHJcXG4ubWVzc2FnZS1iYW5uZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcblxcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XFxyXFxuICAgIHBhZGRpbmc6IDEuNXJlbSAwO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IHh4eC1sYXJnZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFubmVyLWJhY2tncm91bmQpO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xyXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xyXG5cclxuY29uc3QgYmF0dGxlU2hpcHMgPSBjcmVhdGVHYW1lSGFuZGxlcigpO1xyXG5iYXR0bGVTaGlwcy5zZXR1cEdhbWUoKTtcclxuYmF0dGxlU2hpcHMucGxheUdhbWUoKTtcclxuIl0sIm5hbWVzIjpbIkJPQVJEX1dJRFRIIiwiUExBWUVSXzFfQk9BUkRfSUQiLCJQTEFZRVJfMl9CT0FSRF9JRCIsIlRJTEVTIiwiV0FURVIiLCJNSVNTIiwiSElUIiwiVElMRV9DTEFTU0VTIiwiU0hJUCIsImNyZWF0ZURPTUJvYXJkSGFuZGxlciIsImJvYXJkRGlzcGxheSIsInBsYXllcjFCb2FyZCIsInBsYXllcjJCb2FyZCIsImFjdGl2ZUJvYXJkIiwic2VsZWN0Q2VsbEV2ZW50IiwiZ3JpZENlbGwiLCJyZXNvbHZlIiwiYXR0YWNrQ29vcmRpbmF0ZXMiLCJnZXRBdHRyaWJ1dGUiLCJkZWFjdGl2YXRlQ3VycmVudEJvYXJkIiwiY3JlYXRlR3JpZERpc3BsYXkiLCJncmlkIiwiaWQiLCJib2FyZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImZvckVhY2giLCJyb3ciLCJ4IiwiY2VsbCIsInkiLCJzZXRBdHRyaWJ1dGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicHJlcGVuZCIsImNyZWF0ZUhpZGRlbkRpc3BsYXkiLCJfIiwiY2xvbmVkQm9hcmQiLCJjbG9uZU5vZGUiLCJyZXBsYWNlQ2hpbGQiLCJjaGlsZE5vZGVzIiwicmVtb3ZlIiwicmVuZGVySW5pdGlhbEJvYXJkIiwicGxheWVyMUdyaWQiLCJwbGF5ZXIyR3JpZCIsImhpZGVTZWNvbmRCb2FyZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsInF1ZXJ5U2VsZWN0b3IiLCJmbGlwQm9hcmRzIiwidG9nZ2xlIiwic3dpdGNoQWN0aXZlQm9hcmQiLCJsYXN0Q2hpbGQiLCJhY3RpdmF0ZUN1cnJlbnRCb2FyZCIsIlByb21pc2UiLCJBcnJheSIsImZyb20iLCJzb21lIiwidGlsZVR5cGUiLCJjb250YWlucyIsImNvbnNvbGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVjZWl2ZUF0dGFjayIsIl9yZWYiLCJoaXQiLCJhdHRhY2tlZENlbGwiLCJjcmVhdGVET01NZXNzYWdlSGFuZGxlciIsIm1lc3NhZ2VCYW5uZXIiLCJkaXNwbGF5Q3VycmVudFR1cm4iLCJwbGF5ZXJUdXJuIiwiZGlzcGxheUF0dGFja1Jlc3VsdCIsImRpc3BsYXlXaW5uZXIiLCJuYW1lIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJzd2l0Y2hBY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImJvYXJkSGFuZGxlciIsIm1lc3NhZ2VIYW5kbGVyIiwic2V0dXBHYW1lIiwicGxhY2VTaGlwIiwiZ2V0R3JpZCIsImlzQ29tcHV0ZXIiLCJwbGF5R2FtZSIsImdhbWVPdmVyIiwidmFsaWRBdHRhY2siLCJhdHRhY2siLCJzZXRUaW1lb3V0IiwicHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzIiwiaXNGbGVldFN1bmsiLCJjcmVhdGVTaGlwIiwiTUFYX1NISVBTIiwiYWxsb3dlZExlbmd0aHMiLCJudW1iZXIiLCJyZW1haW5pbmciLCJmaWxsIiwicGxhY2VkU2hpcHMiLCJpc1ZhbGlkQ29vcmRzIiwic3RhcnR4Iiwic3RhcnR5IiwiZW5keCIsImVuZHkiLCJjb29yZCIsIkVycm9yIiwic2hpcExlbmd0aCIsIk1hdGgiLCJtYXgiLCJhYnMiLCJvYmoiLCJmaW5kIiwibmV3U2hpcCIsInB1c2giLCJtaW5YIiwibWF4WCIsIm1pbiIsIm1pblkiLCJtYXhZIiwiZXJyb3IiLCJfcmVmMiIsInNxdWFyZSIsImV2ZXJ5Iiwic2hpcCIsImlzU3VuayIsInBvc3NpYmxlQXR0YWNrcyIsImF0dGFja051bWJlciIsImZsb29yIiwicmFuZG9tIiwic3BsaWNlIiwiaXNOYU4iLCJoaXRzIiwiYmF0dGxlU2hpcHMiXSwic291cmNlUm9vdCI6IiJ9