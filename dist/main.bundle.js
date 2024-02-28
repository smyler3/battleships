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
/* harmony export */   TILES: () => (/* binding */ TILES)
/* harmony export */ });
const BOARD_WIDTH = 10;
const PLAYER_1_BOARD_ID = "player1Board";
const PLAYER_2_BOARD_ID = "player2Board";
const TILES = {
  WATER: "W",
  MISS: "M",
  HIT: "H"
};


/***/ }),

/***/ "./src/domHandler.js":
/*!***************************!*\
  !*** ./src/domHandler.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDOMHandler: () => (/* binding */ createDOMHandler)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");

const createDOMHandler = () => {
  let boardDisplay = null;
  let player1Board = null;
  let player2Board = null;
  let activeBoard = null;
  const selectCellEvent = (gridCell, resolve) => {
    const attackCoordinates = [gridCell.getAttribute("data-x"), gridCell.getAttribute("data-y")];
    console.log(`[${attackCoordinates[0]}, ${attackCoordinates[1]}]`);
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
        gridCell.classList.add(cell === _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.WATER ? "water-cell" : "ship-cell");
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
      row.forEach((cell, y) => {
        const gridCell = document.createElement("span");
        gridCell.classList.add("grid-cell");
        gridCell.classList.add("water-cell");
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
          ![_constants__WEBPACK_IMPORTED_MODULE_0__.TILES.HIT, _constants__WEBPACK_IMPORTED_MODULE_0__.TILES.MISS].some(tileType => tileType === cell.textContent)) {
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
      attackedCell.textContent = hit ? "X" : "O";
      attackedCell.classList.add(hit ? "hit-cell" : "miss-cell");
    },
    // Change which board is active
    switchActiveBoard() {
      activeBoard = activeBoard === player1Board ? player2Board : player1Board;
    },
    displayWinner(name) {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      const messageBanner = document.createElement("div");
      messageBanner.classList.add("message-banner");
      messageBanner.textContent = `Victory for ${name}!`;
      modal.appendChild(messageBanner);
      console.log("1");
      console.log(document.querySelector("body"));
      document.querySelector("body").prepend(modal);
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
/* harmony import */ var _domHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domHandler */ "./src/domHandler.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");



const createGameHandler = () => {
  function switchActivePlayer() {
    activePlayer = activePlayer === player1 ? player2 : player1;
  }
  function switchActiveBoard() {
    activeBoard = activeBoard === player1Board ? player2Board : player1Board;
  }
  let domHandler = null;
  let player1 = null;
  let player1Board = null;
  let player2 = null;
  let player2Board = null;
  let activePlayer = null;
  let activeBoard = null;
  return {
    setupGame() {
      domHandler = (0,_domHandler__WEBPACK_IMPORTED_MODULE_1__.createDOMHandler)();
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
      domHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid(), player2.isComputer);
    },
    // Main game loop
    async playGame() {
      let gameOver = false;
      while (!gameOver) {
        console.log("New turn");
        let validAttack = false;
        while (!validAttack) {
          let attack = null;
          let hit = null;

          // Get computer player move
          if (activePlayer.isComputer) {
            // Pause to simulate computer thinking
            await new Promise(resolve => setTimeout(resolve, 10));

            // Ask computer for attack
            attack = activePlayer.provideAttackCoordinates();
          }

          // Get human player move
          else {
            // Ask human player for attack
            attack = await domHandler.activateCurrentBoard();
          }

          // Try that attack on opponent board
          try {
            hit = activeBoard.receiveAttack(attack);
            domHandler.receiveAttack(attack, hit);
            validAttack = true;
          } catch {
            // If attack is invalid, ask again
          }
        }

        // Otherwise, register it and then await input from other player
        if (activeBoard.isFleetSunk()) {
          // Game over
          gameOver = true;
          domHandler.displayWinner("Player 1");
          break;
        }

        // Switch player turns
        switchActivePlayer();
        switchActiveBoard();
        domHandler.switchActiveBoard();
        // domHandler.flipBoards();
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
    align-items: center;
    justify-content: center;

    padding-top: 11vh;
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

    background-color: #ffffff;
}

.clickable {
    cursor: pointer;
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

.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    align-items: start;

    width: 100%;
    height: 100%;

    overflow: auto;
}

.message-banner {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 10%;
    width: 100%;

    font-size: xxx-large;
    font-weight: bold;
    color: white;
    background-color: var(--banner-background);
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;AAClC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,iBAAiB;AACrB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,2BAA2B;IAC3B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;;IAE7B,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,eAAe;IACf,MAAM;IACN,OAAO;IACP,UAAU;;IAEV,aAAa;IACb,kBAAkB;;IAElB,WAAW;IACX,YAAY;;IAEZ,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 2rem;\r\n\r\n    --banner-background: #00000099;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    padding-top: 11vh;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.focused-board {\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.unfocused-board {\r\n    flex-direction: row-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n\r\n    background-color: #ffffff;\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n}\r\n\r\n.water-cell {\r\n    background-color: aqua;\r\n}\r\n\r\n.ship-cell {\r\n    background-color: grey;\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n.modal {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 2;\r\n\r\n    display: flex;\r\n    align-items: start;\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n    overflow: auto;\r\n}\r\n\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sZ0ZBQWdGLFlBQVksYUFBYSxjQUFjLGFBQWEsT0FBTyxRQUFRLEtBQUssS0FBSyxZQUFZLFdBQVcsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLGNBQWMsYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxZQUFZLFlBQVksT0FBTyxLQUFLLFVBQVUsYUFBYSxhQUFhLGNBQWMsWUFBWSxZQUFZLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxjQUFjLGFBQWEsY0FBYyxhQUFhLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZ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QSx5REFBeUQ7QUFDekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7O0FDQWtEO0FBQzdCO0FBRXJCLE1BQU1DLFdBQVcsR0FBR3pELCtEQUFpQixDQUFDLENBQUM7QUFDdkN5RCxXQUFXLENBQUNuRCxTQUFTLENBQUMsQ0FBQztBQUN2Qm1ELFdBQVcsQ0FBQy9DLFFBQVEsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9kb21IYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCT0FSRF9XSURUSCA9IDEwO1xyXG5jb25zdCBQTEFZRVJfMV9CT0FSRF9JRCA9IFwicGxheWVyMUJvYXJkXCI7XHJcbmNvbnN0IFBMQVlFUl8yX0JPQVJEX0lEID0gXCJwbGF5ZXIyQm9hcmRcIjtcclxuXHJcbmNvbnN0IFRJTEVTID0ge1xyXG4gICAgV0FURVI6IFwiV1wiLFxyXG4gICAgTUlTUzogXCJNXCIsXHJcbiAgICBISVQ6IFwiSFwiLFxyXG59O1xyXG5cclxuZXhwb3J0IHsgQk9BUkRfV0lEVEgsIFBMQVlFUl8xX0JPQVJEX0lELCBQTEFZRVJfMl9CT0FSRF9JRCwgVElMRVMgfTtcclxuIiwiaW1wb3J0IHsgUExBWUVSXzFfQk9BUkRfSUQsIFBMQVlFUl8yX0JPQVJEX0lELCBUSUxFUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlRE9NSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGxldCBib2FyZERpc3BsYXkgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjFCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0Q2VsbEV2ZW50ID0gKGdyaWRDZWxsLCByZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXR0YWNrQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSxcclxuICAgICAgICAgICAgZ3JpZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbJHthdHRhY2tDb29yZGluYXRlc1swXX0sICR7YXR0YWNrQ29vcmRpbmF0ZXNbMV19XWApO1xyXG5cclxuICAgICAgICByZXNvbHZlKGF0dGFja0Nvb3JkaW5hdGVzKTtcclxuXHJcbiAgICAgICAgZGVhY3RpdmF0ZUN1cnJlbnRCb2FyZCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBncmlkIHRvIHN0b3JlIGluZm9ybWF0aW9uIGFib3V0IGEgcGxheWVyJ3MgYm9hcmRcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUdyaWREaXNwbGF5KGdyaWQsIGlkKSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBib2FyZC5pZCA9IGlkO1xyXG4gICAgICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgZ3JpZCBjZWxscyB3aXRoIGNlbGwgaW5mb3JtYXRpb24gc3RvcmVkIGFuZCBkaXNwbGF5ZWRcclxuICAgICAgICBncmlkLmZvckVhY2goKHJvdywgeCkgPT4ge1xyXG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNlbGxcIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwgPT09IFRJTEVTLldBVEVSID8gXCJ3YXRlci1jZWxsXCIgOiBcInNoaXAtY2VsbFwiLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCB4KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteVwiLCB5KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIsIGlkKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnRleHRDb250ZW50ID0gY2VsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChncmlkQ2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBib2FyZERpc3BsYXkucHJlcGVuZChib2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlSGlkZGVuRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcIndhdGVyLWNlbGxcIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiwgeCk7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiwgeSk7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiLCBpZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoZ3JpZENlbGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYm9hcmREaXNwbGF5LnByZXBlbmQoYm9hcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhYmlsaXR5IHRvIGF0dGFjayBjZWxscyBvbiBvcHBvbmVudCdzIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBkZWFjdGl2YXRlQ3VycmVudEJvYXJkKCkge1xyXG4gICAgICAgIC8vIENsb25lIHRoZSBwYXJlbnQgbm9kZSB0byByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgIGNvbnN0IGNsb25lZEJvYXJkID0gYWN0aXZlQm9hcmQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIGJvYXJkRGlzcGxheS5yZXBsYWNlQ2hpbGQoY2xvbmVkQm9hcmQsIGFjdGl2ZUJvYXJkKTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHJlZmVyZW5jZXNcclxuICAgICAgICBpZiAoYWN0aXZlQm9hcmQgPT09IHBsYXllcjFCb2FyZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuXHJcbiAgICAgICAgYWN0aXZlQm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgcmVuZGVyIGRpc3BsYXkgb2YgYm90aCBwbGF5ZXJzIGJvYXJkc1xyXG4gICAgICAgIHJlbmRlckluaXRpYWxCb2FyZChwbGF5ZXIxR3JpZCwgcGxheWVyMkdyaWQsIGhpZGVTZWNvbmRCb2FyZCA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtZGlzcGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjFHcmlkLCBQTEFZRVJfMV9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIGlmIChoaWRlU2Vjb25kQm9hcmQpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUhpZGRlbkRpc3BsYXkocGxheWVyMkdyaWQsIFBMQVlFUl8yX0JPQVJEX0lEKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjJHcmlkLCBQTEFZRVJfMl9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke1BMQVlFUl8xX0JPQVJEX0lEfWApO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMl9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPSBwbGF5ZXIyQm9hcmQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQb3NpdGlvbiBwbGF5ZXIgMSdzIGJvYXJkIGZhY2luZyBzY3JlZW5cclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LmFkZChcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBGbGlwIHRoZSByZW5kZXJlZCBib2FyZCBkaXNwbGF5XHJcbiAgICAgICAgZmxpcEJvYXJkcygpIHtcclxuICAgICAgICAgICAgLy8gRmxpcCBwbGF5ZXIgMSBib2FyZCBjZWxsc1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmxpcCBwbGF5ZXIgMiBib2FyZCBjZWxsc1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3dpdGNoIGJvYXJkIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICBib2FyZERpc3BsYXkucHJlcGVuZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBhdHRhY2thYmxlIGNlbGxzIG9uIG9wcG9uZW50J3MgYm9hcmQgc2VsZWN0YWJsZSBmb3IgYXR0YWNrc1xyXG4gICAgICAgIGFzeW5jIGFjdGl2YXRlQ3VycmVudEJvYXJkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGlsZSBoYXNuJ3QgYWxyZWFkeSBiZWVuIGF0dGFja2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFbVElMRVMuSElULCBUSUxFUy5NSVNTXS5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRpbGVUeXBlKSA9PiB0aWxlVHlwZSA9PT0gY2VsbC50ZXh0Q29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSwgaGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1bZGF0YS1wbGF5ZXItaWQ9XCIke2FjdGl2ZUJvYXJkLmlkfVwiXWAsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwudGV4dENvbnRlbnQgPSBoaXQgPyBcIlhcIiA6IFwiT1wiO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LmFkZChoaXQgPyBcImhpdC1jZWxsXCIgOiBcIm1pc3MtY2VsbFwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDaGFuZ2Ugd2hpY2ggYm9hcmQgaXMgYWN0aXZlXHJcbiAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID1cclxuICAgICAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheVdpbm5lcihuYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZUJhbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIuY2xhc3NMaXN0LmFkZChcIm1lc3NhZ2UtYmFubmVyXCIpO1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gYFZpY3RvcnkgZm9yICR7bmFtZX0hYDtcclxuXHJcbiAgICAgICAgICAgIG1vZGFsLmFwcGVuZENoaWxkKG1lc3NhZ2VCYW5uZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIxXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKSk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5wcmVwZW5kKG1vZGFsKTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZURPTUhhbmRsZXIgfTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTUhhbmRsZXIgfSBmcm9tIFwiLi9kb21IYW5kbGVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgYWN0aXZlUGxheWVyID0gYWN0aXZlUGxheWVyID09PSBwbGF5ZXIxID8gcGxheWVyMiA6IHBsYXllcjE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPVxyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkb21IYW5kbGVyID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMiA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgYWN0aXZlUGxheWVyID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgICAgIGRvbUhhbmRsZXIgPSBjcmVhdGVET01IYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKGZhbHNlKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIyID0gY3JlYXRlUGxheWVyKHRydWUpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9IHBsYXllcjE7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcHMgcGxheWVyIDFcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbMywgM10sXHJcbiAgICAgICAgICAgICAgICBbNywgM10sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCA0XSxcclxuICAgICAgICAgICAgICAgIFs2LCA0XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzMsIDVdLFxyXG4gICAgICAgICAgICAgICAgWzUsIDVdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbMywgNl0sXHJcbiAgICAgICAgICAgICAgICBbNSwgNl0sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCA3XSxcclxuICAgICAgICAgICAgICAgIFs0LCA3XSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMlxyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA5XSxcclxuICAgICAgICAgICAgICAgIFs1LCA5XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDhdLFxyXG4gICAgICAgICAgICAgICAgWzYsIDhdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgN10sXHJcbiAgICAgICAgICAgICAgICBbNywgN10sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA2XSxcclxuICAgICAgICAgICAgICAgIFs3LCA2XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDVdLFxyXG4gICAgICAgICAgICAgICAgWzgsIDVdLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGRvbUhhbmRsZXIucmVuZGVySW5pdGlhbEJvYXJkKFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5nZXRHcmlkKCksXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIyLmlzQ29tcHV0ZXIsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFpbiBnYW1lIGxvb3BcclxuICAgICAgICBhc3luYyBwbGF5R2FtZSgpIHtcclxuICAgICAgICAgICAgbGV0IGdhbWVPdmVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWdhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyB0dXJuXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbGlkQXR0YWNrID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCF2YWxpZEF0dGFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoaXQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY29tcHV0ZXIgcGxheWVyIG1vdmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGF1c2UgdG8gc2ltdWxhdGUgY29tcHV0ZXIgdGhpbmtpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBjb21wdXRlciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGFjdGl2ZVBsYXllci5wcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBodW1hbiBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgaHVtYW4gcGxheWVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYXdhaXQgZG9tSGFuZGxlci5hY3RpdmF0ZUN1cnJlbnRCb2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRoYXQgYXR0YWNrIG9uIG9wcG9uZW50IGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGl0ID0gYWN0aXZlQm9hcmQucmVjZWl2ZUF0dGFjayhhdHRhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21IYW5kbGVyLnJlY2VpdmVBdHRhY2soYXR0YWNrLCBoaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZEF0dGFjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGF0dGFjayBpcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCByZWdpc3RlciBpdCBhbmQgdGhlbiBhd2FpdCBpbnB1dCBmcm9tIG90aGVyIHBsYXllclxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUJvYXJkLmlzRmxlZXRTdW5rKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIG92ZXJcclxuICAgICAgICAgICAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tSGFuZGxlci5kaXNwbGF5V2lubmVyKFwiUGxheWVyIDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3dpdGNoIHBsYXllciB0dXJuc1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlUGxheWVyKCk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgZG9tSGFuZGxlci5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZG9tSGFuZGxlci5mbGlwQm9hcmRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRILCBUSUxFUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZWJvYXJkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgTUFYX1NISVBTID0gNTtcclxuXHJcbiAgICBjb25zdCBhbGxvd2VkTGVuZ3RocyA9IFtcclxuICAgICAgICB7IG51bWJlcjogMiwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDMsIHJlbWFpbmluZzogMiB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA0LCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogNSwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0pLmZpbGwoVElMRVMuV0FURVIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHBhaXIgb2YgY29vcmRpbmF0ZXMgaXMgdmFsaWQgZm9yIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkQ29vcmRzKHN0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5KSB7XHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgb2ZmIHRoZSBib2FyZFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgW3N0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5XS5zb21lKFxyXG4gICAgICAgICAgICAgICAgKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgZGlhZ29uYWxseVxyXG4gICAgICAgIGlmIChzdGFydHggIT09IGVuZHggJiYgc3RhcnR5ICE9PSBlbmR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBzaGlwcyBhbHJlYWR5IGluIHRoZSBncmlkXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0eDsgeCA8PSBlbmR4OyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0eTsgeSA8PSBlbmR5OyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYWxyZWFkeSBwbGFjZWQgdGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChncmlkW3hdW3ldICE9PSBUSUxFUy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBQbGFjZSBhIHNoaXAgb24gdGhlIGdhbWUgYm9hcmQgYmFzZWQgb24gc3RhcnQgYW5kIGVuZCBjb29yZGluYXRlc1xyXG4gICAgICAgIHBsYWNlU2hpcChbW3N0YXJ0eCwgc3RhcnR5XSwgW2VuZHgsIGVuZHldXSkge1xyXG4gICAgICAgICAgICAvLyBNYXggc2hpcHMgYWxyZWFkeSBwbGFjZWRcclxuICAgICAgICAgICAgaWYgKHBsYWNlZFNoaXBzLmxlbmd0aCA+PSBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgY2FwYWNpdHkgcmVhY2hlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSW52YWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWRDb29yZHMoc3RhcnR4LCBzdGFydHksIGVuZHgsIGVuZHkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID1cclxuICAgICAgICAgICAgICAgIDEgKyBNYXRoLm1heChNYXRoLmFicyhzdGFydHggLSBlbmR4KSwgTWF0aC5hYnMoc3RhcnR5IC0gZW5keSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgc2hpcCBsZW5ndGggdmFsaWRpdHlcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYWxsb3dlZExlbmd0aHMuZmluZCgob2JqKSA9PiBvYmoubnVtYmVyID09PSBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmoucmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IGNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBzaGlwIHJlZmVyZW5jZXMgdG8gdGhlIGdyaWRcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttaW5YLCBtYXhYXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGFydHgsIGVuZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0eCwgZW5keCksXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW21pblksIG1heFldID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0eSwgZW5keSksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoc3RhcnR5LCBlbmR5KSxcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBwbGFjZWRTaGlwcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvYmoucmVtYWluaW5nIC09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xyXG4gICAgICAgICAgICBpZiAoW3gsIHldLnNvbWUoKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBncmlkW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgLy8gRHVwbGljYXRlIGF0dGFja1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSBUSUxFUy5NSVNTIHx8IHNxdWFyZSA9PT0gVElMRVMuSElUKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbHJlYWR5IGF0dGFja2VkIHRoaXMgc3F1YXJlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNaXNzXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuTUlTUztcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhpdFxyXG4gICAgICAgICAgICBwbGFjZWRTaGlwc1tzcXVhcmVdLmhpdCgpO1xyXG4gICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuSElUO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXNGbGVldFN1bmsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWRTaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R3JpZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdyaWQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfTtcclxuIiwiaW1wb3J0IHsgQk9BUkRfV0lEVEggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZVBsYXllciA9IChpc0NvbXB1dGVyKSA9PiB7XHJcbiAgICAvLyBGaWxsIGFuIGFycmF5IHdpdGggYWxsIHBvc3NpYmxlIGF0dGFja3Mgb24gdGhlIGJvYXJkXHJcbiAgICBjb25zdCBwb3NzaWJsZUF0dGFja3MgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEJPQVJEX1dJRFRIOyB4ICs9IDEpIHtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1dJRFRIOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgcG9zc2libGVBdHRhY2tzLnB1c2goW3gsIHldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0NvbXB1dGVyLFxyXG5cclxuICAgICAgICBwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByYW5kb20gYXR0YWNrXHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja051bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhdHRhY2sgZnJvbSBhbGwgcG9zc2libGUgYXR0YWNrcyBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFjayA9IHBvc3NpYmxlQXR0YWNrcy5zcGxpY2UoYXR0YWNrTnVtYmVyLCAxKVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2s7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVQbGF5ZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlU2hpcCA9IChzaGlwTGVuZ3RoKSA9PiB7XHJcbiAgICAvLyBFcnJvciBjaGVja2luZ1xyXG4gICAgaWYgKHR5cGVvZiBzaGlwTGVuZ3RoICE9PSBcIm51bWJlclwiIHx8IGlzTmFOKHNoaXBMZW5ndGgpIHx8IHNoaXBMZW5ndGggPCAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xyXG4gICAgbGV0IGhpdHMgPSAwO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIHNoaXAgaGFzIG1vcmUgaGl0cyB0aGFuIGxpdmVzXHJcbiAgICAgICAgaXNTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGl0cyA+PSBsZW5ndGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGRhbWFnYWUgdG8gdGhlIHNoaXAgYW5kIGNoZWNrIGZvciBzaW5raW5nXHJcbiAgICAgICAgaGl0KCkge1xyXG4gICAgICAgICAgICBoaXRzICs9IDE7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVTaGlwIH07XHJcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XHJcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcclxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XHJcbiAgICAtLWdyaWQtY2VsbC1zaXplOiAycmVtO1xyXG5cclxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEdlbmVyYWwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbioge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBwYWRkaW5nLXRvcDogMTF2aDtcclxufVxyXG5cclxuLmJvYXJkLWRpc3BsYXkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBnYXA6IDJyZW07XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxufVxyXG5cclxuLmdhbWUtYm9hcmQge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGdhcDogdmFyKC0tZ3JpZC1jZWxsLWdhcCk7XHJcblxyXG4gICAgd2lkdGg6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XHJcbiAgICBoZWlnaHQ6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XHJcblxyXG4gICAgcGFkZGluZzogMnB4O1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5mb2N1c2VkLWJvYXJkIHtcclxuICAgIGZsZXgtd3JhcDogd3JhcDtcclxufVxyXG5cclxuLnVuZm9jdXNlZC1ib2FyZCB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcclxufVxyXG5cclxuLmdyaWQtY2VsbCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIHdpZHRoOiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XHJcbiAgICBoZWlnaHQ6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG59XHJcblxyXG4uY2xpY2thYmxlIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLndhdGVyLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcclxufVxyXG5cclxuLnNoaXAtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG59XHJcblxyXG4ubWlzcy1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcbn1cclxuXHJcbi5oaXQtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbn1cclxuXHJcbi5tb2RhbCB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgei1pbmRleDogMjtcclxuXHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xyXG5cclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG5cclxuICAgIG92ZXJmbG93OiBhdXRvO1xyXG59XHJcblxyXG4ubWVzc2FnZS1iYW5uZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLHNCQUFzQjs7SUFFdEIsOEJBQThCO0FBQ2xDOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLHNCQUFzQjtJQUN0QixTQUFTO0lBQ1QsVUFBVTtBQUNkOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7O0lBRXZCLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixTQUFTOztJQUVULHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYix5QkFBeUI7O0lBRXpCLDhHQUE4RztJQUM5RywrR0FBK0c7O0lBRS9HLFlBQVk7O0lBRVoseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7QUFFQTtJQUNJLDJCQUEyQjtJQUMzQix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsNEJBQTRCO0lBQzVCLDZCQUE2Qjs7SUFFN0IseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTtJQUNJLGVBQWU7SUFDZixNQUFNO0lBQ04sT0FBTztJQUNQLFVBQVU7O0lBRVYsYUFBYTtJQUNiLGtCQUFrQjs7SUFFbEIsV0FBVztJQUNYLFlBQVk7O0lBRVosY0FBYztBQUNsQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixXQUFXO0lBQ1gsV0FBVzs7SUFFWCxvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWiwwQ0FBMEM7QUFDOUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcclxcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcXHJcXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcXHJcXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogMnJlbTtcXHJcXG5cXHJcXG4gICAgLS1iYW5uZXItYmFja2dyb3VuZDogIzAwMDAwMDk5O1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqIEdlbmVyYWwgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbioge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgcGFkZGluZy10b3A6IDExdmg7XFxyXFxufVxcclxcblxcclxcbi5ib2FyZC1kaXNwbGF5IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGdhcDogMnJlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWUtYm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xcclxcblxcclxcbiAgICB3aWR0aDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG4gICAgaGVpZ2h0OiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcblxcclxcbiAgICBwYWRkaW5nOiAycHg7XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcclxcbn1cXHJcXG5cXHJcXG4udW5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQtY2VsbCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xcclxcbiAgICBoZWlnaHQ6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmNsaWNrYWJsZSB7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLndhdGVyLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcXHJcXG59XFxyXFxuXFxyXFxuLm1pc3MtY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxyXFxufVxcclxcblxcclxcbi5oaXQtY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLm1vZGFsIHtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIHotaW5kZXg6IDI7XFxyXFxuXFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG5cXHJcXG4gICAgb3ZlcmZsb3c6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi5tZXNzYWdlLWJhbm5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuXFxyXFxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBjcmVhdGVHYW1lSGFuZGxlciB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XHJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XHJcblxyXG5jb25zdCBiYXR0bGVTaGlwcyA9IGNyZWF0ZUdhbWVIYW5kbGVyKCk7XHJcbmJhdHRsZVNoaXBzLnNldHVwR2FtZSgpO1xyXG5iYXR0bGVTaGlwcy5wbGF5R2FtZSgpO1xyXG4iXSwibmFtZXMiOlsiQk9BUkRfV0lEVEgiLCJQTEFZRVJfMV9CT0FSRF9JRCIsIlBMQVlFUl8yX0JPQVJEX0lEIiwiVElMRVMiLCJXQVRFUiIsIk1JU1MiLCJISVQiLCJjcmVhdGVET01IYW5kbGVyIiwiYm9hcmREaXNwbGF5IiwicGxheWVyMUJvYXJkIiwicGxheWVyMkJvYXJkIiwiYWN0aXZlQm9hcmQiLCJzZWxlY3RDZWxsRXZlbnQiLCJncmlkQ2VsbCIsInJlc29sdmUiLCJhdHRhY2tDb29yZGluYXRlcyIsImdldEF0dHJpYnV0ZSIsImNvbnNvbGUiLCJsb2ciLCJkZWFjdGl2YXRlQ3VycmVudEJvYXJkIiwiY3JlYXRlR3JpZERpc3BsYXkiLCJncmlkIiwiaWQiLCJib2FyZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImZvckVhY2giLCJyb3ciLCJ4IiwiY2VsbCIsInkiLCJzZXRBdHRyaWJ1dGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicHJlcGVuZCIsImNyZWF0ZUhpZGRlbkRpc3BsYXkiLCJjbG9uZWRCb2FyZCIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsImNoaWxkTm9kZXMiLCJyZW1vdmUiLCJyZW5kZXJJbml0aWFsQm9hcmQiLCJwbGF5ZXIxR3JpZCIsInBsYXllcjJHcmlkIiwiaGlkZVNlY29uZEJvYXJkIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwicXVlcnlTZWxlY3RvciIsImZsaXBCb2FyZHMiLCJ0b2dnbGUiLCJzd2l0Y2hBY3RpdmVCb2FyZCIsImxhc3RDaGlsZCIsImFjdGl2YXRlQ3VycmVudEJvYXJkIiwiUHJvbWlzZSIsIkFycmF5IiwiZnJvbSIsInNvbWUiLCJ0aWxlVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWNlaXZlQXR0YWNrIiwiX3JlZiIsImhpdCIsImF0dGFja2VkQ2VsbCIsImRpc3BsYXlXaW5uZXIiLCJuYW1lIiwibW9kYWwiLCJtZXNzYWdlQmFubmVyIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJzd2l0Y2hBY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImRvbUhhbmRsZXIiLCJzZXR1cEdhbWUiLCJwbGFjZVNoaXAiLCJnZXRHcmlkIiwiaXNDb21wdXRlciIsInBsYXlHYW1lIiwiZ2FtZU92ZXIiLCJ2YWxpZEF0dGFjayIsImF0dGFjayIsInNldFRpbWVvdXQiLCJwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMiLCJpc0ZsZWV0U3VuayIsImNyZWF0ZVNoaXAiLCJNQVhfU0hJUFMiLCJhbGxvd2VkTGVuZ3RocyIsIm51bWJlciIsInJlbWFpbmluZyIsImZpbGwiLCJwbGFjZWRTaGlwcyIsImlzVmFsaWRDb29yZHMiLCJzdGFydHgiLCJzdGFydHkiLCJlbmR4IiwiZW5keSIsImNvb3JkIiwiRXJyb3IiLCJzaGlwTGVuZ3RoIiwiTWF0aCIsIm1heCIsImFicyIsIm9iaiIsImZpbmQiLCJuZXdTaGlwIiwicHVzaCIsIm1pblgiLCJtYXhYIiwibWluIiwibWluWSIsIm1heFkiLCJlcnJvciIsIl9yZWYyIiwic3F1YXJlIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwicG9zc2libGVBdHRhY2tzIiwiYXR0YWNrTnVtYmVyIiwiZmxvb3IiLCJyYW5kb20iLCJzcGxpY2UiLCJpc05hTiIsImhpdHMiLCJiYXR0bGVTaGlwcyJdLCJzb3VyY2VSb290IjoiIn0=