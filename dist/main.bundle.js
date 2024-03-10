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
      player1Board.classList.add("bottom-board");
      player2Board.classList.add("top-board");
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
    placeShip(_ref3, _ref4, hidden) {
      let [startX, startY] = _ref3;
      let [endX, endY] = _ref4;
      let start = null;
      let end = null;
      let playerID = hidden ? _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID : _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID;

      // Placing ship tiles along the y-axis
      if (startX === endX) {
        start = Math.min(startY, endY);
        end = Math.max(startY, endY);
        for (let y = start; y < end + 1; y += 1) {
          const cell = document.querySelector(`.grid-cell[data-player-id="${playerID}"][data-x="${startX}"][data-y="${y}"]`);
          if (!hidden) {
            cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
            cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
          }
        }
      }
      // Placing ship tiles along the x-axis
      else {
        start = Math.min(startX, endX);
        end = Math.max(startX, endX);
        for (let x = start; x < end + 1; x += 1) {
          const cell = document.querySelector(`.grid-cell[data-player-id="${playerID}"][data-x="${x}"][data-y="${startY}"]`);
          if (!hidden) {
            cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
            cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
          }
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
      boardHandler.renderInitialBoard(player1Board.getGrid(), player2Board.getGrid());
    },
    // Fill the board with ships
    async setupShips() {
      let placed = 0;

      // Set up computer ships
      while (placed < _constants__WEBPACK_IMPORTED_MODULE_4__.MAX_SHIPS) {
        // Try placing a ship at computer generated coordinates
        try {
          let [startPos, endPos] = player2.provideShipCoordinates(player2Board.getAllowedLengths());
          player2Board.placeShip([startPos, endPos]);
          boardHandler.placeShip(startPos, endPos, true);
          placed += 1;
          console.log([startPos, endPos]);
        } catch {
          // If coordinates invalid, ask again
        }
      }
      boardHandler.switchActiveBoard();
      placed = 0;

      // Set up player ships
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
      boardHandler.switchActiveBoard();
    },
    // Main game loop
    async playGame() {
      let gameOver = false;
      while (!gameOver) {
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
            attack = await boardHandler.enableAttackSelection();
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
  function isValidCoords(minX, minY, maxX, maxY) {
    // Ship placed off the board
    if ([minX, minY, maxX, maxY].some(coord => coord < 0 || coord >= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH)) {
      return false;
    }

    // Ship placed diagonally
    if (minX !== maxX && minY !== maxY) {
      return false;
    }

    // Check for ships already in the grid
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
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
      let [[startX, startY], [endX, endY]] = _ref;
      // Max ships already placed
      if (placedShips.length >= _constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SHIPS) {
        throw new Error("Ship capacity reached");
      }
      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);

      // Invalid coordinates
      if (!isValidCoords(minX, minY, maxX, maxY)) {
        throw new Error("Invalid coordinates");
      }
      const shipLength = 1 + Math.max(Math.abs(startX - endX), Math.abs(startY - endY));

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
  const orientations = {
    HORIZONTAL: 0,
    VERTICAL: 1
  };
  for (let x = 0; x < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; x += 1) {
    for (let y = 0; y < _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH; y += 1) {
      possibleAttacks.push([x, y]);
    }
  }
  return {
    isComputer,
    provideShipCoordinates(allowedLengths) {
      // Determine start co-ordinates
      const startX = Math.floor(Math.random() * _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH);
      const startY = Math.floor(Math.random() * _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH);
      // Determine orientation
      const orientation = Math.random() < 0.5 ? orientations.HORIZONTAL : orientations.VERTICAL;
      // Determine length
      let shipLength = null;
      for (const length of allowedLengths) {
        if (length.remaining > 0) {
          shipLength = length.number - 1;
          break;
        }
      }

      // Place ship horizontally
      if (orientation === orientations.HORIZONTAL) {
        // Place according to board width limitations
        if (startX - shipLength < 0) {
          return [[startX, startY], [startX + shipLength, startY]];
        } else if (startX + shipLength >= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH) {
          return [[startX, startY], [startX - shipLength, startY]];
        }
        // Place randomly left or right
        else {
          if (Math.random() < 0.5) {
            return [[startX, startY], [startX + shipLength, startY]];
          } else {
            return [[startX, startY], [startX - shipLength, startY]];
          }
        }
      }
      // Place ship vertically
      else {
        // Place according to board width limitations
        if (startY - shipLength < 0) {
          return [[startX, startY], [startX, startY + shipLength]];
        } else if (startY + shipLength >= _constants__WEBPACK_IMPORTED_MODULE_0__.BOARD_WIDTH) {
          return [[startX, startY], [startX, startY - shipLength]];
        }
        // Place randomly up or down
        else {
          if (Math.random() < 0.5) {
            return [[startX, startY], [startX, startY + shipLength]];
          } else {
            return [[startX, startY], [startX, startY - shipLength]];
          }
        }
      }
    },
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

.bottom-board {
    flex-direction: column;
    flex-wrap: wrap;
}

.top-board {
    flex-direction: column-reverse;
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
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;AAClC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;IACI,sBAAsB;IACtB,eAAe;AACnB;;AAEA;IACI,8BAA8B;IAC9B,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;AACjC;;AAEA;IACI,eAAe;AACnB;AACA;IACI,kCAAkC;AACtC;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,uBAAuB;AAC3B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,qBAAqB;IACrB,iBAAiB;;IAEjB,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 2rem;\r\n\r\n    --banner-background: #00000099;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n.bottom-board {\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.top-board {\r\n    flex-direction: column-reverse;\r\n    flex-wrap: wrap-reverse;\r\n}\r\n\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n}\r\n.clickable:hover {\r\n    background-color: rgb(0, 183, 255);\r\n}\r\n\r\n.water-cell {\r\n    background-color: aqua;\r\n}\r\n\r\n.ship-cell {\r\n    background-color: grey;\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n.ship-start {\r\n    background-color: greenyellow;\r\n}\r\n\r\n.potential-ship-end {\r\n    background-color: green;\r\n}\r\n\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    margin-bottom: 1.5rem;\r\n    padding: 1.5rem 0;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxRQUFRLENBQUMsQ0FBQztBQUMxQjtBQUVBcUMsSUFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbUJvYXJkSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZG9tTWVzc2FnZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJPQVJEX1dJRFRIID0gMTA7XHJcbmNvbnN0IFBMQVlFUl8xX0JPQVJEX0lEID0gXCJwbGF5ZXIxQm9hcmRcIjtcclxuY29uc3QgUExBWUVSXzJfQk9BUkRfSUQgPSBcInBsYXllcjJCb2FyZFwiO1xyXG5jb25zdCBNQVhfU0hJUFMgPSA1O1xyXG5cclxuY29uc3QgVElMRVMgPSB7XHJcbiAgICBXQVRFUjogXCJXXCIsXHJcbiAgICBNSVNTOiBcIk9cIixcclxuICAgIEhJVDogXCJYXCIsXHJcbn07XHJcblxyXG5jb25zdCBUSUxFX0NMQVNTRVMgPSB7XHJcbiAgICBXQVRFUjogXCJ3YXRlci1jZWxsXCIsXHJcbiAgICBNSVNTOiBcIm1pc3MtY2VsbFwiLFxyXG4gICAgSElUOiBcImhpdC1jZWxsXCIsXHJcbiAgICBTSElQOiBcInNoaXAtY2VsbFwiLFxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPQVJEX1dJRFRILFxyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIE1BWF9TSElQUyxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIFRJTEVfQ0xBU1NFUyxcclxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZURPTUJvYXJkSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGxldCBib2FyZERpc3BsYXkgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjFCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgLy8gRXZlbnQgZm9yIHNlbGVjdGluZyBhIGNlbGwgb24gdGhlIGJvYXJkIGFuZCByZXR1cm5pbmcgaXQncyBjb29yZGluYXRlc1xyXG4gICAgY29uc3Qgc2VsZWN0Q2VsbEV2ZW50ID0gKGdyaWRDZWxsLCByZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2VsbENvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiksXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICByZXNvbHZlKGNlbGxDb29yZGluYXRlcyk7XHJcbiAgICAgICAgZGlzYWJsZUF0dGFja0NlbGxTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gRXZlbnQgZm9yIHNlbGVjdGluZyB0aGUgc3RhcnQgY2VsbCB3aGVuIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBjb25zdCBzZWxlY3RTaGlwU3RhcnRFdmVudCA9IChncmlkQ2VsbCwgcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwLXN0YXJ0XCIpO1xyXG4gICAgICAgIHNlbGVjdENlbGxFdmVudChncmlkQ2VsbCwgcmVzb2x2ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgYSBwbGF5ZXIncyBncmlkIHRvIGRpc3BsYXkgcmVsZXZhbnQgZ2FtZSBpbmZvcm1hdGlvbiB0byB0aGUgcGxheWVyXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVHcmlkRGlzcGxheShncmlkLCBpZCkge1xyXG4gICAgICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKF8sIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS14XCIsIHgpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIiwgaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJvYXJkRGlzcGxheS5wcmVwZW5kKGJvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYWJpbGl0eSB0byBhdHRhY2sgY2VsbHMgb24gb3Bwb25lbnQncyBib2FyZFxyXG4gICAgZnVuY3Rpb24gZGlzYWJsZUF0dGFja0NlbGxTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gQ2xvbmUgdGhlIHBhcmVudCBub2RlIHRvIHJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgY29uc3QgY2xvbmVkQm9hcmQgPSBhY3RpdmVCb2FyZC5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgYm9hcmREaXNwbGF5LnJlcGxhY2VDaGlsZChjbG9uZWRCb2FyZCwgYWN0aXZlQm9hcmQpO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgcmVmZXJlbmNlc1xyXG4gICAgICAgIGlmIChhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkKSB7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGNsb25lZEJvYXJkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGNsb25lZEJvYXJkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhY3RpdmVCb2FyZCA9IGNsb25lZEJvYXJkO1xyXG5cclxuICAgICAgICBhY3RpdmVCb2FyZC5jaGlsZE5vZGVzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERldGVybWluZXMgd2hldGhlciBhIGdpdmVuIHNldCBvZiBwb2ludHMgYXJlIHZhbGlkIHRvIGhhdmUgYSBzaGlwIHBsYWNlZCBiZXR3ZWVuIHRoZW1cclxuICAgIGZ1bmN0aW9uIHZhbGlkRW5kUG9pbnQoW3N0YXJ0WCwgc3RhcnRZXSwgW2VuZFgsIGVuZFldLCBhbGxvd2VkTGVuZ3Rocykge1xyXG4gICAgICAgIC8vIFNhbWUgY28tb3JkaW5hdGVcclxuICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYICYmIHN0YXJ0WSA9PT0gZW5kWSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGVuZ3RoID0gbnVsbDtcclxuICAgICAgICBsZXQgc3RhcnQgPSBudWxsO1xyXG4gICAgICAgIGxldCBlbmQgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBhbnkgcmVtYWluaW5nIHNoaXBzIG9mIHZhbGlkIGxlbmd0aCB0byBicmlkZ2UgdGhlc2UgcG9pbnRzXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAob2JqKSA9PiBvYmoubnVtYmVyID09PSBNYXRoLmFicyhzdGFydFkgLSBlbmRZKSArIDEsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3Igc2hpcHMgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcclxuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoc3RhcnRZLCBlbmRZKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSBzdGFydDsgeSA8IGVuZCArIDE7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHtzdGFydFh9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBhbnkgcmVtYWluaW5nIHNoaXBzIG9mIHZhbGlkIGxlbmd0aCB0byBicmlkZ2UgdGhlc2UgcG9pbnRzXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAob2JqKSA9PiBvYmoubnVtYmVyID09PSBNYXRoLmFicyhzdGFydFggLSBlbmRYKSArIDEsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3Igc2hpcHMgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBzdGFydDsgeCA8IGVuZCArIDE7IHggKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3N0YXJ0WX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmFsaWQgY29vcmRpbmF0ZXNcclxuICAgICAgICBpZiAobGVuZ3RoICYmIGxlbmd0aC5yZW1haW5pbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZXMgYWxsIHNoaXAgcGxhY2VtZW50IGluZGljYXRvcnMgZnJvbSB0aGUgYm9hcmQgZm9yIGdyZWF0ZXIgY2xhcml0eVxyXG4gICAgZnVuY3Rpb24gd2lwZVNoaXBQbGFjZW1lbnRJbmRpY2F0b3JzKCkge1xyXG4gICAgICAgIC8vIFJlbW92ZSBzaGlwIHN0YXJ0IHNxdWFyZSBpbmRpY2F0b3JcclxuICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbChgLmdyaWQtY2VsbFtjbGFzcyo9XCJzaGlwLXN0YXJ0XCJdYClcclxuICAgICAgICAgICAgLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcInNoaXAtc3RhcnRcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgcG90ZW50aWFsIHNoaXAgZW5kIHNxdWFyZSBpbmRpY2F0b3JzXHJcbiAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYC5ncmlkLWNlbGxbY2xhc3MqPVwicG90ZW50aWFsLXNoaXAtZW5kXCJdYClcclxuICAgICAgICAgICAgLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcInBvdGVudGlhbC1zaGlwLWVuZFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBDcmVhdGUgYW5kIHJlbmRlciBkaXNwbGF5IG9mIGJvdGggcGxheWVycyBib2FyZHNcclxuICAgICAgICByZW5kZXJJbml0aWFsQm9hcmQocGxheWVyMUdyaWQsIHBsYXllcjJHcmlkKSB7XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtZGlzcGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjFHcmlkLCBQTEFZRVJfMV9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjJHcmlkLCBQTEFZRVJfMl9CT0FSRF9JRCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMV9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzJfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUG9zaXRpb24gcGxheWVyIDEncyBib2FyZCBmYWNpbmcgc2NyZWVuXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QuYWRkKFwiYm90dG9tLWJvYXJkXCIpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2xhc3NMaXN0LmFkZChcInRvcC1ib2FyZFwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBwb3NzaWJsZSBzdGFydCBwb3NpdGlvbnMgZm9yIHNoaXBzIHNlbGVjdGFibGVcclxuICAgICAgICBhc3luYyBlbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFNoaXBTdGFydEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIHBvc3NpYmxlIGVuZCBwb3NpdGlvbnMgZm9yIHNoaXBzIHNlbGVjdGFibGVcclxuICAgICAgICBhc3luYyBlbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24oc3RhcnRQb3MsIGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShhY3RpdmVCb2FyZC5jaGlsZE5vZGVzKS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkRW5kUG9pbnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvd2VkTGVuZ3RocyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicG90ZW50aWFsLXNoaXAtZW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBhIHBsYWNlZCBzaGlwIHRvIHRoZSBib2FyZFxyXG4gICAgICAgIHBsYWNlU2hpcChbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV0sIGhpZGRlbikge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgZW5kID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHBsYXllcklEID0gaGlkZGVuID8gUExBWUVSXzJfQk9BUkRfSUQgOiBQTEFZRVJfMV9CT0FSRF9JRDtcclxuXHJcbiAgICAgICAgICAgIC8vIFBsYWNpbmcgc2hpcCB0aWxlcyBhbG9uZyB0aGUgeS1heGlzXHJcbiAgICAgICAgICAgIGlmIChzdGFydFggPT09IGVuZFgpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WSwgZW5kWSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0OyB5IDwgZW5kICsgMTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtcGxheWVyLWlkPVwiJHtwbGF5ZXJJRH1cIl1bZGF0YS14PVwiJHtzdGFydFh9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuU0hJUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHgtYXhpc1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtcGxheWVyLWlkPVwiJHtwbGF5ZXJJRH1cIl1bZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3N0YXJ0WX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuU0hJUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2lwZVNoaXBQbGFjZW1lbnRJbmRpY2F0b3JzKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBhbGwgYXR0YWNrYWJsZSBjZWxscyBvbiBvcHBvbmVudCdzIGJvYXJkIHNlbGVjdGFibGUgZm9yIGF0dGFja3NcclxuICAgICAgICBhc3luYyBlbmFibGVBdHRhY2tTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShhY3RpdmVCb2FyZC5jaGlsZE5vZGVzKS5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaWxlIGhhc24ndCBhbHJlYWR5IGJlZW4gYXR0YWNrZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgIVtUSUxFX0NMQVNTRVMuSElULCBUSUxFX0NMQVNTRVMuTUlTU10uc29tZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aWxlVHlwZSkgPT4gY2VsbC5jbGFzc0xpc3QuY29udGFpbnModGlsZVR5cGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2VsbEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFsdGVyIHRoZSBib2FyZCB0byByZWZsZWN0IGFuIGF0dGFja1xyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldLCBoaXQpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0YWNrZWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHt5fVwiXVtkYXRhLXBsYXllci1pZD1cIiR7YWN0aXZlQm9hcmQuaWR9XCJdYCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LmFkZChcclxuICAgICAgICAgICAgICAgIGhpdCA/IFRJTEVfQ0xBU1NFUy5ISVQgOiBUSUxFX0NMQVNTRVMuTUlTUyxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDaGFuZ2Ugd2hpY2ggYm9hcmQgaXMgYWN0aXZlXHJcbiAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID1cclxuICAgICAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVET01Cb2FyZEhhbmRsZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAvLyBDcmVhdGUgbWVzc2FnZSBiYW5uZXJcclxuICAgIC8vIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIC8vIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJtb2RhbFwiKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VCYW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbWVzc2FnZUJhbm5lci5jbGFzc0xpc3QuYWRkKFwibWVzc2FnZS1iYW5uZXJcIik7XHJcbiAgICAvLyBtb2RhbC5hcHBlbmRDaGlsZChtZXNzYWdlQmFubmVyKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLnByZXBlbmQobWVzc2FnZUJhbm5lcik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkaXNwbGF5U2hpcFBsYWNlUHJvbXB0KHNoaXBzUmVtYWluaW5nKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBgUGxhY2UgYSBzaGlwLCAke3NoaXBzUmVtYWluaW5nfSBzaGlwcyByZW1haW5pbmdgO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlDdXJyZW50VHVybihwbGF5ZXJUdXJuID0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gcGxheWVyVHVyblxyXG4gICAgICAgICAgICAgICAgPyBcIllvdXIgdHVybiEgTWFrZSBhbiBhdHRhY2tcIlxyXG4gICAgICAgICAgICAgICAgOiBgT3Bwb25lbnQgVHVybiEgTWFraW5nIGFuIGF0dGFja2A7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheUF0dGFja1Jlc3VsdChoaXQpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IGhpdCA/IFwiU2hpcCBoaXQhXCIgOiBcIlNob3QgbWlzc2VkIVwiO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlXaW5uZXIobmFtZSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gYFZpY3RvcnkgZm9yICR7bmFtZX0hYDtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IGNyZWF0ZVBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVET01Cb2FyZEhhbmRsZXIgfSBmcm9tIFwiLi9kb21Cb2FyZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyIH0gZnJvbSBcIi4vZG9tTWVzc2FnZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTUFYX1NISVBTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHN3aXRjaEFjdGl2ZVBsYXllcigpIHtcclxuICAgICAgICBhY3RpdmVQbGF5ZXIgPSBhY3RpdmVQbGF5ZXIgPT09IHBsYXllcjEgPyBwbGF5ZXIyIDogcGxheWVyMTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVCb2FyZCgpIHtcclxuICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJvYXJkSGFuZGxlciA9IG51bGw7XHJcbiAgICBsZXQgbWVzc2FnZUhhbmRsZXIgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIxID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBwbGF5ZXIyID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIyQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIGxldCBhY3RpdmVQbGF5ZXIgPSBudWxsO1xyXG4gICAgbGV0IGFjdGl2ZUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNldHVwR2FtZSgpIHtcclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyID0gY3JlYXRlRE9NQm9hcmRIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyID0gY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjEgPSBjcmVhdGVQbGF5ZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIHBsYXllcjIgPSBjcmVhdGVQbGF5ZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGNyZWF0ZUdhbWVib2FyZCgpO1xyXG5cclxuICAgICAgICAgICAgYWN0aXZlUGxheWVyID0gcGxheWVyMTtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPSBwbGF5ZXIyQm9hcmQ7XHJcblxyXG4gICAgICAgICAgICBib2FyZEhhbmRsZXIucmVuZGVySW5pdGlhbEJvYXJkKFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5nZXRHcmlkKCksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gRmlsbCB0aGUgYm9hcmQgd2l0aCBzaGlwc1xyXG4gICAgICAgIGFzeW5jIHNldHVwU2hpcHMoKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGFjZWQgPSAwO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHVwIGNvbXB1dGVyIHNoaXBzXHJcbiAgICAgICAgICAgIHdoaWxlIChwbGFjZWQgPCBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRyeSBwbGFjaW5nIGEgc2hpcCBhdCBjb21wdXRlciBnZW5lcmF0ZWQgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtzdGFydFBvcywgZW5kUG9zXSA9IHBsYXllcjIucHJvdmlkZVNoaXBDb29yZGluYXRlcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmdldEFsbG93ZWRMZW5ndGhzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtzdGFydFBvcywgZW5kUG9zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnBsYWNlU2hpcChzdGFydFBvcywgZW5kUG9zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhbc3RhcnRQb3MsIGVuZFBvc10pO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgY29vcmRpbmF0ZXMgaW52YWxpZCwgYXNrIGFnYWluXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlci5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICBwbGFjZWQgPSAwO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IHVwIHBsYXllciBzaGlwc1xyXG4gICAgICAgICAgICB3aGlsZSAocGxhY2VkIDwgTUFYX1NISVBTKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5U2hpcFBsYWNlUHJvbXB0KE1BWF9TSElQUyAtIHBsYWNlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3Igc2hpcCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0UG9zID1cclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlU2hpcFN0YXJ0UG9zaXRpb25TZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIGxldCBlbmRQb3MgPSBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlU2hpcEVuZFBvc2l0aW9uU2VsZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5nZXRBbGxvd2VkTGVuZ3RocygpLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUcnkgcGxhY2luZyBhIHNoaXAgYXQgdGhvc2UgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbc3RhcnRQb3MsIGVuZFBvc10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5wbGFjZVNoaXAoc3RhcnRQb3MsIGVuZFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VkICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBjb29yZGluYXRlcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFpbiBnYW1lIGxvb3BcclxuICAgICAgICBhc3luYyBwbGF5R2FtZSgpIHtcclxuICAgICAgICAgICAgbGV0IGdhbWVPdmVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoIWdhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5Q3VycmVudFR1cm4oIWFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWxpZEF0dGFjayA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICghdmFsaWRBdHRhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYXR0YWNrID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaGl0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGNvbXB1dGVyIHBsYXllciBtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhdXNlIHRvIHNpbXVsYXRlIGNvbXB1dGVyIHRoaW5raW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBjb21wdXRlciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGFjdGl2ZVBsYXllci5wcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBodW1hbiBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgaHVtYW4gcGxheWVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZUF0dGFja1NlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRoYXQgYXR0YWNrIG9uIG9wcG9uZW50IGJvYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGl0ID0gYWN0aXZlQm9hcmQucmVjZWl2ZUF0dGFjayhhdHRhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIucmVjZWl2ZUF0dGFjayhhdHRhY2ssIGhpdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkQXR0YWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheUF0dGFja1Jlc3VsdChoaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhdHRhY2sgaXMgaW52YWxpZCwgYXNrIGFnYWluXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcmVnaXN0ZXIgaXQgYW5kIHRoZW4gYXdhaXQgaW5wdXQgZnJvbSBvdGhlciBwbGF5ZXJcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVCb2FyZC5pc0ZsZWV0U3VuaygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2FtZSBvdmVyXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlXaW5uZXIoXCJQbGF5ZXIgMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3dpdGNoIHBsYXllciB0dXJuc1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlUGxheWVyKCk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRILCBNQVhfU0hJUFMsIFRJTEVTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhbGxvd2VkTGVuZ3RocyA9IFtcclxuICAgICAgICB7IG51bWJlcjogMiwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDMsIHJlbWFpbmluZzogMiB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA0LCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogNSwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0pLmZpbGwoVElMRVMuV0FURVIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHBhaXIgb2YgY29vcmRpbmF0ZXMgaXMgdmFsaWQgZm9yIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkQ29vcmRzKG1pblgsIG1pblksIG1heFgsIG1heFkpIHtcclxuICAgICAgICAvLyBTaGlwIHBsYWNlZCBvZmYgdGhlIGJvYXJkXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0uc29tZShcclxuICAgICAgICAgICAgICAgIChjb29yZCkgPT4gY29vcmQgPCAwIHx8IGNvb3JkID49IEJPQVJEX1dJRFRILFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNoaXAgcGxhY2VkIGRpYWdvbmFsbHlcclxuICAgICAgICBpZiAobWluWCAhPT0gbWF4WCAmJiBtaW5ZICE9PSBtYXhZKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBzaGlwcyBhbHJlYWR5IGluIHRoZSBncmlkXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hpcCBhbHJlYWR5IHBsYWNlZCB0aGVyZVxyXG4gICAgICAgICAgICAgICAgaWYgKGdyaWRbeF1beV0gIT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIFBsYWNlIGEgc2hpcCBvbiB0aGUgZ2FtZSBib2FyZCBiYXNlZCBvbiBzdGFydCBhbmQgZW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgcGxhY2VTaGlwKFtbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV1dKSB7XHJcbiAgICAgICAgICAgIC8vIE1heCBzaGlwcyBhbHJlYWR5IHBsYWNlZFxyXG4gICAgICAgICAgICBpZiAocGxhY2VkU2hpcHMubGVuZ3RoID49IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hpcCBjYXBhY2l0eSByZWFjaGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbihzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoc3RhcnRZLCBlbmRZKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludmFsaWQgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkQ29vcmRzKG1pblgsIG1pblksIG1heFgsIG1heFkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID1cclxuICAgICAgICAgICAgICAgIDEgKyBNYXRoLm1heChNYXRoLmFicyhzdGFydFggLSBlbmRYKSwgTWF0aC5hYnMoc3RhcnRZIC0gZW5kWSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgc2hpcCBsZW5ndGggdmFsaWRpdHlcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYWxsb3dlZExlbmd0aHMuZmluZCgob2JqKSA9PiBvYmoubnVtYmVyID09PSBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmoucmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IGNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBzaGlwIHJlZmVyZW5jZXMgdG8gdGhlIGdyaWRcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gbWluWDsgeCA8PSBtYXhYOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IHBsYWNlZFNoaXBzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG9iai5yZW1haW5pbmcgLT0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldKSB7XHJcbiAgICAgICAgICAgIGlmIChbeCwgeV0uc29tZSgoY29vcmQpID0+IGNvb3JkIDwgMCB8fCBjb29yZCA+PSBCT0FSRF9XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGdyaWRbeF1beV07XHJcblxyXG4gICAgICAgICAgICAvLyBEdXBsaWNhdGUgYXR0YWNrXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLk1JU1MgfHwgc3F1YXJlID09PSBUSUxFUy5ISVQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFscmVhZHkgYXR0YWNrZWQgdGhpcyBzcXVhcmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE1pc3NcclxuICAgICAgICAgICAgaWYgKHNxdWFyZSA9PT0gVElMRVMuV0FURVIpIHtcclxuICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5NSVNTO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGl0XHJcbiAgICAgICAgICAgIHBsYWNlZFNoaXBzW3NxdWFyZV0uaGl0KCk7XHJcbiAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5ISVQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpc0ZsZWV0U3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlZFNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHcmlkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbGxvd2VkTGVuZ3RocygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbG93ZWRMZW5ndGhzO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRIIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVQbGF5ZXIgPSAoaXNDb21wdXRlcikgPT4ge1xyXG4gICAgLy8gRmlsbCBhbiBhcnJheSB3aXRoIGFsbCBwb3NzaWJsZSBhdHRhY2tzIG9uIHRoZSBib2FyZFxyXG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gW107XHJcblxyXG4gICAgY29uc3Qgb3JpZW50YXRpb25zID0ge1xyXG4gICAgICAgIEhPUklaT05UQUw6IDAsXHJcbiAgICAgICAgVkVSVElDQUw6IDEsXHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfV0lEVEg7IHggKz0gMSkge1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgQk9BUkRfV0lEVEg7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICBwb3NzaWJsZUF0dGFja3MucHVzaChbeCwgeV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQ29tcHV0ZXIsXHJcblxyXG4gICAgICAgIHByb3ZpZGVTaGlwQ29vcmRpbmF0ZXMoYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHN0YXJ0IGNvLW9yZGluYXRlc1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCT0FSRF9XSURUSCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJPQVJEX1dJRFRIKTtcclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIG9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID1cclxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgPCAwLjVcclxuICAgICAgICAgICAgICAgICAgICA/IG9yaWVudGF0aW9ucy5IT1JJWk9OVEFMXHJcbiAgICAgICAgICAgICAgICAgICAgOiBvcmllbnRhdGlvbnMuVkVSVElDQUw7XHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSBsZW5ndGhcclxuICAgICAgICAgICAgbGV0IHNoaXBMZW5ndGggPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBsZW5ndGggb2YgYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZW5ndGgucmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBMZW5ndGggPSBsZW5ndGgubnVtYmVyIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcCBob3Jpem9udGFsbHlcclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBvcmllbnRhdGlvbnMuSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgYWNjb3JkaW5nIHRvIGJvYXJkIHdpZHRoIGxpbWl0YXRpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRYIC0gc2hpcExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYICsgc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFggKyBzaGlwTGVuZ3RoID49IEJPQVJEX1dJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCAtIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIHJhbmRvbWx5IGxlZnQgb3IgcmlnaHRcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCArIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYIC0gc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcCB2ZXJ0aWNhbGx5XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgYWNjb3JkaW5nIHRvIGJvYXJkIHdpZHRoIGxpbWl0YXRpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRZIC0gc2hpcExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgKyBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFkgKyBzaGlwTGVuZ3RoID49IEJPQVJEX1dJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZIC0gc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIHJhbmRvbWx5IHVwIG9yIGRvd25cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZICsgc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgLSBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByYW5kb20gYXR0YWNrXHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja051bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhdHRhY2sgZnJvbSBhbGwgcG9zc2libGUgYXR0YWNrcyBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFjayA9IHBvc3NpYmxlQXR0YWNrcy5zcGxpY2UoYXR0YWNrTnVtYmVyLCAxKVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2s7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVQbGF5ZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlU2hpcCA9IChzaGlwTGVuZ3RoKSA9PiB7XHJcbiAgICAvLyBFcnJvciBjaGVja2luZ1xyXG4gICAgaWYgKHR5cGVvZiBzaGlwTGVuZ3RoICE9PSBcIm51bWJlclwiIHx8IGlzTmFOKHNoaXBMZW5ndGgpIHx8IHNoaXBMZW5ndGggPCAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xyXG4gICAgbGV0IGhpdHMgPSAwO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIHNoaXAgaGFzIG1vcmUgaGl0cyB0aGFuIGxpdmVzXHJcbiAgICAgICAgaXNTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGl0cyA+PSBsZW5ndGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGRhbWFnYWUgdG8gdGhlIHNoaXAgYW5kIGNoZWNrIGZvciBzaW5raW5nXHJcbiAgICAgICAgaGl0KCkge1xyXG4gICAgICAgICAgICBoaXRzICs9IDE7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVTaGlwIH07XHJcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XHJcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcclxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XHJcbiAgICAtLWdyaWQtY2VsbC1zaXplOiAycmVtO1xyXG5cclxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEdlbmVyYWwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbioge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZ2FwOiAycmVtO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xyXG5cclxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG4gICAgaGVpZ2h0OiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG5cclxuICAgIHBhZGRpbmc6IDJweDtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uYm90dG9tLWJvYXJkIHtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi50b3AtYm9hcmQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XHJcbn1cclxuXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XHJcbn1cclxuXHJcbi5jbGlja2FibGUge1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbi5jbGlja2FibGU6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDAsIDE4MywgMjU1KTtcclxufVxyXG5cclxuLndhdGVyLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcclxufVxyXG5cclxuLnNoaXAtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG59XHJcblxyXG4ubWlzcy1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcbn1cclxuXHJcbi5oaXQtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbn1cclxuXHJcbi5zaGlwLXN0YXJ0IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVueWVsbG93O1xyXG59XHJcblxyXG4ucG90ZW50aWFsLXNoaXAtZW5kIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xyXG59XHJcblxyXG4ubWVzc2FnZS1iYW5uZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICAgIHBhZGRpbmc6IDEuNXJlbSAwO1xyXG5cclxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLHNCQUFzQjs7SUFFdEIsOEJBQThCO0FBQ2xDOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLHNCQUFzQjtJQUN0QixTQUFTO0lBQ1QsVUFBVTtBQUNkOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7O0lBRVQseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHlCQUF5Qjs7SUFFekIsOEdBQThHO0lBQzlHLCtHQUErRzs7SUFFL0csWUFBWTs7SUFFWix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxzQkFBc0I7SUFDdEIsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLDhCQUE4QjtJQUM5Qix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsNEJBQTRCO0lBQzVCLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLGVBQWU7QUFDbkI7QUFDQTtJQUNJLGtDQUFrQztBQUN0Qzs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTtJQUNJLDZCQUE2QjtBQUNqQzs7QUFFQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixXQUFXO0lBQ1gsV0FBVzs7SUFFWCxxQkFBcUI7SUFDckIsaUJBQWlCOztJQUVqQixvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWiwwQ0FBMEM7QUFDOUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcclxcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcXHJcXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcXHJcXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogMnJlbTtcXHJcXG5cXHJcXG4gICAgLS1iYW5uZXItYmFja2dyb3VuZDogIzAwMDAwMDk5O1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqIEdlbmVyYWwgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbioge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmJvYXJkLWRpc3BsYXkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZ2FwOiAycmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZS1ib2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGdhcDogdmFyKC0tZ3JpZC1jZWxsLWdhcCk7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcbiAgICBoZWlnaHQ6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDJweDtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmJvdHRvbS1ib2FyZCB7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGZsZXgtd3JhcDogd3JhcDtcXHJcXG59XFxyXFxuXFxyXFxuLnRvcC1ib2FyZCB7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XFxyXFxufVxcclxcblxcclxcbi5ncmlkLWNlbGwge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcXHJcXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XFxyXFxufVxcclxcblxcclxcbi5jbGlja2FibGUge1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcbi5jbGlja2FibGU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMTgzLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4ud2F0ZXItY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxyXFxufVxcclxcblxcclxcbi5zaGlwLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xcclxcbn1cXHJcXG5cXHJcXG4ubWlzcy1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1zdGFydCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVueWVsbG93O1xcclxcbn1cXHJcXG5cXHJcXG4ucG90ZW50aWFsLXNoaXAtZW5kIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5tZXNzYWdlLWJhbm5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuXFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcXHJcXG4gICAgcGFkZGluZzogMS41cmVtIDA7XFxyXFxuXFxyXFxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBjcmVhdGVHYW1lSGFuZGxlciB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XHJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgY29uc3QgYmF0dGxlU2hpcHMgPSBjcmVhdGVHYW1lSGFuZGxlcigpO1xyXG4gICAgYmF0dGxlU2hpcHMuc2V0dXBHYW1lKCk7XHJcbiAgICBhd2FpdCBiYXR0bGVTaGlwcy5zZXR1cFNoaXBzKCk7XHJcbiAgICBiYXR0bGVTaGlwcy5wbGF5R2FtZSgpO1xyXG59XHJcblxyXG5tYWluKCk7XHJcbiJdLCJuYW1lcyI6WyJCT0FSRF9XSURUSCIsIlBMQVlFUl8xX0JPQVJEX0lEIiwiUExBWUVSXzJfQk9BUkRfSUQiLCJNQVhfU0hJUFMiLCJUSUxFUyIsIldBVEVSIiwiTUlTUyIsIkhJVCIsIlRJTEVfQ0xBU1NFUyIsIlNISVAiLCJjcmVhdGVET01Cb2FyZEhhbmRsZXIiLCJib2FyZERpc3BsYXkiLCJwbGF5ZXIxQm9hcmQiLCJwbGF5ZXIyQm9hcmQiLCJhY3RpdmVCb2FyZCIsInNlbGVjdENlbGxFdmVudCIsImdyaWRDZWxsIiwicmVzb2x2ZSIsImNlbGxDb29yZGluYXRlcyIsImdldEF0dHJpYnV0ZSIsImRpc2FibGVBdHRhY2tDZWxsU2VsZWN0aW9uIiwic2VsZWN0U2hpcFN0YXJ0RXZlbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJjcmVhdGVHcmlkRGlzcGxheSIsImdyaWQiLCJpZCIsImJvYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZm9yRWFjaCIsInJvdyIsIngiLCJfIiwieSIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwicHJlcGVuZCIsImNsb25lZEJvYXJkIiwiY2xvbmVOb2RlIiwicmVwbGFjZUNoaWxkIiwiY2hpbGROb2RlcyIsImNlbGwiLCJyZW1vdmUiLCJ2YWxpZEVuZFBvaW50IiwiX3JlZiIsIl9yZWYyIiwiYWxsb3dlZExlbmd0aHMiLCJzdGFydFgiLCJzdGFydFkiLCJlbmRYIiwiZW5kWSIsImxlbmd0aCIsInN0YXJ0IiwiZW5kIiwiZmluZCIsIm9iaiIsIm51bWJlciIsIk1hdGgiLCJhYnMiLCJtaW4iLCJtYXgiLCJxdWVyeVNlbGVjdG9yIiwiY29udGFpbnMiLCJyZW1haW5pbmciLCJ3aXBlU2hpcFBsYWNlbWVudEluZGljYXRvcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVuZGVySW5pdGlhbEJvYXJkIiwicGxheWVyMUdyaWQiLCJwbGF5ZXIyR3JpZCIsImVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uIiwiUHJvbWlzZSIsIkFycmF5IiwiZnJvbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24iLCJzdGFydFBvcyIsInBsYWNlU2hpcCIsIl9yZWYzIiwiX3JlZjQiLCJoaWRkZW4iLCJwbGF5ZXJJRCIsImVuYWJsZUF0dGFja1NlbGVjdGlvbiIsInNvbWUiLCJ0aWxlVHlwZSIsInJlY2VpdmVBdHRhY2siLCJfcmVmNSIsImhpdCIsImF0dGFja2VkQ2VsbCIsInN3aXRjaEFjdGl2ZUJvYXJkIiwiY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIiLCJtZXNzYWdlQmFubmVyIiwiZGlzcGxheVNoaXBQbGFjZVByb21wdCIsInNoaXBzUmVtYWluaW5nIiwidGV4dENvbnRlbnQiLCJkaXNwbGF5Q3VycmVudFR1cm4iLCJwbGF5ZXJUdXJuIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiZGlzcGxheUF0dGFja1Jlc3VsdCIsImRpc3BsYXlXaW5uZXIiLCJuYW1lIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJzd2l0Y2hBY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImJvYXJkSGFuZGxlciIsIm1lc3NhZ2VIYW5kbGVyIiwic2V0dXBHYW1lIiwiZ2V0R3JpZCIsInNldHVwU2hpcHMiLCJwbGFjZWQiLCJlbmRQb3MiLCJwcm92aWRlU2hpcENvb3JkaW5hdGVzIiwiZ2V0QWxsb3dlZExlbmd0aHMiLCJjb25zb2xlIiwibG9nIiwicGxheUdhbWUiLCJnYW1lT3ZlciIsImlzQ29tcHV0ZXIiLCJ2YWxpZEF0dGFjayIsImF0dGFjayIsInNldFRpbWVvdXQiLCJwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMiLCJpc0ZsZWV0U3VuayIsImNyZWF0ZVNoaXAiLCJmaWxsIiwicGxhY2VkU2hpcHMiLCJpc1ZhbGlkQ29vcmRzIiwibWluWCIsIm1pblkiLCJtYXhYIiwibWF4WSIsImNvb3JkIiwiRXJyb3IiLCJzaGlwTGVuZ3RoIiwibmV3U2hpcCIsInB1c2giLCJlcnJvciIsInNxdWFyZSIsImV2ZXJ5Iiwic2hpcCIsImlzU3VuayIsInBvc3NpYmxlQXR0YWNrcyIsIm9yaWVudGF0aW9ucyIsIkhPUklaT05UQUwiLCJWRVJUSUNBTCIsImZsb29yIiwicmFuZG9tIiwib3JpZW50YXRpb24iLCJhdHRhY2tOdW1iZXIiLCJzcGxpY2UiLCJpc05hTiIsImhpdHMiLCJtYWluIiwiYmF0dGxlU2hpcHMiXSwic291cmNlUm9vdCI6IiJ9