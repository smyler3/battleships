/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/computerPlayer.js":
/*!*******************************!*\
  !*** ./src/computerPlayer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createComputerPlayer: () => (/* binding */ createComputerPlayer)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");


const createComputerPlayer = () => {
  const robotPlayer = (0,_player__WEBPACK_IMPORTED_MODULE_1__.createPlayer)();

  // Fill an array with all possible attacks on the board
  const possibleAttacks = [];
  for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; x += 1) {
    for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; y += 1) {
      possibleAttacks.push([x, y]);
    }
  }
  robotPlayer.provideAttackCoordinates = function () {
    // Pick a random attack
    const attackNumber = Math.floor(Math.random() * possibleAttacks.length);

    // Remove attack from all possible attacks and return it
    const attack = possibleAttacks.splice(attackNumber, 1)[0];
    return attack;
  };
  return robotPlayer;
};


/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BOARD_WIDTH: () => (/* binding */ BOARD_WIDTH),
/* harmony export */   PLAYER_1_BOARD_ID: () => (/* binding */ PLAYER_1_BOARD_ID),
/* harmony export */   PLAYER_2_BOARD_ID: () => (/* binding */ PLAYER_2_BOARD_ID)
/* harmony export */ });
const BOARD_WIDTH = 10;
const PLAYER_1_BOARD_ID = "player1Board";
const PLAYER_2_BOARD_ID = "player2Board";


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
  let player1Board = null;
  let player2Board = null;

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
        gridCell.textContent = cell;
        board.appendChild(gridCell);
      });
    });
    document.querySelector(".board-display").prepend(board);
  }
  return {
    // Create and render display of both players boards
    renderInitialBoard(player1Grid, player2Grid) {
      createGridDisplay(player1Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID);
      createGridDisplay(player2Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID);
      player1Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID}`);
      player2Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID}`);

      // Position player 1's board facing screen
      player1Board.classList.add("focused-board");
      player2Board.classList.add("unfocused-board");
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
/* harmony import */ var _computerPlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./computerPlayer */ "./src/computerPlayer.js");
/* harmony import */ var _domHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domHandler */ "./src/domHandler.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _humanPlayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./humanPlayer */ "./src/humanPlayer.js");




const createGameHandler = () => {
  /* istanbul ignore next */
  const domHandler = (0,_domHandler__WEBPACK_IMPORTED_MODULE_1__.createDOMHandler)();
  const player1 = (0,_humanPlayer__WEBPACK_IMPORTED_MODULE_3__.createHumanPlayer)();
  const player1Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();
  const player2 = (0,_computerPlayer__WEBPACK_IMPORTED_MODULE_0__.createComputerPlayer)();
  const player2Board = (0,_gameboard__WEBPACK_IMPORTED_MODULE_2__.createGameboard)();

  // Place ships player 1
  player1Board.placeShip([[0, 0], [4, 0]]);
  player1Board.placeShip([[0, 1], [3, 1]]);
  player1Board.placeShip([[0, 2], [2, 2]]);
  player1Board.placeShip([[0, 3], [2, 3]]);
  player1Board.placeShip([[0, 4], [1, 4]]);

  // Place ships player 2
  player2Board.placeShip([[9, 9], [5, 9]]);
  player2Board.placeShip([[9, 8], [6, 8]]);
  player2Board.placeShip([[9, 7], [7, 7]]);
  player2Board.placeShip([[9, 6], [7, 6]]);
  player2Board.placeShip([[9, 5], [8, 5]]);
  domHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid());
  return {
    player1,
    player2,
    player1Board,
    player2Board
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
  const tiles = {
    WATER: "W",
    MISS: "M",
    HIT: "H"
  };
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
    }).fill(tiles.WATER);
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
        if (grid[x][y] !== tiles.WATER) {
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
      if (square === tiles.MISS || square === tiles.HIT) {
        throw new Error("Already attacked this square");
      }

      // Miss
      if (square === tiles.WATER) {
        grid[x][y] = tiles.MISS;
        return false;
      }

      // Hit
      placedShips[square].hit();
      grid[x][y] = tiles.HIT;
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

/***/ "./src/humanPlayer.js":
/*!****************************!*\
  !*** ./src/humanPlayer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHumanPlayer: () => (/* binding */ createHumanPlayer)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");

const createHumanPlayer = () => {
  const humanPlayer = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createPlayer)();
  humanPlayer.provideAttackCoordinates = function () {};
  return humanPlayer;
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
const createPlayer = () => {
  return {
    provideAttackCoordinates() {
      // To be overridden by subclass
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
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;AACvB;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB;AACJ;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,mFAAmF;IACnF,oFAAoF;;IAEpF,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,2BAA2B;IAC3B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,YAAY;;IAEZ,yBAAyB;AAC7B","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    padding-top: 2rem\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(30rem + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.focused-board {\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.unfocused-board {\r\n    flex-direction: row-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: 3rem;\r\n    height: 3rem;\r\n\r\n    background-color: #ffffff;\r\n}"],"sourceRoot":""}]);
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


(0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createGameHandler)();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7OztBQ0FrRDtBQUM3QjtBQUVyQm5ELCtEQUFpQixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9jb21wdXRlclBsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9kb21IYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9odW1hblBsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQk9BUkRfV0lEVEggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY3JlYXRlUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XHJcblxyXG5jb25zdCBjcmVhdGVDb21wdXRlclBsYXllciA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJvYm90UGxheWVyID0gY3JlYXRlUGxheWVyKCk7XHJcblxyXG4gICAgLy8gRmlsbCBhbiBhcnJheSB3aXRoIGFsbCBwb3NzaWJsZSBhdHRhY2tzIG9uIHRoZSBib2FyZFxyXG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9XSURUSDsgeCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBCT0FSRF9XSURUSDsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlQXR0YWNrcy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJvYm90UGxheWVyLnByb3ZpZGVBdHRhY2tDb29yZGluYXRlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBQaWNrIGEgcmFuZG9tIGF0dGFja1xyXG4gICAgICAgIGNvbnN0IGF0dGFja051bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYXR0YWNrIGZyb20gYWxsIHBvc3NpYmxlIGF0dGFja3MgYW5kIHJldHVybiBpdFxyXG4gICAgICAgIGNvbnN0IGF0dGFjayA9IHBvc3NpYmxlQXR0YWNrcy5zcGxpY2UoYXR0YWNrTnVtYmVyLCAxKVswXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dGFjaztcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHJvYm90UGxheWVyO1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlQ29tcHV0ZXJQbGF5ZXIgfTtcclxuIiwiY29uc3QgQk9BUkRfV0lEVEggPSAxMDtcclxuY29uc3QgUExBWUVSXzFfQk9BUkRfSUQgPSBcInBsYXllcjFCb2FyZFwiO1xyXG5jb25zdCBQTEFZRVJfMl9CT0FSRF9JRCA9IFwicGxheWVyMkJvYXJkXCI7XHJcblxyXG5leHBvcnQgeyBCT0FSRF9XSURUSCwgUExBWUVSXzFfQk9BUkRfSUQsIFBMQVlFUl8yX0JPQVJEX0lEIH07XHJcbiIsImltcG9ydCB7IFBMQVlFUl8xX0JPQVJEX0lELCBQTEFZRVJfMl9CT0FSRF9JRCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlRE9NSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgZ3JpZCB0byBzdG9yZSBpbmZvcm1hdGlvbiBhYm91dCBhIHBsYXllcidzIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVHcmlkRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS14XCIsIHgpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwudGV4dENvbnRlbnQgPSBjZWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtZGlzcGxheVwiKS5wcmVwZW5kKGJvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgcmVuZGVyIGRpc3BsYXkgb2YgYm90aCBwbGF5ZXJzIGJvYXJkc1xyXG4gICAgICAgIHJlbmRlckluaXRpYWxCb2FyZChwbGF5ZXIxR3JpZCwgcGxheWVyMkdyaWQpIHtcclxuICAgICAgICAgICAgY3JlYXRlR3JpZERpc3BsYXkocGxheWVyMUdyaWQsIFBMQVlFUl8xX0JPQVJEX0lEKTtcclxuICAgICAgICAgICAgY3JlYXRlR3JpZERpc3BsYXkocGxheWVyMkdyaWQsIFBMQVlFUl8yX0JPQVJEX0lEKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke1BMQVlFUl8xX0JPQVJEX0lEfWApO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMl9CT0FSRF9JRH1gKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBvc2l0aW9uIHBsYXllciAxJ3MgYm9hcmQgZmFjaW5nIHNjcmVlblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LmFkZChcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5jbGFzc0xpc3QuYWRkKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVDb21wdXRlclBsYXllciB9IGZyb20gXCIuL2NvbXB1dGVyUGxheWVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTUhhbmRsZXIgfSBmcm9tIFwiLi9kb21IYW5kbGVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xyXG5pbXBvcnQgeyBjcmVhdGVIdW1hblBsYXllciB9IGZyb20gXCIuL2h1bWFuUGxheWVyXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lSGFuZGxlciA9ICgpID0+IHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICBjb25zdCBkb21IYW5kbGVyID0gY3JlYXRlRE9NSGFuZGxlcigpO1xyXG5cclxuICAgIGNvbnN0IHBsYXllcjEgPSBjcmVhdGVIdW1hblBsYXllcigpO1xyXG4gICAgY29uc3QgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgY29uc3QgcGxheWVyMiA9IGNyZWF0ZUNvbXB1dGVyUGxheWVyKCk7XHJcbiAgICBjb25zdCBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMVxyXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgWzAsIDBdLFxyXG4gICAgICAgIFs0LCAwXSxcclxuICAgIF0pO1xyXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgWzAsIDFdLFxyXG4gICAgICAgIFszLCAxXSxcclxuICAgIF0pO1xyXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgWzAsIDJdLFxyXG4gICAgICAgIFsyLCAyXSxcclxuICAgIF0pO1xyXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgWzAsIDNdLFxyXG4gICAgICAgIFsyLCAzXSxcclxuICAgIF0pO1xyXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgWzAsIDRdLFxyXG4gICAgICAgIFsxLCA0XSxcclxuICAgIF0pO1xyXG5cclxuICAgIC8vIFBsYWNlIHNoaXBzIHBsYXllciAyXHJcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICBbOSwgOV0sXHJcbiAgICAgICAgWzUsIDldLFxyXG4gICAgXSk7XHJcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICBbOSwgOF0sXHJcbiAgICAgICAgWzYsIDhdLFxyXG4gICAgXSk7XHJcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICBbOSwgN10sXHJcbiAgICAgICAgWzcsIDddLFxyXG4gICAgXSk7XHJcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICBbOSwgNl0sXHJcbiAgICAgICAgWzcsIDZdLFxyXG4gICAgXSk7XHJcbiAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICBbOSwgNV0sXHJcbiAgICAgICAgWzgsIDVdLFxyXG4gICAgXSk7XHJcblxyXG4gICAgZG9tSGFuZGxlci5yZW5kZXJJbml0aWFsQm9hcmQoXHJcbiAgICAgICAgcGxheWVyMUJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICBwbGF5ZXIyQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBsYXllcjEsXHJcbiAgICAgICAgcGxheWVyMixcclxuICAgICAgICBwbGF5ZXIxQm9hcmQsXHJcbiAgICAgICAgcGxheWVyMkJvYXJkLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRIIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBNQVhfU0hJUFMgPSA1O1xyXG5cclxuICAgIGNvbnN0IHRpbGVzID0ge1xyXG4gICAgICAgIFdBVEVSOiBcIldcIixcclxuICAgICAgICBNSVNTOiBcIk1cIixcclxuICAgICAgICBISVQ6IFwiSFwiLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBhbGxvd2VkTGVuZ3RocyA9IFtcclxuICAgICAgICB7IG51bWJlcjogMiwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDMsIHJlbWFpbmluZzogMiB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA0LCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogNSwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0pLmZpbGwodGlsZXMuV0FURVIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHBhaXIgb2YgY29vcmRpbmF0ZXMgaXMgdmFsaWQgZm9yIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkQ29vcmRzKHN0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5KSB7XHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgb2ZmIHRoZSBib2FyZFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgW3N0YXJ0eCwgc3RhcnR5LCBlbmR4LCBlbmR5XS5zb21lKFxyXG4gICAgICAgICAgICAgICAgKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgZGlhZ29uYWxseVxyXG4gICAgICAgIGlmIChzdGFydHggIT09IGVuZHggJiYgc3RhcnR5ICE9PSBlbmR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBzaGlwcyBhbHJlYWR5IGluIHRoZSBncmlkXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0eDsgeCA8PSBlbmR4OyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0eTsgeSA8PSBlbmR5OyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYWxyZWFkeSBwbGFjZWQgdGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChncmlkW3hdW3ldICE9PSB0aWxlcy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBQbGFjZSBhIHNoaXAgb24gdGhlIGdhbWUgYm9hcmQgYmFzZWQgb24gc3RhcnQgYW5kIGVuZCBjb29yZGluYXRlc1xyXG4gICAgICAgIHBsYWNlU2hpcChbW3N0YXJ0eCwgc3RhcnR5XSwgW2VuZHgsIGVuZHldXSkge1xyXG4gICAgICAgICAgICAvLyBNYXggc2hpcHMgYWxyZWFkeSBwbGFjZWRcclxuICAgICAgICAgICAgaWYgKHBsYWNlZFNoaXBzLmxlbmd0aCA+PSBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgY2FwYWNpdHkgcmVhY2hlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSW52YWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWRDb29yZHMoc3RhcnR4LCBzdGFydHksIGVuZHgsIGVuZHkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID1cclxuICAgICAgICAgICAgICAgIDEgKyBNYXRoLm1heChNYXRoLmFicyhzdGFydHggLSBlbmR4KSwgTWF0aC5hYnMoc3RhcnR5IC0gZW5keSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgc2hpcCBsZW5ndGggdmFsaWRpdHlcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYWxsb3dlZExlbmd0aHMuZmluZCgob2JqKSA9PiBvYmoubnVtYmVyID09PSBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmoucmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IGNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBzaGlwIHJlZmVyZW5jZXMgdG8gdGhlIGdyaWRcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttaW5YLCBtYXhYXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbihzdGFydHgsIGVuZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHN0YXJ0eCwgZW5keCksXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW21pblksIG1heFldID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0eSwgZW5keSksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoc3RhcnR5LCBlbmR5KSxcclxuICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBwbGFjZWRTaGlwcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvYmoucmVtYWluaW5nIC09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xyXG4gICAgICAgICAgICBpZiAoW3gsIHldLnNvbWUoKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBncmlkW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgLy8gRHVwbGljYXRlIGF0dGFja1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSB0aWxlcy5NSVNTIHx8IHNxdWFyZSA9PT0gdGlsZXMuSElUKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbHJlYWR5IGF0dGFja2VkIHRoaXMgc3F1YXJlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNaXNzXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IHRpbGVzLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gdGlsZXMuTUlTUztcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhpdFxyXG4gICAgICAgICAgICBwbGFjZWRTaGlwc1tzcXVhcmVdLmhpdCgpO1xyXG4gICAgICAgICAgICBncmlkW3hdW3ldID0gdGlsZXMuSElUO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXNGbGVldFN1bmsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWRTaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R3JpZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdyaWQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XHJcblxyXG5jb25zdCBjcmVhdGVIdW1hblBsYXllciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGh1bWFuUGxheWVyID0gY3JlYXRlUGxheWVyKCk7XHJcbiAgICBodW1hblBsYXllci5wcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbiAgICByZXR1cm4gaHVtYW5QbGF5ZXI7XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVIdW1hblBsYXllciB9O1xyXG4iLCJjb25zdCBjcmVhdGVQbGF5ZXIgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByb3ZpZGVBdHRhY2tDb29yZGluYXRlcygpIHtcclxuICAgICAgICAgICAgLy8gVG8gYmUgb3ZlcnJpZGRlbiBieSBzdWJjbGFzc1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlUGxheWVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZVNoaXAgPSAoc2hpcExlbmd0aCkgPT4ge1xyXG4gICAgLy8gRXJyb3IgY2hlY2tpbmdcclxuICAgIGlmICh0eXBlb2Ygc2hpcExlbmd0aCAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihzaGlwTGVuZ3RoKSB8fCBzaGlwTGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcclxuICAgIGxldCBoaXRzID0gMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENoZWNrcyB3aGV0aGVyIHRoZSBzaGlwIGhhcyBtb3JlIGhpdHMgdGhhbiBsaXZlc1xyXG4gICAgICAgIGlzU3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhpdHMgPj0gbGVuZ3RoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBkYW1hZ2FlIHRvIHRoZSBzaGlwIGFuZCBjaGVjayBmb3Igc2lua2luZ1xyXG4gICAgICAgIGhpdCgpIHtcclxuICAgICAgICAgICAgaGl0cyArPSAxO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlU2hpcCB9O1xyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XHJcbiAgICAtLWdyaWQtcGFkZGluZzogMnB4O1xyXG59XHJcblxyXG4vKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogR2VuZXJhbCBTdHlsaW5nXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuKiB7XHJcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gICAgcGFkZGluZzogMDtcclxufVxyXG5cclxuYm9keSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIHBhZGRpbmctdG9wOiAycmVtXHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZ2FwOiAycmVtO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xyXG5cclxuICAgIHdpZHRoOiBjYWxjKDMwcmVtICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG4gICAgaGVpZ2h0OiBjYWxjKDMwcmVtICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG5cclxuICAgIHBhZGRpbmc6IDJweDtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uZm9jdXNlZC1ib2FyZCB7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi51bmZvY3VzZWQtYm9hcmQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XHJcbn1cclxuXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogM3JlbTtcclxuICAgIGhlaWdodDogM3JlbTtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtBQUN2Qjs7QUFFQTs7OztFQUlFO0FBQ0Y7SUFDSSxzQkFBc0I7SUFDdEIsU0FBUztJQUNULFVBQVU7QUFDZDs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QjtBQUNKOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7O0lBRVQseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHlCQUF5Qjs7SUFFekIsbUZBQW1GO0lBQ25GLG9GQUFvRjs7SUFFcEYsWUFBWTs7SUFFWix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxlQUFlO0FBQ25COztBQUVBO0lBQ0ksMkJBQTJCO0lBQzNCLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixXQUFXO0lBQ1gsWUFBWTs7SUFFWix5QkFBeUI7QUFDN0JcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcclxcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcXHJcXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcXHJcXG59XFxyXFxuXFxyXFxuLypcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKiBHZW5lcmFsIFN0eWxpbmdcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKi9cXHJcXG4qIHtcXHJcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG5ib2R5IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIHBhZGRpbmctdG9wOiAycmVtXFxyXFxufVxcclxcblxcclxcbi5ib2FyZC1kaXNwbGF5IHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGdhcDogMnJlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWUtYm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xcclxcblxcclxcbiAgICB3aWR0aDogY2FsYygzMHJlbSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG4gICAgaGVpZ2h0OiBjYWxjKDMwcmVtICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcblxcclxcbiAgICBwYWRkaW5nOiAycHg7XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwO1xcclxcbn1cXHJcXG5cXHJcXG4udW5mb2N1c2VkLWJvYXJkIHtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXAtcmV2ZXJzZTtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQtY2VsbCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICB3aWR0aDogM3JlbTtcXHJcXG4gICAgaGVpZ2h0OiAzcmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xyXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xyXG5cclxuY3JlYXRlR2FtZUhhbmRsZXIoKTtcclxuIl0sIm5hbWVzIjpbIkJPQVJEX1dJRFRIIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlQ29tcHV0ZXJQbGF5ZXIiLCJyb2JvdFBsYXllciIsInBvc3NpYmxlQXR0YWNrcyIsIngiLCJ5IiwicHVzaCIsInByb3ZpZGVBdHRhY2tDb29yZGluYXRlcyIsImF0dGFja051bWJlciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsImF0dGFjayIsInNwbGljZSIsIlBMQVlFUl8xX0JPQVJEX0lEIiwiUExBWUVSXzJfQk9BUkRfSUQiLCJjcmVhdGVET01IYW5kbGVyIiwicGxheWVyMUJvYXJkIiwicGxheWVyMkJvYXJkIiwiY3JlYXRlR3JpZERpc3BsYXkiLCJncmlkIiwiaWQiLCJib2FyZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImZvckVhY2giLCJyb3ciLCJjZWxsIiwiZ3JpZENlbGwiLCJzZXRBdHRyaWJ1dGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwicXVlcnlTZWxlY3RvciIsInByZXBlbmQiLCJyZW5kZXJJbml0aWFsQm9hcmQiLCJwbGF5ZXIxR3JpZCIsInBsYXllcjJHcmlkIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlSHVtYW5QbGF5ZXIiLCJjcmVhdGVHYW1lSGFuZGxlciIsImRvbUhhbmRsZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsInBsYWNlU2hpcCIsImdldEdyaWQiLCJjcmVhdGVTaGlwIiwiTUFYX1NISVBTIiwidGlsZXMiLCJXQVRFUiIsIk1JU1MiLCJISVQiLCJhbGxvd2VkTGVuZ3RocyIsIm51bWJlciIsInJlbWFpbmluZyIsIkFycmF5IiwiZnJvbSIsImZpbGwiLCJwbGFjZWRTaGlwcyIsImlzVmFsaWRDb29yZHMiLCJzdGFydHgiLCJzdGFydHkiLCJlbmR4IiwiZW5keSIsInNvbWUiLCJjb29yZCIsIl9yZWYiLCJFcnJvciIsInNoaXBMZW5ndGgiLCJtYXgiLCJhYnMiLCJvYmoiLCJmaW5kIiwidW5kZWZpbmVkIiwibmV3U2hpcCIsIm1pblgiLCJtYXhYIiwibWluIiwibWluWSIsIm1heFkiLCJlcnJvciIsInJlY2VpdmVBdHRhY2siLCJfcmVmMiIsInNxdWFyZSIsImhpdCIsImlzRmxlZXRTdW5rIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwiaHVtYW5QbGF5ZXIiLCJpc05hTiIsImhpdHMiXSwic291cmNlUm9vdCI6IiJ9