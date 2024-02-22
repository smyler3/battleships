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
        gridCell.setAttribute("data-x", x);
        gridCell.setAttribute("data-y", y);
        gridCell.setAttribute("data-player-id", id);
        gridCell.textContent = cell;
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
  }
  return {
    // Create and render display of both players boards
    renderInitialBoard(player1Grid, player2Grid) {
      boardDisplay = document.querySelector(".board-display");
      createGridDisplay(player1Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID);
      createGridDisplay(player2Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID);
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
          }
        });
      });
    },
    receiveAttack(_ref, hit) {
      let [x, y] = _ref;
      const attackedCell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"][data-player-id="${activeBoard.id}"]`);
      attackedCell.textContent = hit ? "X" : "O";
    },
    // Change which board is active
    switchActiveBoard() {
      activeBoard = activeBoard === player1Board ? player2Board : player1Board;
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
    inactivePlayer = activePlayer;
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
  let inactivePlayer = null;
  let activeBoard = null;
  return {
    setupGame() {
      domHandler = (0,_domHandler__WEBPACK_IMPORTED_MODULE_1__.createDOMHandler)();
      player1 = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(false);
      player1Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();
      player2 = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createPlayer)(true);
      player2Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();
      activePlayer = player1;
      inactivePlayer = player2;
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
      domHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid());
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
            await new Promise(resolve => setTimeout(resolve, 1000));

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

    padding-top: 2rem
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

    width: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));
    height: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));

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

    width: 3rem;
    height: 3rem;

    background-color: #ffffff;

    cursor: pointer;
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;AACvB;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB;AACJ;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,mFAAmF;IACnF,oFAAoF;;IAEpF,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,2BAA2B;IAC3B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,YAAY;;IAEZ,yBAAyB;;IAEzB,eAAe;AACnB","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    padding-top: 2rem\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.focused-board {\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.unfocused-board {\r\n    flex-direction: row-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: 3rem;\r\n    height: 3rem;\r\n\r\n    background-color: #ffffff;\r\n\r\n    cursor: pointer;\r\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDQUFDO0FBQ3ZDNEQsV0FBVyxDQUFDckQsU0FBUyxDQUFDLENBQUM7QUFDdkJxRCxXQUFXLENBQUNsRCxRQUFRLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZG9tSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQk9BUkRfV0lEVEggPSAxMDtcclxuY29uc3QgUExBWUVSXzFfQk9BUkRfSUQgPSBcInBsYXllcjFCb2FyZFwiO1xyXG5jb25zdCBQTEFZRVJfMl9CT0FSRF9JRCA9IFwicGxheWVyMkJvYXJkXCI7XHJcblxyXG5jb25zdCBUSUxFUyA9IHtcclxuICAgIFdBVEVSOiBcIldcIixcclxuICAgIE1JU1M6IFwiTVwiLFxyXG4gICAgSElUOiBcIkhcIixcclxufTtcclxuXHJcbmV4cG9ydCB7IEJPQVJEX1dJRFRILCBQTEFZRVJfMV9CT0FSRF9JRCwgUExBWUVSXzJfQk9BUkRfSUQsIFRJTEVTIH07XHJcbiIsImltcG9ydCB7IFBMQVlFUl8xX0JPQVJEX0lELCBQTEFZRVJfMl9CT0FSRF9JRCwgVElMRVMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZURPTUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBsZXQgYm9hcmREaXNwbGF5ID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgYWN0aXZlQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IHNlbGVjdENlbGxFdmVudCA9IChncmlkQ2VsbCwgcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGF0dGFja0Nvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiksXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgWyR7YXR0YWNrQ29vcmRpbmF0ZXNbMF19LCAke2F0dGFja0Nvb3JkaW5hdGVzWzFdfV1gKTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShhdHRhY2tDb29yZGluYXRlcyk7XHJcblxyXG4gICAgICAgIGRlYWN0aXZhdGVDdXJyZW50Qm9hcmQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgZ3JpZCB0byBzdG9yZSBpbmZvcm1hdGlvbiBhYm91dCBhIHBsYXllcidzIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVHcmlkRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS14XCIsIHgpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIiwgaWQpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwudGV4dENvbnRlbnQgPSBjZWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJvYXJkRGlzcGxheS5wcmVwZW5kKGJvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYWJpbGl0eSB0byBhdHRhY2sgY2VsbHMgb24gb3Bwb25lbnQncyBib2FyZFxyXG4gICAgZnVuY3Rpb24gZGVhY3RpdmF0ZUN1cnJlbnRCb2FyZCgpIHtcclxuICAgICAgICAvLyBDbG9uZSB0aGUgcGFyZW50IG5vZGUgdG8gcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICBjb25zdCBjbG9uZWRCb2FyZCA9IGFjdGl2ZUJvYXJkLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICBib2FyZERpc3BsYXkucmVwbGFjZUNoaWxkKGNsb25lZEJvYXJkLCBhY3RpdmVCb2FyZCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSByZWZlcmVuY2VzXHJcbiAgICAgICAgaWYgKGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQpIHtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjdGl2ZUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBDcmVhdGUgYW5kIHJlbmRlciBkaXNwbGF5IG9mIGJvdGggcGxheWVycyBib2FyZHNcclxuICAgICAgICByZW5kZXJJbml0aWFsQm9hcmQocGxheWVyMUdyaWQsIHBsYXllcjJHcmlkKSB7XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtZGlzcGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjFHcmlkLCBQTEFZRVJfMV9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjJHcmlkLCBQTEFZRVJfMl9CT0FSRF9JRCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMV9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzJfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUG9zaXRpb24gcGxheWVyIDEncyBib2FyZCBmYWNpbmcgc2NyZWVuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNsYXNzTGlzdC5hZGQoXCJ1bmZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gRmxpcCB0aGUgcmVuZGVyZWQgYm9hcmQgZGlzcGxheVxyXG4gICAgICAgIGZsaXBCb2FyZHMoKSB7XHJcbiAgICAgICAgICAgIC8vIEZsaXAgcGxheWVyIDEgYm9hcmQgY2VsbHNcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZsaXAgcGxheWVyIDIgYm9hcmQgY2VsbHNcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN3aXRjaCBib2FyZCBwb3NpdGlvbnNcclxuICAgICAgICAgICAgYm9hcmREaXNwbGF5LnByZXBlbmQoYm9hcmREaXNwbGF5Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBhbGwgYXR0YWNrYWJsZSBjZWxscyBvbiBvcHBvbmVudCdzIGJvYXJkIHNlbGVjdGFibGUgZm9yIGF0dGFja3NcclxuICAgICAgICBhc3luYyBhY3RpdmF0ZUN1cnJlbnRCb2FyZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbGUgaGFzbid0IGFscmVhZHkgYmVlbiBhdHRhY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhW1RJTEVTLkhJVCwgVElMRVMuTUlTU10uc29tZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aWxlVHlwZSkgPT4gdGlsZVR5cGUgPT09IGNlbGwudGV4dENvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzZWxlY3RhYmxlIGJ5IGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDZWxsRXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldLCBoaXQpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0YWNrZWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXVtkYXRhLXBsYXllci1pZD1cIiR7YWN0aXZlQm9hcmQuaWR9XCJdYCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC50ZXh0Q29udGVudCA9IGhpdCA/IFwiWFwiIDogXCJPXCI7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIHdoaWNoIGJvYXJkIGlzIGFjdGl2ZVxyXG4gICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCkge1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlRE9NSGFuZGxlciB9IGZyb20gXCIuL2RvbUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHN3aXRjaEFjdGl2ZVBsYXllcigpIHtcclxuICAgICAgICBpbmFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllcjtcclxuICAgICAgICBhY3RpdmVQbGF5ZXIgPSBhY3RpdmVQbGF5ZXIgPT09IHBsYXllcjEgPyBwbGF5ZXIyIDogcGxheWVyMTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVCb2FyZCgpIHtcclxuICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRvbUhhbmRsZXIgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIxID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIyID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIyQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBhY3RpdmVQbGF5ZXIgPSBudWxsO1xyXG4gICAgbGV0IGluYWN0aXZlUGxheWVyID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgICAgIGRvbUhhbmRsZXIgPSBjcmVhdGVET01IYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKGZhbHNlKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIyID0gY3JlYXRlUGxheWVyKHRydWUpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9IHBsYXllcjE7XHJcbiAgICAgICAgICAgIGluYWN0aXZlUGxheWVyID0gcGxheWVyMjtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPSBwbGF5ZXIyQm9hcmQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMVxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCAzXSxcclxuICAgICAgICAgICAgICAgIFs3LCAzXSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzMsIDRdLFxyXG4gICAgICAgICAgICAgICAgWzYsIDRdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbMywgNV0sXHJcbiAgICAgICAgICAgICAgICBbNSwgNV0sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFszLCA2XSxcclxuICAgICAgICAgICAgICAgIFs1LCA2XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzMsIDddLFxyXG4gICAgICAgICAgICAgICAgWzQsIDddLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBsYWNlIHNoaXBzIHBsYXllciAyXHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDldLFxyXG4gICAgICAgICAgICAgICAgWzUsIDldLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgOF0sXHJcbiAgICAgICAgICAgICAgICBbNiwgOF0sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA3XSxcclxuICAgICAgICAgICAgICAgIFs3LCA3XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDZdLFxyXG4gICAgICAgICAgICAgICAgWzcsIDZdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgNV0sXHJcbiAgICAgICAgICAgICAgICBbOCwgNV0sXHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgZG9tSGFuZGxlci5yZW5kZXJJbml0aWFsQm9hcmQoXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWluIGdhbWUgbG9vcFxyXG4gICAgICAgIGFzeW5jIHBsYXlHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZ2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHR1cm5cIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsaWRBdHRhY2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIXZhbGlkQXR0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dGFjayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhpdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjb21wdXRlciBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVQbGF5ZXIuaXNDb21wdXRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXVzZSB0byBzaW11bGF0ZSBjb21wdXRlciB0aGlua2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgY29tcHV0ZXIgZm9yIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2sgPSBhY3RpdmVQbGF5ZXIucHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgaHVtYW4gcGxheWVyIG1vdmVcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNrIGh1bWFuIHBsYXllciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGF3YWl0IGRvbUhhbmRsZXIuYWN0aXZhdGVDdXJyZW50Qm9hcmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0aGF0IGF0dGFjayBvbiBvcHBvbmVudCBib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdCA9IGFjdGl2ZUJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tSGFuZGxlci5yZWNlaXZlQXR0YWNrKGF0dGFjaywgaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRBdHRhY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhdHRhY2sgaXMgaW52YWxpZCwgYXNrIGFnYWluXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcmVnaXN0ZXIgaXQgYW5kIHRoZW4gYXdhaXQgaW5wdXQgZnJvbSBvdGhlciBwbGF5ZXJcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVCb2FyZC5pc0ZsZWV0U3VuaygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2FtZSBvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBwbGF5ZXIgdHVybnNcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZVBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIGRvbUhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIC8vIGRvbUhhbmRsZXIuZmxpcEJvYXJkcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBCT0FSRF9XSURUSCwgVElMRVMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY3JlYXRlU2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZUdhbWVib2FyZCA9ICgpID0+IHtcclxuICAgIGNvbnN0IE1BWF9TSElQUyA9IDU7XHJcblxyXG4gICAgY29uc3QgYWxsb3dlZExlbmd0aHMgPSBbXHJcbiAgICAgICAgeyBudW1iZXI6IDIsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiAzLCByZW1haW5pbmc6IDIgfSxcclxuICAgICAgICB7IG51bWJlcjogNCwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDUsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBncmlkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogQk9BUkRfV0lEVEggfSwgKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9KS5maWxsKFRJTEVTLldBVEVSKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBsYWNlZFNoaXBzID0gW107XHJcblxyXG4gICAgLy8gQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBwYWlyIG9mIGNvb3JkaW5hdGVzIGlzIHZhbGlkIGZvciBwbGFjaW5nIGEgc2hpcFxyXG4gICAgZnVuY3Rpb24gaXNWYWxpZENvb3JkcyhzdGFydHgsIHN0YXJ0eSwgZW5keCwgZW5keSkge1xyXG4gICAgICAgIC8vIFNoaXAgcGxhY2VkIG9mZiB0aGUgYm9hcmRcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIFtzdGFydHgsIHN0YXJ0eSwgZW5keCwgZW5keV0uc29tZShcclxuICAgICAgICAgICAgICAgIChjb29yZCkgPT4gY29vcmQgPCAwIHx8IGNvb3JkID49IEJPQVJEX1dJRFRILFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNoaXAgcGxhY2VkIGRpYWdvbmFsbHlcclxuICAgICAgICBpZiAoc3RhcnR4ICE9PSBlbmR4ICYmIHN0YXJ0eSAhPT0gZW5keSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3Igc2hpcHMgYWxyZWFkeSBpbiB0aGUgZ3JpZFxyXG4gICAgICAgIGZvciAobGV0IHggPSBzdGFydHg7IHggPD0gZW5keDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSBzdGFydHk7IHkgPD0gZW5keTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGFscmVhZHkgcGxhY2VkIHRoZXJlXHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JpZFt4XVt5XSAhPT0gVElMRVMuV0FURVIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gUGxhY2UgYSBzaGlwIG9uIHRoZSBnYW1lIGJvYXJkIGJhc2VkIG9uIHN0YXJ0IGFuZCBlbmQgY29vcmRpbmF0ZXNcclxuICAgICAgICBwbGFjZVNoaXAoW1tzdGFydHgsIHN0YXJ0eV0sIFtlbmR4LCBlbmR5XV0pIHtcclxuICAgICAgICAgICAgLy8gTWF4IHNoaXBzIGFscmVhZHkgcGxhY2VkXHJcbiAgICAgICAgICAgIGlmIChwbGFjZWRTaGlwcy5sZW5ndGggPj0gTUFYX1NISVBTKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwIGNhcGFjaXR5IHJlYWNoZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEludmFsaWQgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkQ29vcmRzKHN0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlc1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9XHJcbiAgICAgICAgICAgICAgICAxICsgTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnR4IC0gZW5keCksIE1hdGguYWJzKHN0YXJ0eSAtIGVuZHkpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHNoaXAgbGVuZ3RoIHZhbGlkaXR5XHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoKG9iaikgPT4gb2JqLm51bWJlciA9PT0gc2hpcExlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqLnJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNoaXAgbGVuZ3RoXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NoaXAgPSBjcmVhdGVTaGlwKHNoaXBMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkU2hpcHMucHVzaChuZXdTaGlwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgc2hpcCByZWZlcmVuY2VzIHRvIHRoZSBncmlkXHJcbiAgICAgICAgICAgICAgICBjb25zdCBbbWluWCwgbWF4WF0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnR4LCBlbmR4KSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChzdGFydHgsIGVuZHgpLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttaW5ZLCBtYXhZXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGFydHksIGVuZHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0eSwgZW5keSksXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBtaW5YOyB4IDw9IG1heFg7IHggKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gcGxhY2VkU2hpcHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLnJlbWFpbmluZyAtPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhbeCwgeV0pIHtcclxuICAgICAgICAgICAgaWYgKFt4LCB5XS5zb21lKChjb29yZCkgPT4gY29vcmQgPCAwIHx8IGNvb3JkID49IEJPQVJEX1dJRFRIKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlc1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gZ3JpZFt4XVt5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBhdHRhY2tcclxuICAgICAgICAgICAgaWYgKHNxdWFyZSA9PT0gVElMRVMuTUlTUyB8fCBzcXVhcmUgPT09IFRJTEVTLkhJVCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxyZWFkeSBhdHRhY2tlZCB0aGlzIHNxdWFyZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTWlzc1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSBUSUxFUy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IFRJTEVTLk1JU1M7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIaXRcclxuICAgICAgICAgICAgcGxhY2VkU2hpcHNbc3F1YXJlXS5oaXQoKTtcclxuICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IFRJTEVTLkhJVDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGlzRmxlZXRTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGxhY2VkU2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdyaWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBncmlkO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRIIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVQbGF5ZXIgPSAoaXNDb21wdXRlcikgPT4ge1xyXG4gICAgLy8gRmlsbCBhbiBhcnJheSB3aXRoIGFsbCBwb3NzaWJsZSBhdHRhY2tzIG9uIHRoZSBib2FyZFxyXG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9XSURUSDsgeCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBCT0FSRF9XSURUSDsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlQXR0YWNrcy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNDb21wdXRlcixcclxuXHJcbiAgICAgICAgcHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzKCkge1xyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmFuZG9tIGF0dGFja1xyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2tOdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYXR0YWNrIGZyb20gYWxsIHBvc3NpYmxlIGF0dGFja3MgYW5kIHJldHVybiBpdFxyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2sgPSBwb3NzaWJsZUF0dGFja3Muc3BsaWNlKGF0dGFja051bWJlciwgMSlbMF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXR0YWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlUGxheWVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZVNoaXAgPSAoc2hpcExlbmd0aCkgPT4ge1xyXG4gICAgLy8gRXJyb3IgY2hlY2tpbmdcclxuICAgIGlmICh0eXBlb2Ygc2hpcExlbmd0aCAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihzaGlwTGVuZ3RoKSB8fCBzaGlwTGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcclxuICAgIGxldCBoaXRzID0gMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENoZWNrcyB3aGV0aGVyIHRoZSBzaGlwIGhhcyBtb3JlIGhpdHMgdGhhbiBsaXZlc1xyXG4gICAgICAgIGlzU3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhpdHMgPj0gbGVuZ3RoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBkYW1hZ2FlIHRvIHRoZSBzaGlwIGFuZCBjaGVjayBmb3Igc2lua2luZ1xyXG4gICAgICAgIGhpdCgpIHtcclxuICAgICAgICAgICAgaGl0cyArPSAxO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlU2hpcCB9O1xyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XHJcbiAgICAtLWdyaWQtcGFkZGluZzogMnB4O1xyXG59XHJcblxyXG4vKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogR2VuZXJhbCBTdHlsaW5nXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuKiB7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxufVxyXG5cclxuYm9keSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIHBhZGRpbmctdG9wOiAycmVtXHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZ2FwOiAycmVtO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xyXG5cclxuICAgIHdpZHRoOiBjYWxjKDMwcmVtICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDMwcmVtICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG5cclxuICAgIHBhZGRpbmc6IDJweDtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uZm9jdXNlZC1ib2FyZCB7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi51bmZvY3VzZWQtYm9hcmQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XHJcbn1cclxuXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogM3JlbTtcclxuICAgIGhlaWdodDogM3JlbTtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG5cclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLG9CQUFvQjtJQUNwQixtQkFBbUI7QUFDdkI7O0FBRUE7Ozs7RUFJRTtBQUNGO0lBQ0ksc0JBQXNCO0lBQ3RCLFNBQVM7SUFDVCxVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkI7QUFDSjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixTQUFTOztJQUVULHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYix5QkFBeUI7O0lBRXpCLG1GQUFtRjtJQUNuRixvRkFBb0Y7O0lBRXBGLFlBQVk7O0lBRVoseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7QUFFQTtJQUNJLDJCQUEyQjtJQUMzQix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsV0FBVztJQUNYLFlBQVk7O0lBRVoseUJBQXlCOztJQUV6QixlQUFlO0FBQ25CXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXHJcXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XFxyXFxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogR2VuZXJhbCBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuKiB7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBwYWRkaW5nLXRvcDogMnJlbVxcclxcbn1cXHJcXG5cXHJcXG4uYm9hcmQtZGlzcGxheSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBnYXA6IDJyZW07XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5nYW1lLWJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZ2FwOiB2YXIoLS1ncmlkLWNlbGwtZ2FwKTtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IGNhbGMoMzByZW0gKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuICAgIGhlaWdodDogY2FsYygzMHJlbSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG5cXHJcXG4gICAgcGFkZGluZzogMnB4O1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uZm9jdXNlZC1ib2FyZCB7XFxyXFxuICAgIGZsZXgtd3JhcDogd3JhcDtcXHJcXG59XFxyXFxuXFxyXFxuLnVuZm9jdXNlZC1ib2FyZCB7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XFxyXFxufVxcclxcblxcclxcbi5ncmlkLWNlbGwge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IDNyZW07XFxyXFxuICAgIGhlaWdodDogM3JlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXHJcXG5cXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xyXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xyXG5cclxuY29uc3QgYmF0dGxlU2hpcHMgPSBjcmVhdGVHYW1lSGFuZGxlcigpO1xyXG5iYXR0bGVTaGlwcy5zZXR1cEdhbWUoKTtcclxuYmF0dGxlU2hpcHMucGxheUdhbWUoKTtcclxuIl0sIm5hbWVzIjpbIkJPQVJEX1dJRFRIIiwiUExBWUVSXzFfQk9BUkRfSUQiLCJQTEFZRVJfMl9CT0FSRF9JRCIsIlRJTEVTIiwiV0FURVIiLCJNSVNTIiwiSElUIiwiY3JlYXRlRE9NSGFuZGxlciIsImJvYXJkRGlzcGxheSIsInBsYXllcjFCb2FyZCIsInBsYXllcjJCb2FyZCIsImFjdGl2ZUJvYXJkIiwic2VsZWN0Q2VsbEV2ZW50IiwiZ3JpZENlbGwiLCJyZXNvbHZlIiwiYXR0YWNrQ29vcmRpbmF0ZXMiLCJnZXRBdHRyaWJ1dGUiLCJjb25zb2xlIiwibG9nIiwiZGVhY3RpdmF0ZUN1cnJlbnRCb2FyZCIsImNyZWF0ZUdyaWREaXNwbGF5IiwiZ3JpZCIsImlkIiwiYm9hcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJmb3JFYWNoIiwicm93IiwieCIsImNlbGwiLCJ5Iiwic2V0QXR0cmlidXRlIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsInByZXBlbmQiLCJjbG9uZWRCb2FyZCIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsInJlbmRlckluaXRpYWxCb2FyZCIsInBsYXllcjFHcmlkIiwicGxheWVyMkdyaWQiLCJxdWVyeVNlbGVjdG9yIiwiZmxpcEJvYXJkcyIsInRvZ2dsZSIsInN3aXRjaEFjdGl2ZUJvYXJkIiwibGFzdENoaWxkIiwiYWN0aXZhdGVDdXJyZW50Qm9hcmQiLCJQcm9taXNlIiwiQXJyYXkiLCJmcm9tIiwiY2hpbGROb2RlcyIsInNvbWUiLCJ0aWxlVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZWNlaXZlQXR0YWNrIiwiX3JlZiIsImhpdCIsImF0dGFja2VkQ2VsbCIsImNyZWF0ZVBsYXllciIsImNyZWF0ZUdhbWVib2FyZCIsImNyZWF0ZUdhbWVIYW5kbGVyIiwic3dpdGNoQWN0aXZlUGxheWVyIiwiaW5hY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImRvbUhhbmRsZXIiLCJzZXR1cEdhbWUiLCJwbGFjZVNoaXAiLCJnZXRHcmlkIiwicGxheUdhbWUiLCJnYW1lT3ZlciIsInZhbGlkQXR0YWNrIiwiYXR0YWNrIiwiaXNDb21wdXRlciIsInNldFRpbWVvdXQiLCJwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMiLCJpc0ZsZWV0U3VuayIsImNyZWF0ZVNoaXAiLCJNQVhfU0hJUFMiLCJhbGxvd2VkTGVuZ3RocyIsIm51bWJlciIsInJlbWFpbmluZyIsImxlbmd0aCIsImZpbGwiLCJwbGFjZWRTaGlwcyIsImlzVmFsaWRDb29yZHMiLCJzdGFydHgiLCJzdGFydHkiLCJlbmR4IiwiZW5keSIsImNvb3JkIiwiRXJyb3IiLCJzaGlwTGVuZ3RoIiwiTWF0aCIsIm1heCIsImFicyIsIm9iaiIsImZpbmQiLCJ1bmRlZmluZWQiLCJuZXdTaGlwIiwicHVzaCIsIm1pblgiLCJtYXhYIiwibWluIiwibWluWSIsIm1heFkiLCJlcnJvciIsIl9yZWYyIiwic3F1YXJlIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwicG9zc2libGVBdHRhY2tzIiwiYXR0YWNrTnVtYmVyIiwiZmxvb3IiLCJyYW5kb20iLCJzcGxpY2UiLCJpc05hTiIsImhpdHMiLCJiYXR0bGVTaGlwcyJdLCJzb3VyY2VSb290IjoiIn0=