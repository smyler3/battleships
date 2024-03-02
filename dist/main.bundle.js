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
/* harmony export */   MAX_SHIPS: () => (/* binding */ MAX_SHIPS),
/* harmony export */   PLAYER_1_BOARD_ID: () => (/* binding */ PLAYER_1_BOARD_ID),
/* harmony export */   PLAYER_2_BOARD_ID: () => (/* binding */ PLAYER_2_BOARD_ID),
/* harmony export */   TILES: () => (/* binding */ TILES),
/* harmony export */   TILE_CLASSES: () => (/* binding */ TILE_CLASSES)
/* harmony export */ });
const BOARD_WIDTH = 10;
const PLAYER_1_BOARD_ID = "player1Board";
const PLAYER_2_BOARD_ID = "player2Board";
const MAX_SHIPS = 5;
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

  // Event for selecting a cell on the board and returning it's coordinates
  const selectCellEvent = (gridCell, resolve) => {
    const cellCoordinates = [gridCell.getAttribute("data-x"), gridCell.getAttribute("data-y")];
    resolve(cellCoordinates);
    disableAttackCellSelection();
  };

  // Event for selecting the start cell when placing a ship
  const selectShipStartEvent = (gridCell, resolve) => {
    gridCell.classList.add("ship-start");
    selectCellEvent(gridCell, resolve);
  };

  // Create a copy of a player's grid to display relevant game information to the player
  function createGridDisplay(grid, id) {
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
  function disableAttackCellSelection() {
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

  // Determines whether a given set of points are valid to have a ship placed between them
  function validEndPoint(_ref, _ref2, allowedLengths) {
    let [startX, startY] = _ref;
    let [endX, endY] = _ref2;
    // Same co-ordinate
    if (startX === endX && startY === endY) {
      return false;
    }
    let length = null;
    let start = null;
    let end = null;
    if (startX === endX) {
      // Checking for any remaining ships of valid length to bridge these points
      length = allowedLengths.find(obj => obj.number === Math.abs(startY - endY) + 1);

      // Checking for ships between the points
      start = Math.min(startY, endY);
      end = Math.max(startY, endY);
      for (let y = start; y < end + 1; y += 1) {
        const cell = document.querySelector(`.grid-cell[data-x="${startX}"][data-y="${y}"]`);

        // Ship between the points
        if (cell.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP)) {
          return false;
        }
      }
    } else if (startY === endY) {
      // Checking for any remaining ships of valid length to bridge these points
      length = allowedLengths.find(obj => obj.number === Math.abs(startX - endX) + 1);

      // Checking for ships between the points
      start = Math.min(startX, endX);
      end = Math.max(startX, endX);
      for (let x = start; x < end + 1; x += 1) {
        const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${startY}"]`);

        // Ship between the points
        if (cell.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP)) {
          return false;
        }
      }
    }

    // Valid coordinates
    if (length && length.remaining > 0) {
      return true;
    }
    return false;
  }

  // Removes all ship placement indicators from the board for greater clarity
  function wipeShipPlacementIndicators() {
    // Remove ship start square indicator
    document.querySelectorAll(`.grid-cell[class*="ship-start"]`).forEach(cell => {
      cell.classList.remove("ship-start");
    });

    // Remove potential ship end square indicators
    document.querySelectorAll(`.grid-cell[class*="potential-ship-end"]`).forEach(cell => {
      cell.classList.remove("potential-ship-end");
    });
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
    // Make all possible start positions for ships selectable
    async enableShipStartPositionSelection() {
      return new Promise(resolve => {
        Array.from(activeBoard.childNodes).forEach(cell => {
          if (!cell.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP)) {
            // Make selectable by click
            cell.addEventListener("click", () => selectShipStartEvent(cell, resolve));
            cell.classList.add("clickable");
          }
        });
      });
    },
    // Make all possible end positions for ships selectable
    async enableShipEndPositionSelection(startPos, allowedLengths) {
      return new Promise(resolve => {
        Array.from(activeBoard.childNodes).forEach(cell => {
          if (!cell.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP) && validEndPoint(startPos, [cell.getAttribute("data-x"), cell.getAttribute("data-y")], allowedLengths)) {
            // Make selectable by click
            cell.addEventListener("click", () => selectCellEvent(cell, resolve));
            cell.classList.add("potential-ship-end");
            cell.classList.add("clickable");
          }
        });
      });
    },
    // Add a placed ship to the board
    placeShip(_ref3, _ref4) {
      let [startX, startY] = _ref3;
      let [endX, endY] = _ref4;
      let start = null;
      let end = null;

      // Placing ship tiles along the y-axis
      if (startX === endX) {
        start = Math.min(startY, endY);
        end = Math.max(startY, endY);
        for (let y = start; y < end + 1; y += 1) {
          const cell = document.querySelector(`.grid-cell[data-x="${startX}"][data-y="${y}"]`);
          cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
          cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
        }
      }
      // Placing ship tiles along the x-axis
      else {
        start = Math.min(startX, endX);
        end = Math.max(startX, endX);
        for (let x = start; x < end + 1; x += 1) {
          const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${startY}"]`);
          cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
          cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
        }
      }
      wipeShipPlacementIndicators();
    },
    // Make all attackable cells on opponent's board selectable for attacks
    async enableAttackSelection() {
      return new Promise(resolve => {
        Array.from(activeBoard.childNodes).forEach(cell => {
          if (
          // Tile hasn't already been attacked
          ![_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.HIT, _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.MISS].some(tileType => cell.classList.contains(tileType))) {
            // Make selectable by click
            cell.addEventListener("click", () => selectCellEvent(cell, resolve));
            cell.classList.add("clickable");
          }
        });
      });
    },
    // Alter the board to reflect an attack
    receiveAttack(_ref5, hit) {
      let [x, y] = _ref5;
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
    displayShipPlacePrompt(shipsRemaining) {
      messageBanner.textContent = `Place a ship, ${shipsRemaining} ships remaining`;
    },
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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/constants.js");





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
      // player1Board.placeShip([
      //     [3, 3],
      //     [7, 3],
      // ]);
      // player1Board.placeShip([
      //     [3, 4],
      //     [6, 4],
      // ]);
      // player1Board.placeShip([
      //     [3, 5],
      //     [5, 5],
      // ]);
      // player1Board.placeShip([
      //     [3, 6],
      //     [5, 6],
      // ]);
      // player1Board.placeShip([
      //     [3, 7],
      //     [4, 7],
      // ]);

      // Place ships player 2
      player2Board.placeShip([[9, 9], [5, 9]]);
      player2Board.placeShip([[9, 8], [6, 8]]);
      player2Board.placeShip([[9, 7], [7, 7]]);
      player2Board.placeShip([[9, 6], [7, 6]]);
      player2Board.placeShip([[9, 5], [8, 5]]);
      boardHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid());
    },
    //
    async setupShips() {
      let placed = 0;
      while (placed < _constants__WEBPACK_IMPORTED_MODULE_4__.MAX_SHIPS) {
        messageHandler.displayShipPlacePrompt(_constants__WEBPACK_IMPORTED_MODULE_4__.MAX_SHIPS - placed);

        // Wait for ship start and end positions
        let startPos = await boardHandler.enableShipStartPositionSelection();
        let endPos = await boardHandler.enableShipEndPositionSelection(startPos, player1Board.getAllowedLengths());

        // Try placing a ship at those coordinates
        try {
          player1Board.placeShip([startPos, endPos]);
          boardHandler.placeShip(startPos, endPos);
          placed += 1;
        } catch {
          // If coordinates invalid, ask again
        }
      }
      boardHandler.flipBoards();
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
            attack = await boardHandler.enableAttackCellSelection();
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
    },
    getAllowedLengths() {
      return allowedLengths;
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

.ship-start {
    background-color: greenyellow;
}

.potential-ship-end {
    background-color: green;
}

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
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;AAClC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,eAAe;AACnB;;AAEA;IACI,2BAA2B;IAC3B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;AACjC;;AAEA;IACI,eAAe;AACnB;AACA;IACI,kCAAkC;AACtC;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,qBAAqB;IACrB,iBAAiB;;IAEjB,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 2rem;\r\n\r\n    --banner-background: #00000099;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.focused-board {\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.unfocused-board {\r\n    flex-direction: row-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n}\r\n.clickable:hover {\r\n    background-color: rgb(0, 183, 255);\r\n}\r\n\r\n.water-cell {\r\n    background-color: aqua;\r\n}\r\n\r\n.ship-cell {\r\n    background-color: grey;\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n.ship-start {\r\n    background-color: greenyellow;\r\n}\r\n\r\n.potential-ship-end {\r\n    background-color: green;\r\n}\r\n\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    margin-bottom: 1.5rem;\r\n    padding: 1.5rem 0;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
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


async function main() {
  const battleShips = (0,_gameHandler__WEBPACK_IMPORTED_MODULE_0__.createGameHandler)();
  battleShips.setupGame();
  await battleShips.setupShips();
  battleShips.playGame();
}
main();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBa0Q7QUFDN0I7QUFFckIsZUFBZUMsSUFBSUEsQ0FBQSxFQUFHO0VBQ2xCLE1BQU1DLFdBQVcsR0FBR3RELCtEQUFpQixDQUFDLENBQUM7RUFDdkNzRCxXQUFXLENBQUMvQyxTQUFTLENBQUMsQ0FBQztFQUN2QixNQUFNK0MsV0FBVyxDQUFDN0MsVUFBVSxDQUFDLENBQUM7RUFDOUI2QyxXQUFXLENBQUN6QyxRQUFRLENBQUMsQ0FBQztBQUMxQjtBQUVBd0MsSUFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbUJvYXJkSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZG9tTWVzc2FnZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJPQVJEX1dJRFRIID0gMTA7XHJcbmNvbnN0IFBMQVlFUl8xX0JPQVJEX0lEID0gXCJwbGF5ZXIxQm9hcmRcIjtcclxuY29uc3QgUExBWUVSXzJfQk9BUkRfSUQgPSBcInBsYXllcjJCb2FyZFwiO1xyXG5jb25zdCBNQVhfU0hJUFMgPSA1O1xyXG5cclxuY29uc3QgVElMRVMgPSB7XHJcbiAgICBXQVRFUjogXCJXXCIsXHJcbiAgICBNSVNTOiBcIk9cIixcclxuICAgIEhJVDogXCJYXCIsXHJcbn07XHJcblxyXG5jb25zdCBUSUxFX0NMQVNTRVMgPSB7XHJcbiAgICBXQVRFUjogXCJ3YXRlci1jZWxsXCIsXHJcbiAgICBNSVNTOiBcIm1pc3MtY2VsbFwiLFxyXG4gICAgSElUOiBcImhpdC1jZWxsXCIsXHJcbiAgICBTSElQOiBcInNoaXAtY2VsbFwiLFxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPQVJEX1dJRFRILFxyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIE1BWF9TSElQUyxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlRE9NQm9hcmRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgbGV0IGJvYXJkRGlzcGxheSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIyQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IGFjdGl2ZUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICAvLyBFdmVudCBmb3Igc2VsZWN0aW5nIGEgY2VsbCBvbiB0aGUgYm9hcmQgYW5kIHJldHVybmluZyBpdCdzIGNvb3JkaW5hdGVzXHJcbiAgICBjb25zdCBzZWxlY3RDZWxsRXZlbnQgPSAoZ3JpZENlbGwsIHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBjZWxsQ29vcmRpbmF0ZXMgPSBbXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSxcclxuICAgICAgICAgICAgZ3JpZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHJlc29sdmUoY2VsbENvb3JkaW5hdGVzKTtcclxuICAgICAgICBkaXNhYmxlQXR0YWNrQ2VsbFNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBFdmVudCBmb3Igc2VsZWN0aW5nIHRoZSBzdGFydCBjZWxsIHdoZW4gcGxhY2luZyBhIHNoaXBcclxuICAgIGNvbnN0IHNlbGVjdFNoaXBTdGFydEV2ZW50ID0gKGdyaWRDZWxsLCByZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXAtc3RhcnRcIik7XHJcbiAgICAgICAgc2VsZWN0Q2VsbEV2ZW50KGdyaWRDZWxsLCByZXNvbHZlKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiBhIHBsYXllcidzIGdyaWQgdG8gZGlzcGxheSByZWxldmFudCBnYW1lIGluZm9ybWF0aW9uIHRvIHRoZSBwbGF5ZXJcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUdyaWREaXNwbGF5KGdyaWQsIGlkKSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBib2FyZC5pZCA9IGlkO1xyXG4gICAgICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgZ3JpZCBjZWxscyB3aXRoIGNlbGwgaW5mb3JtYXRpb24gc3RvcmVkIGFuZCBkaXNwbGF5ZWRcclxuICAgICAgICBncmlkLmZvckVhY2goKHJvdywgeCkgPT4ge1xyXG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoXywgeSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JpZENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNlbGxcIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiwgeCk7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiwgeSk7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBsYXllci1pZFwiLCBpZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoZ3JpZENlbGwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYm9hcmREaXNwbGF5LnByZXBlbmQoYm9hcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhYmlsaXR5IHRvIGF0dGFjayBjZWxscyBvbiBvcHBvbmVudCdzIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBkaXNhYmxlQXR0YWNrQ2VsbFNlbGVjdGlvbigpIHtcclxuICAgICAgICAvLyBDbG9uZSB0aGUgcGFyZW50IG5vZGUgdG8gcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICBjb25zdCBjbG9uZWRCb2FyZCA9IGFjdGl2ZUJvYXJkLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICBib2FyZERpc3BsYXkucmVwbGFjZUNoaWxkKGNsb25lZEJvYXJkLCBhY3RpdmVCb2FyZCk7XHJcblxyXG4gICAgICAgIC8vIFVwZGF0ZSByZWZlcmVuY2VzXHJcbiAgICAgICAgaWYgKGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQpIHtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjdGl2ZUJvYXJkID0gY2xvbmVkQm9hcmQ7XHJcblxyXG4gICAgICAgIGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gc2V0IG9mIHBvaW50cyBhcmUgdmFsaWQgdG8gaGF2ZSBhIHNoaXAgcGxhY2VkIGJldHdlZW4gdGhlbVxyXG4gICAgZnVuY3Rpb24gdmFsaWRFbmRQb2ludChbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV0sIGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgLy8gU2FtZSBjby1vcmRpbmF0ZVxyXG4gICAgICAgIGlmIChzdGFydFggPT09IGVuZFggJiYgc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBudWxsO1xyXG4gICAgICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICAgICAgbGV0IGVuZCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChzdGFydFggPT09IGVuZFgpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIGFueSByZW1haW5pbmcgc2hpcHMgb2YgdmFsaWQgbGVuZ3RoIHRvIGJyaWRnZSB0aGVzZSBwb2ludHNcclxuICAgICAgICAgICAgbGVuZ3RoID0gYWxsb3dlZExlbmd0aHMuZmluZChcclxuICAgICAgICAgICAgICAgIChvYmopID0+IG9iai5udW1iZXIgPT09IE1hdGguYWJzKHN0YXJ0WSAtIGVuZFkpICsgMSxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBzaGlwcyBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFksIGVuZFkpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0OyB5IDwgZW5kICsgMTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3N0YXJ0WH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydFkgPT09IGVuZFkpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIGFueSByZW1haW5pbmcgc2hpcHMgb2YgdmFsaWQgbGVuZ3RoIHRvIGJyaWRnZSB0aGVzZSBwb2ludHNcclxuICAgICAgICAgICAgbGVuZ3RoID0gYWxsb3dlZExlbmd0aHMuZmluZChcclxuICAgICAgICAgICAgICAgIChvYmopID0+IG9iai5udW1iZXIgPT09IE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpICsgMSxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBzaGlwcyBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydFgsIGVuZFgpO1xyXG4gICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7c3RhcnRZfVwiXWAsXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBWYWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgIGlmIChsZW5ndGggJiYgbGVuZ3RoLnJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlcyBhbGwgc2hpcCBwbGFjZW1lbnQgaW5kaWNhdG9ycyBmcm9tIHRoZSBib2FyZCBmb3IgZ3JlYXRlciBjbGFyaXR5XHJcbiAgICBmdW5jdGlvbiB3aXBlU2hpcFBsYWNlbWVudEluZGljYXRvcnMoKSB7XHJcbiAgICAgICAgLy8gUmVtb3ZlIHNoaXAgc3RhcnQgc3F1YXJlIGluZGljYXRvclxyXG4gICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1jZWxsW2NsYXNzKj1cInNoaXAtc3RhcnRcIl1gKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwic2hpcC1zdGFydFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBwb3RlbnRpYWwgc2hpcCBlbmQgc3F1YXJlIGluZGljYXRvcnNcclxuICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtY2VsbFtjbGFzcyo9XCJwb3RlbnRpYWwtc2hpcC1lbmRcIl1gKVxyXG4gICAgICAgICAgICAuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwicG90ZW50aWFsLXNoaXAtZW5kXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgcmVuZGVyIGRpc3BsYXkgb2YgYm90aCBwbGF5ZXJzIGJvYXJkc1xyXG4gICAgICAgIHJlbmRlckluaXRpYWxCb2FyZChwbGF5ZXIxR3JpZCwgcGxheWVyMkdyaWQpIHtcclxuICAgICAgICAgICAgYm9hcmREaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib2FyZC1kaXNwbGF5XCIpO1xyXG5cclxuICAgICAgICAgICAgY3JlYXRlR3JpZERpc3BsYXkocGxheWVyMUdyaWQsIFBMQVlFUl8xX0JPQVJEX0lEKTtcclxuICAgICAgICAgICAgY3JlYXRlR3JpZERpc3BsYXkocGxheWVyMkdyaWQsIFBMQVlFUl8yX0JPQVJEX0lEKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke1BMQVlFUl8xX0JPQVJEX0lEfWApO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMl9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPSBwbGF5ZXIyQm9hcmQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQb3NpdGlvbiBwbGF5ZXIgMSdzIGJvYXJkIGZhY2luZyBzY3JlZW5cclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJmb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LmFkZChcInVuZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBGbGlwIHRoZSByZW5kZXJlZCBib2FyZCBkaXNwbGF5XHJcbiAgICAgICAgZmxpcEJvYXJkcygpIHtcclxuICAgICAgICAgICAgLy8gRmxpcCBwbGF5ZXIgMSBib2FyZCBjZWxsc1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmxpcCBwbGF5ZXIgMiBib2FyZCBjZWxsc1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LnRvZ2dsZShcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3dpdGNoIGJvYXJkIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICBib2FyZERpc3BsYXkucHJlcGVuZChib2FyZERpc3BsYXkubGFzdENoaWxkKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBwb3NzaWJsZSBzdGFydCBwb3NpdGlvbnMgZm9yIHNoaXBzIHNlbGVjdGFibGVcclxuICAgICAgICBhc3luYyBlbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFNoaXBTdGFydEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIHBvc3NpYmxlIGVuZCBwb3NpdGlvbnMgZm9yIHNoaXBzIHNlbGVjdGFibGVcclxuICAgICAgICBhc3luYyBlbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24oc3RhcnRQb3MsIGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShhY3RpdmVCb2FyZC5jaGlsZE5vZGVzKS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkRW5kUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvd2VkTGVuZ3RocyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicG90ZW50aWFsLXNoaXAtZW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBhIHBsYWNlZCBzaGlwIHRvIHRoZSBib2FyZFxyXG4gICAgICAgIHBsYWNlU2hpcChbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV0pIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGVuZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHktYXhpc1xyXG4gICAgICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0WSwgZW5kWSk7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFksIGVuZFkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHkgPSBzdGFydDsgeSA8IGVuZCArIDE7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3N0YXJ0WH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFRJTEVfQ0xBU1NFUy5TSElQKTtcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoVElMRV9DTEFTU0VTLldBVEVSKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHgtYXhpc1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHtzdGFydFl9XCJdYCxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoVElMRV9DTEFTU0VTLlNISVApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3aXBlU2hpcFBsYWNlbWVudEluZGljYXRvcnMoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBhdHRhY2thYmxlIGNlbGxzIG9uIG9wcG9uZW50J3MgYm9hcmQgc2VsZWN0YWJsZSBmb3IgYXR0YWNrc1xyXG4gICAgICAgIGFzeW5jIGVuYWJsZUF0dGFja1NlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbGUgaGFzbid0IGFscmVhZHkgYmVlbiBhdHRhY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhW1RJTEVfQ0xBU1NFUy5ISVQsIFRJTEVfQ0xBU1NFUy5NSVNTXS5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRpbGVUeXBlKSA9PiBjZWxsLmNsYXNzTGlzdC5jb250YWlucyh0aWxlVHlwZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzZWxlY3RhYmxlIGJ5IGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDZWxsRXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWx0ZXIgdGhlIGJvYXJkIHRvIHJlZmxlY3QgYW4gYXR0YWNrXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhbeCwgeV0sIGhpdCkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdW2RhdGEtcGxheWVyLWlkPVwiJHthY3RpdmVCb2FyZC5pZH1cIl1gLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgYXR0YWNrZWRDZWxsLnRleHRDb250ZW50ID0gaGl0ID8gVElMRVMuSElUIDogVElMRVMuV0FURVI7XHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LmFkZChcclxuICAgICAgICAgICAgICAgIGhpdCA/IFRJTEVfQ0xBU1NFUy5ISVQgOiBUSUxFX0NMQVNTRVMuTUlTUyxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDaGFuZ2Ugd2hpY2ggYm9hcmQgaXMgYWN0aXZlXHJcbiAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID1cclxuICAgICAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVET01Cb2FyZEhhbmRsZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAvLyBDcmVhdGUgbWVzc2FnZSBiYW5uZXJcclxuICAgIC8vIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIC8vIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJtb2RhbFwiKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VCYW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZUJhbm5lci5jbGFzc0xpc3QuYWRkKFwibWVzc2FnZS1iYW5uZXJcIik7XHJcbiAgICAvLyBtb2RhbC5hcHBlbmRDaGlsZChtZXNzYWdlQmFubmVyKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLnByZXBlbmQobWVzc2FnZUJhbm5lcik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkaXNwbGF5U2hpcFBsYWNlUHJvbXB0KHNoaXBzUmVtYWluaW5nKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBgUGxhY2UgYSBzaGlwLCAke3NoaXBzUmVtYWluaW5nfSBzaGlwcyByZW1haW5pbmdgO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlDdXJyZW50VHVybihwbGF5ZXJUdXJuID0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gcGxheWVyVHVyblxyXG4gICAgICAgICAgICAgICAgPyBcIllvdXIgdHVybiEgTWFrZSBhbiBhdHRhY2tcIlxyXG4gICAgICAgICAgICAgICAgOiBgT3Bwb25lbnQgVHVybiEgTWFraW5nIGFuIGF0dGFja2A7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheUF0dGFja1Jlc3VsdChoaXQpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IGhpdCA/IFwiU2hpcCBoaXQhXCIgOiBcIlNob3QgbWlzc2VkIVwiO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlXaW5uZXIobmFtZSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gYFZpY3RvcnkgZm9yICR7bmFtZX0hYDtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IGNyZWF0ZVBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVET01Cb2FyZEhhbmRsZXIgfSBmcm9tIFwiLi9kb21Cb2FyZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyIH0gZnJvbSBcIi4vZG9tTWVzc2FnZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTUFYX1NISVBTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHN3aXRjaEFjdGl2ZVBsYXllcigpIHtcclxuICAgICAgICBhY3RpdmVQbGF5ZXIgPSBhY3RpdmVQbGF5ZXIgPT09IHBsYXllcjEgPyBwbGF5ZXIyIDogcGxheWVyMTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVCb2FyZCgpIHtcclxuICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJvYXJkSGFuZGxlciA9IG51bGw7XHJcbiAgICBsZXQgbWVzc2FnZUhhbmRsZXIgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIxID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIyID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIyQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBhY3RpdmVQbGF5ZXIgPSBudWxsO1xyXG4gICAgbGV0IGFjdGl2ZUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNldHVwR2FtZSgpIHtcclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyID0gY3JlYXRlRE9NQm9hcmRIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyID0gY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjEgPSBjcmVhdGVQbGF5ZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjIgPSBjcmVhdGVQbGF5ZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGNyZWF0ZUdhbWVib2FyZCgpO1xyXG5cclxuICAgICAgICAgICAgYWN0aXZlUGxheWVyID0gcGxheWVyMTtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPSBwbGF5ZXIyQm9hcmQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMVxyXG4gICAgICAgICAgICAvLyBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFszLCAzXSxcclxuICAgICAgICAgICAgLy8gICAgIFs3LCAzXSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAvLyAgICAgWzMsIDRdLFxyXG4gICAgICAgICAgICAvLyAgICAgWzYsIDRdLFxyXG4gICAgICAgICAgICAvLyBdKTtcclxuICAgICAgICAgICAgLy8gcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgIC8vICAgICBbMywgNV0sXHJcbiAgICAgICAgICAgIC8vICAgICBbNSwgNV0sXHJcbiAgICAgICAgICAgIC8vIF0pO1xyXG4gICAgICAgICAgICAvLyBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFszLCA2XSxcclxuICAgICAgICAgICAgLy8gICAgIFs1LCA2XSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAvLyAgICAgWzMsIDddLFxyXG4gICAgICAgICAgICAvLyAgICAgWzQsIDddLFxyXG4gICAgICAgICAgICAvLyBdKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBsYWNlIHNoaXBzIHBsYXllciAyXHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDldLFxyXG4gICAgICAgICAgICAgICAgWzUsIDldLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgOF0sXHJcbiAgICAgICAgICAgICAgICBbNiwgOF0sXHJcbiAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgICAgIFs5LCA3XSxcclxuICAgICAgICAgICAgICAgIFs3LCA3XSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAgICAgWzksIDZdLFxyXG4gICAgICAgICAgICAgICAgWzcsIDZdLFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgICAgICBbOSwgNV0sXHJcbiAgICAgICAgICAgICAgICBbOCwgNV0sXHJcbiAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnJlbmRlckluaXRpYWxCb2FyZChcclxuICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5nZXRHcmlkKCksXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgYXN5bmMgc2V0dXBTaGlwcygpIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZCA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAocGxhY2VkIDwgTUFYX1NISVBTKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5U2hpcFBsYWNlUHJvbXB0KE1BWF9TSElQUyAtIHBsYWNlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3Igc2hpcCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID1cclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlU2hpcFN0YXJ0UG9zaXRpb25TZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIGxldCBlbmRQb3MgPSBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlU2hpcEVuZFBvc2l0aW9uU2VsZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5nZXRBbGxvd2VkTGVuZ3RocygpLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUcnkgcGxhY2luZyBhIHNoaXAgYXQgdGhvc2UgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbc3RhcnRQb3MsIGVuZFBvc10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5wbGFjZVNoaXAoc3RhcnRQb3MsIGVuZFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VkICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBjb29yZGluYXRlcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLmZsaXBCb2FyZHMoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWluIGdhbWUgbG9vcFxyXG4gICAgICAgIGFzeW5jIHBsYXlHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZ2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHR1cm5cIik7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5Q3VycmVudFR1cm4oIWFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWxpZEF0dGFjayA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICghdmFsaWRBdHRhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0YWNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGl0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGNvbXB1dGVyIHBsYXllciBtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhdXNlIHRvIHNpbXVsYXRlIGNvbXB1dGVyIHRoaW5raW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBjb21wdXRlciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGFjdGl2ZVBsYXllci5wcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBodW1hbiBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgaHVtYW4gcGxheWVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZUF0dGFja0NlbGxTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0aGF0IGF0dGFjayBvbiBvcHBvbmVudCBib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdCA9IGFjdGl2ZUJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnJlY2VpdmVBdHRhY2soYXR0YWNrLCBoaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZEF0dGFjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlBdHRhY2tSZXN1bHQoaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYXR0YWNrIGlzIGludmFsaWQsIGFzayBhZ2FpblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHJlZ2lzdGVyIGl0IGFuZCB0aGVuIGF3YWl0IGlucHV0IGZyb20gb3RoZXIgcGxheWVyXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQm9hcmQuaXNGbGVldFN1bmsoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdhbWUgb3ZlclxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5V2lubmVyKFwiUGxheWVyIDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBwbGF5ZXIgdHVybnNcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZVBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gYm9hcmRIYW5kbGVyLmZsaXBCb2FyZHMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfTtcclxuIiwiaW1wb3J0IHsgQk9BUkRfV0lEVEgsIFRJTEVTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBNQVhfU0hJUFMgPSA1O1xyXG5cclxuICAgIGNvbnN0IGFsbG93ZWRMZW5ndGhzID0gW1xyXG4gICAgICAgIHsgbnVtYmVyOiAyLCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogMywgcmVtYWluaW5nOiAyIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDQsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA1LCByZW1haW5pbmc6IDEgfSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgZ3JpZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0sICgpID0+IHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogQk9BUkRfV0lEVEggfSkuZmlsbChUSUxFUy5XQVRFUik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwbGFjZWRTaGlwcyA9IFtdO1xyXG5cclxuICAgIC8vIENoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gcGFpciBvZiBjb29yZGluYXRlcyBpcyB2YWxpZCBmb3IgcGxhY2luZyBhIHNoaXBcclxuICAgIGZ1bmN0aW9uIGlzVmFsaWRDb29yZHMoc3RhcnR4LCBzdGFydHksIGVuZHgsIGVuZHkpIHtcclxuICAgICAgICAvLyBTaGlwIHBsYWNlZCBvZmYgdGhlIGJvYXJkXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBbc3RhcnR4LCBzdGFydHksIGVuZHgsIGVuZHldLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAoY29vcmQpID0+IGNvb3JkIDwgMCB8fCBjb29yZCA+PSBCT0FSRF9XSURUSCxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaGlwIHBsYWNlZCBkaWFnb25hbGx5XHJcbiAgICAgICAgaWYgKHN0YXJ0eCAhPT0gZW5keCAmJiBzdGFydHkgIT09IGVuZHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNoaXBzIGFscmVhZHkgaW4gdGhlIGdyaWRcclxuICAgICAgICBmb3IgKGxldCB4ID0gc3RhcnR4OyB4IDw9IGVuZHg7IHggKz0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gc3RhcnR5OyB5IDw9IGVuZHk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hpcCBhbHJlYWR5IHBsYWNlZCB0aGVyZVxyXG4gICAgICAgICAgICAgICAgaWYgKGdyaWRbeF1beV0gIT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIFBsYWNlIGEgc2hpcCBvbiB0aGUgZ2FtZSBib2FyZCBiYXNlZCBvbiBzdGFydCBhbmQgZW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgcGxhY2VTaGlwKFtbc3RhcnR4LCBzdGFydHldLCBbZW5keCwgZW5keV1dKSB7XHJcbiAgICAgICAgICAgIC8vIE1heCBzaGlwcyBhbHJlYWR5IHBsYWNlZFxyXG4gICAgICAgICAgICBpZiAocGxhY2VkU2hpcHMubGVuZ3RoID49IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hpcCBjYXBhY2l0eSByZWFjaGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJbnZhbGlkIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZENvb3JkcyhzdGFydHgsIHN0YXJ0eSwgZW5keCwgZW5keSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPVxyXG4gICAgICAgICAgICAgICAgMSArIE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0eCAtIGVuZHgpLCBNYXRoLmFicyhzdGFydHkgLSBlbmR5KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBzaGlwIGxlbmd0aCB2YWxpZGl0eVxyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBhbGxvd2VkTGVuZ3Rocy5maW5kKChvYmopID0+IG9iai5udW1iZXIgPT09IHNoaXBMZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iai5yZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTaGlwID0gY3JlYXRlU2hpcChzaGlwTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlZFNoaXBzLnB1c2gobmV3U2hpcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIHNoaXAgcmVmZXJlbmNlcyB0byB0aGUgZ3JpZFxyXG4gICAgICAgICAgICAgICAgY29uc3QgW21pblgsIG1heFhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXJ0eCwgZW5keCksXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoc3RhcnR4LCBlbmR4KSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBbbWluWSwgbWF4WV0gPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc3RhcnR5LCBlbmR5KSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLm1heChzdGFydHksIGVuZHkpLFxyXG4gICAgICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gbWluWDsgeCA8PSBtYXhYOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IHBsYWNlZFNoaXBzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG9iai5yZW1haW5pbmcgLT0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldKSB7XHJcbiAgICAgICAgICAgIGlmIChbeCwgeV0uc29tZSgoY29vcmQpID0+IGNvb3JkIDwgMCB8fCBjb29yZCA+PSBCT0FSRF9XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGdyaWRbeF1beV07XHJcblxyXG4gICAgICAgICAgICAvLyBEdXBsaWNhdGUgYXR0YWNrXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLk1JU1MgfHwgc3F1YXJlID09PSBUSUxFUy5ISVQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFscmVhZHkgYXR0YWNrZWQgdGhpcyBzcXVhcmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE1pc3NcclxuICAgICAgICAgICAgaWYgKHNxdWFyZSA9PT0gVElMRVMuV0FURVIpIHtcclxuICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5NSVNTO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGl0XHJcbiAgICAgICAgICAgIHBsYWNlZFNoaXBzW3NxdWFyZV0uaGl0KCk7XHJcbiAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5ISVQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpc0ZsZWV0U3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlZFNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHcmlkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbGxvd2VkTGVuZ3RocygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbG93ZWRMZW5ndGhzO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRIIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVQbGF5ZXIgPSAoaXNDb21wdXRlcikgPT4ge1xyXG4gICAgLy8gRmlsbCBhbiBhcnJheSB3aXRoIGFsbCBwb3NzaWJsZSBhdHRhY2tzIG9uIHRoZSBib2FyZFxyXG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9XSURUSDsgeCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBCT0FSRF9XSURUSDsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlQXR0YWNrcy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNDb21wdXRlcixcclxuXHJcbiAgICAgICAgcHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzKCkge1xyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmFuZG9tIGF0dGFja1xyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2tOdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYXR0YWNrIGZyb20gYWxsIHBvc3NpYmxlIGF0dGFja3MgYW5kIHJldHVybiBpdFxyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2sgPSBwb3NzaWJsZUF0dGFja3Muc3BsaWNlKGF0dGFja051bWJlciwgMSlbMF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXR0YWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlUGxheWVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZVNoaXAgPSAoc2hpcExlbmd0aCkgPT4ge1xyXG4gICAgLy8gRXJyb3IgY2hlY2tpbmdcclxuICAgIGlmICh0eXBlb2Ygc2hpcExlbmd0aCAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihzaGlwTGVuZ3RoKSB8fCBzaGlwTGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcclxuICAgIGxldCBoaXRzID0gMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENoZWNrcyB3aGV0aGVyIHRoZSBzaGlwIGhhcyBtb3JlIGhpdHMgdGhhbiBsaXZlc1xyXG4gICAgICAgIGlzU3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhpdHMgPj0gbGVuZ3RoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBkYW1hZ2FlIHRvIHRoZSBzaGlwIGFuZCBjaGVjayBmb3Igc2lua2luZ1xyXG4gICAgICAgIGhpdCgpIHtcclxuICAgICAgICAgICAgaGl0cyArPSAxO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlU2hpcCB9O1xyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XHJcbiAgICAtLWdyaWQtcGFkZGluZzogMnB4O1xyXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogMnJlbTtcclxuXHJcbiAgICAtLWJhbm5lci1iYWNrZ3JvdW5kOiAjMDAwMDAwOTk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBHZW5lcmFsIFN0eWxpbmdcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG4qIHtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG5ib2R5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4uYm9hcmQtZGlzcGxheSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGdhcDogMnJlbTtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uZ2FtZS1ib2FyZCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZ2FwOiB2YXIoLS1ncmlkLWNlbGwtZ2FwKTtcclxuXHJcbiAgICB3aWR0aDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcclxuICAgIGhlaWdodDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcclxuXHJcbiAgICBwYWRkaW5nOiAycHg7XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxufVxyXG5cclxuLmZvY3VzZWQtYm9hcmQge1xyXG4gICAgZmxleC13cmFwOiB3cmFwO1xyXG59XHJcblxyXG4udW5mb2N1c2VkLWJvYXJkIHtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcclxuICAgIGZsZXgtd3JhcDogd3JhcC1yZXZlcnNlO1xyXG59XHJcblxyXG4uZ3JpZC1jZWxsIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgd2lkdGg6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcclxuICAgIGhlaWdodDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG59XHJcblxyXG4uY2xpY2thYmxlIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG4uY2xpY2thYmxlOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAxODMsIDI1NSk7XHJcbn1cclxuXHJcbi53YXRlci1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XHJcbn1cclxuXHJcbi5zaGlwLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcclxufVxyXG5cclxuLm1pc3MtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG59XHJcblxyXG4uaGl0LWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xyXG59XHJcblxyXG4uc2hpcC1zdGFydCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbnllbGxvdztcclxufVxyXG5cclxuLnBvdGVudGlhbC1zaGlwLWVuZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcclxufVxyXG5cclxuLm1lc3NhZ2UtYmFubmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XHJcbiAgICBwYWRkaW5nOiAxLjVyZW0gMDtcclxuXHJcbiAgICBmb250LXNpemU6IHh4eC1sYXJnZTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFubmVyLWJhY2tncm91bmQpO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixzQkFBc0I7O0lBRXRCLDhCQUE4QjtBQUNsQzs7QUFFQTs7OztFQUlFO0FBQ0Y7SUFDSSxzQkFBc0I7SUFDdEIsU0FBUztJQUNULFVBQVU7QUFDZDs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixTQUFTOztJQUVULHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYix5QkFBeUI7O0lBRXpCLDhHQUE4RztJQUM5RywrR0FBK0c7O0lBRS9HLFlBQVk7O0lBRVoseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7QUFFQTtJQUNJLDJCQUEyQjtJQUMzQix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsNEJBQTRCO0lBQzVCLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLGtDQUFrQztBQUN0Qzs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTtJQUNJLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixXQUFXO0lBQ1gsV0FBVzs7SUFFWCxxQkFBcUI7SUFDckIsaUJBQWlCOztJQUVqQixvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWiwwQ0FBMEM7QUFDOUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcclxcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcXHJcXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcXHJcXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogMnJlbTtcXHJcXG5cXHJcXG4gICAgLS1iYW5uZXItYmFja2dyb3VuZDogIzAwMDAwMDk5O1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqIEdlbmVyYWwgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbioge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmJvYXJkLWRpc3BsYXkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZ2FwOiAycmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZS1ib2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGdhcDogdmFyKC0tZ3JpZC1jZWxsLWdhcCk7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcbiAgICBoZWlnaHQ6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDJweDtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmZvY3VzZWQtYm9hcmQge1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXA7XFxyXFxufVxcclxcblxcclxcbi51bmZvY3VzZWQtYm9hcmQge1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93LXJldmVyc2U7XFxyXFxuICAgIGZsZXgtd3JhcDogd3JhcC1yZXZlcnNlO1xcclxcbn1cXHJcXG5cXHJcXG4uZ3JpZC1jZWxsIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XFxyXFxuICAgIGhlaWdodDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY2xpY2thYmxlIHtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG4uY2xpY2thYmxlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDAsIDE4MywgMjU1KTtcXHJcXG59XFxyXFxuXFxyXFxuLndhdGVyLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JleTtcXHJcXG59XFxyXFxuXFxyXFxuLm1pc3MtY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxyXFxufVxcclxcblxcclxcbi5oaXQtY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLnNoaXAtc3RhcnQge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbnllbGxvdztcXHJcXG59XFxyXFxuXFxyXFxuLnBvdGVudGlhbC1zaGlwLWVuZCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4ubWVzc2FnZS1iYW5uZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgaGVpZ2h0OiAxMCU7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcblxcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XFxyXFxuICAgIHBhZGRpbmc6IDEuNXJlbSAwO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IHh4eC1sYXJnZTtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICAgIGNvbG9yOiB3aGl0ZTtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFubmVyLWJhY2tncm91bmQpO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfSBmcm9tIFwiLi9nYW1lSGFuZGxlclwiO1xyXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIGNvbnN0IGJhdHRsZVNoaXBzID0gY3JlYXRlR2FtZUhhbmRsZXIoKTtcclxuICAgIGJhdHRsZVNoaXBzLnNldHVwR2FtZSgpO1xyXG4gICAgYXdhaXQgYmF0dGxlU2hpcHMuc2V0dXBTaGlwcygpO1xyXG4gICAgYmF0dGxlU2hpcHMucGxheUdhbWUoKTtcclxufVxyXG5cclxubWFpbigpO1xyXG4iXSwibmFtZXMiOlsiQk9BUkRfV0lEVEgiLCJQTEFZRVJfMV9CT0FSRF9JRCIsIlBMQVlFUl8yX0JPQVJEX0lEIiwiTUFYX1NISVBTIiwiVElMRVMiLCJXQVRFUiIsIk1JU1MiLCJISVQiLCJUSUxFX0NMQVNTRVMiLCJTSElQIiwiY3JlYXRlRE9NQm9hcmRIYW5kbGVyIiwiYm9hcmREaXNwbGF5IiwicGxheWVyMUJvYXJkIiwicGxheWVyMkJvYXJkIiwiYWN0aXZlQm9hcmQiLCJzZWxlY3RDZWxsRXZlbnQiLCJncmlkQ2VsbCIsInJlc29sdmUiLCJjZWxsQ29vcmRpbmF0ZXMiLCJnZXRBdHRyaWJ1dGUiLCJkaXNhYmxlQXR0YWNrQ2VsbFNlbGVjdGlvbiIsInNlbGVjdFNoaXBTdGFydEV2ZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiY3JlYXRlR3JpZERpc3BsYXkiLCJncmlkIiwiaWQiLCJib2FyZCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImZvckVhY2giLCJyb3ciLCJ4IiwiXyIsInkiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInByZXBlbmQiLCJjbG9uZWRCb2FyZCIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsImNoaWxkTm9kZXMiLCJjZWxsIiwicmVtb3ZlIiwidmFsaWRFbmRQb2ludCIsIl9yZWYiLCJfcmVmMiIsImFsbG93ZWRMZW5ndGhzIiwic3RhcnRYIiwic3RhcnRZIiwiZW5kWCIsImVuZFkiLCJsZW5ndGgiLCJzdGFydCIsImVuZCIsImZpbmQiLCJvYmoiLCJudW1iZXIiLCJNYXRoIiwiYWJzIiwibWluIiwibWF4IiwicXVlcnlTZWxlY3RvciIsImNvbnRhaW5zIiwicmVtYWluaW5nIiwid2lwZVNoaXBQbGFjZW1lbnRJbmRpY2F0b3JzIiwicXVlcnlTZWxlY3RvckFsbCIsInJlbmRlckluaXRpYWxCb2FyZCIsInBsYXllcjFHcmlkIiwicGxheWVyMkdyaWQiLCJmbGlwQm9hcmRzIiwidG9nZ2xlIiwic3dpdGNoQWN0aXZlQm9hcmQiLCJsYXN0Q2hpbGQiLCJlbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbiIsIlByb21pc2UiLCJBcnJheSIsImZyb20iLCJhZGRFdmVudExpc3RlbmVyIiwiZW5hYmxlU2hpcEVuZFBvc2l0aW9uU2VsZWN0aW9uIiwic3RhcnRQb3MiLCJwbGFjZVNoaXAiLCJfcmVmMyIsIl9yZWY0IiwiZW5hYmxlQXR0YWNrU2VsZWN0aW9uIiwic29tZSIsInRpbGVUeXBlIiwicmVjZWl2ZUF0dGFjayIsIl9yZWY1IiwiaGl0IiwiYXR0YWNrZWRDZWxsIiwidGV4dENvbnRlbnQiLCJjcmVhdGVET01NZXNzYWdlSGFuZGxlciIsIm1lc3NhZ2VCYW5uZXIiLCJkaXNwbGF5U2hpcFBsYWNlUHJvbXB0Iiwic2hpcHNSZW1haW5pbmciLCJkaXNwbGF5Q3VycmVudFR1cm4iLCJwbGF5ZXJUdXJuIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiZGlzcGxheUF0dGFja1Jlc3VsdCIsImRpc3BsYXlXaW5uZXIiLCJuYW1lIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJzd2l0Y2hBY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImJvYXJkSGFuZGxlciIsIm1lc3NhZ2VIYW5kbGVyIiwic2V0dXBHYW1lIiwiZ2V0R3JpZCIsInNldHVwU2hpcHMiLCJwbGFjZWQiLCJlbmRQb3MiLCJnZXRBbGxvd2VkTGVuZ3RocyIsInBsYXlHYW1lIiwiZ2FtZU92ZXIiLCJjb25zb2xlIiwibG9nIiwiaXNDb21wdXRlciIsInZhbGlkQXR0YWNrIiwiYXR0YWNrIiwic2V0VGltZW91dCIsInByb3ZpZGVBdHRhY2tDb29yZGluYXRlcyIsImVuYWJsZUF0dGFja0NlbGxTZWxlY3Rpb24iLCJpc0ZsZWV0U3VuayIsImNyZWF0ZVNoaXAiLCJmaWxsIiwicGxhY2VkU2hpcHMiLCJpc1ZhbGlkQ29vcmRzIiwic3RhcnR4Iiwic3RhcnR5IiwiZW5keCIsImVuZHkiLCJjb29yZCIsIkVycm9yIiwic2hpcExlbmd0aCIsIm5ld1NoaXAiLCJwdXNoIiwibWluWCIsIm1heFgiLCJtaW5ZIiwibWF4WSIsImVycm9yIiwic3F1YXJlIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwicG9zc2libGVBdHRhY2tzIiwiYXR0YWNrTnVtYmVyIiwiZmxvb3IiLCJyYW5kb20iLCJzcGxpY2UiLCJpc05hTiIsImhpdHMiLCJtYWluIiwiYmF0dGxlU2hpcHMiXSwic291cmNlUm9vdCI6IiJ9