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
  const SHIP_COLOURS = {
    2: "hsl(320, 60%, 85%)",
    3: "hsl(30, 60%, 85%)",
    4: "hsl(270, 60%, 75%)",
    5: "hsl(120, 60%, 85%)"
  };
  let boardDisplay = null;
  let player1Board = null;
  let player2Board = null;
  let activeBoard = null;

  // Event for selecting a cell on the board and returning it's coordinates
  const selectCellEvent = (gridCell, resolve) => {
    const cellCoordinates = [gridCell.getAttribute("data-x"), gridCell.getAttribute("data-y")];
    resolve(cellCoordinates);
    disableCellSelection();
  };

  // Create a copy of a player's grid to display relevant game information to the player
  function createGridDisplay(grid, id) {
    const boardHolder = document.createElement("span");
    const title = document.createElement("h3");
    title.classList.add("board-title");
    if (id === _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID) {
      title.classList.add("player-board-title");
      title.textContent = "Your Ships";
    } else {
      title.classList.add("opponent-board-title");
      title.textContent = "Opponent Ships";
    }
    const board = document.createElement("div");
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
    boardHolder.appendChild(title);
    boardHolder.appendChild(board);
    boardDisplay.prepend(boardHolder);
  }

  // Remove ability to select any cells on the current active board
  function disableCellSelection() {
    // Clone the parent node to remove all event listeners
    const clonedBoard = activeBoard.parentElement.cloneNode(true);
    boardDisplay.replaceChild(clonedBoard, activeBoard.parentElement);

    // Update references
    if (activeBoard === player1Board) {
      player1Board = clonedBoard.childNodes[1];
    } else {
      player2Board = clonedBoard.childNodes[1];
    }
    activeBoard = clonedBoard.childNodes[1];
    activeBoard.childNodes.forEach(cell => {
      cell.classList.remove("clickable");
      console.log("done");
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
  return {
    // Create and render display of both players boards
    renderInitialBoard(player1Grid, player2Grid) {
      boardDisplay = document.querySelector(".board-display");
      createGridDisplay(player2Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID);
      createGridDisplay(player1Grid, _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID);
      player1Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID}`);
      player2Board = document.querySelector(`#${_constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID}`);
      activeBoard = player2Board;
    },
    // Make all possible start positions for ships selectable
    async enableShipStartPositionSelection() {
      return new Promise(resolve => {
        Array.from(activeBoard.childNodes).forEach(cell => {
          if (!cell.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP)) {
            // Make selectable by click
            cell.addEventListener("click", () => selectCellEvent(cell, resolve));
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
      let colour = null;
      let playerID = hidden ? _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_2_BOARD_ID : _constants__WEBPACK_IMPORTED_MODULE_0__.PLAYER_1_BOARD_ID;

      // Placing ship tiles along the y-axis
      if (startX === endX) {
        start = Math.min(startY, endY);
        end = Math.max(startY, endY);
        colour = SHIP_COLOURS[end - start + 1];
        for (let y = start; y < end + 1; y += 1) {
          const cell = document.querySelector(`.grid-cell[data-player-id="${playerID}"][data-x="${startX}"][data-y="${y}"]`);
          if (!hidden) {
            cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
            cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
            cell.style.backgroundColor = colour;
          }
        }
      }
      // Placing ship tiles along the x-axis
      else {
        start = Math.min(startX, endX);
        end = Math.max(startX, endX);
        colour = SHIP_COLOURS[end - start + 1];
        for (let x = start; x < end + 1; x += 1) {
          const cell = document.querySelector(`.grid-cell[data-player-id="${playerID}"][data-x="${x}"][data-y="${startY}"]`);
          if (!hidden) {
            cell.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.SHIP);
            cell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
            cell.style.backgroundColor = colour;
          }
        }
      }
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

      // Remove any earlier styling
      attackedCell.style.backgroundColor = "";
      attackedCell.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.WATER);
      attackedCell.classList.remove("clickable");
      attackedCell.classList.add(hit ? _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.HIT : _constants__WEBPACK_IMPORTED_MODULE_0__.TILE_CLASSES.MISS);
    },
    // Change which board is active
    switchActiveBoard() {
      activeBoard.parentElement.childNodes[0].classList.remove("board-title-active");
      activeBoard = activeBoard === player1Board ? player2Board : player1Board;
      activeBoard.parentElement.childNodes[0].classList.add("board-title-active");
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
    --grid-cell-size: 3rem;

    --banner-background: #00000099;

    --board-title-background: rgb(2, 110, 110);

    --tile-active: rgb(0, 253, 253);
    --tile-inactive: rgb(0, 199, 199);
    --tile-hovered: rgb(0, 183, 255);
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

    background-color: #b9b9b9;
}

.board-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    background-color: #000000;
    box-shadow: 2px 10px 15px #000025;
}

/*
 * ------------------------------------------------------------
 * Board Styling
 * ------------------------------------------------------------
 */
.board-title {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 1rem 2rem;
    margin: 1px;

    color: #000000;
    background-color: var(--board-title-background);
}

.board-title-active {
    color: #ffffff;
}

.game-board {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--grid-cell-gap);

    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));
    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));

    padding: 2px;

    background-color: #000000;
}

/*
 * ------------------------------------------------------------
 * Cell Styling
 * ------------------------------------------------------------
 */
.grid-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--grid-cell-size);
    height: var(--grid-cell-size);
}

.water-cell {
    background-color: var(--tile-inactive);
}

.clickable {
    cursor: pointer;

    background-color: var(--tile-active);
}
.clickable:hover {
    background-color: var(--tile-hovered);
}

.ship-cell {
    background-color: rgb(197, 197, 197);
}

.miss-cell {
    background-color: #ffffff;
}

.hit-cell {
    background-color: red;
}

/*
 * ------------------------------------------------------------
 * Message Styling
 * ------------------------------------------------------------
 */
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
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;;IAE9B,0CAA0C;;IAE1C,+BAA+B;IAC/B,iCAAiC;IACjC,gCAAgC;AACpC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;;IAEvB,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;IACzB,iCAAiC;AACrC;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,kBAAkB;IAClB,WAAW;;IAEX,cAAc;IACd,+CAA+C;AACnD;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,eAAe;IACf,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;AACjC;;AAEA;IACI,sCAAsC;AAC1C;;AAEA;IACI,eAAe;;IAEf,oCAAoC;AACxC;AACA;IACI,qCAAqC;AACzC;;AAEA;IACI,oCAAoC;AACxC;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,qBAAqB;IACrB,iBAAiB;;IAEjB,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 3rem;\r\n\r\n    --banner-background: #00000099;\r\n\r\n    --board-title-background: rgb(2, 110, 110);\r\n\r\n    --tile-active: rgb(0, 253, 253);\r\n    --tile-inactive: rgb(0, 199, 199);\r\n    --tile-hovered: rgb(0, 183, 255);\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    background-color: #b9b9b9;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n    box-shadow: 2px 10px 15px #000025;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Board Styling\r\n * ------------------------------------------------------------\r\n */\r\n.board-title {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    padding: 1rem 2rem;\r\n    margin: 1px;\r\n\r\n    color: #000000;\r\n    background-color: var(--board-title-background);\r\n}\r\n\r\n.board-title-active {\r\n    color: #ffffff;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Cell Styling\r\n * ------------------------------------------------------------\r\n */\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n}\r\n\r\n.water-cell {\r\n    background-color: var(--tile-inactive);\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n\r\n    background-color: var(--tile-active);\r\n}\r\n.clickable:hover {\r\n    background-color: var(--tile-hovered);\r\n}\r\n\r\n.ship-cell {\r\n    background-color: rgb(197, 197, 197);\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Message Styling\r\n * ------------------------------------------------------------\r\n */\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    margin-bottom: 1.5rem;\r\n    padding: 1.5rem 0;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sZ0ZBQWdGLFlBQVksYUFBYSxjQUFjLGNBQWMsY0FBYyxhQUFhLGFBQWEsYUFBYSxPQUFPLFFBQVEsS0FBSyxLQUFLLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxjQUFjLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFlBQVksWUFBWSxhQUFhLE9BQU8sUUFBUSxLQUFLLEtBQUssVUFBVSxZQUFZLGNBQWMsYUFBYSxZQUFZLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxZQUFZLFdBQVcsYUFBYSxhQUFhLGNBQWMsWUFBWSxZQUFZLE9BQU8sUUFBUSxLQUFLLEtBQUssVUFBVSxZQUFZLGNBQWMsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxXQUFXLFlBQVksTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFL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O0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBa0Q7QUFDN0I7QUFFckIsZUFBZUMsSUFBSUEsQ0FBQSxFQUFHO0VBQ2xCLE1BQU1DLFdBQVcsR0FBR3BELCtEQUFpQixDQUFDLENBQUM7RUFDdkNvRCxXQUFXLENBQUM3QyxTQUFTLENBQUMsQ0FBQztFQUN2QixNQUFNNkMsV0FBVyxDQUFDM0MsVUFBVSxDQUFDLENBQUM7RUFDOUIyQyxXQUFXLENBQUN0QyxRQUFRLENBQUMsQ0FBQztBQUMxQjtBQUVBcUMsSUFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbUJvYXJkSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZG9tTWVzc2FnZUhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJPQVJEX1dJRFRIID0gMTA7XHJcbmNvbnN0IFBMQVlFUl8xX0JPQVJEX0lEID0gXCJwbGF5ZXIxQm9hcmRcIjtcclxuY29uc3QgUExBWUVSXzJfQk9BUkRfSUQgPSBcInBsYXllcjJCb2FyZFwiO1xyXG5jb25zdCBNQVhfU0hJUFMgPSA1O1xyXG5cclxuY29uc3QgVElMRVMgPSB7XHJcbiAgICBXQVRFUjogXCJXXCIsXHJcbiAgICBNSVNTOiBcIk9cIixcclxuICAgIEhJVDogXCJYXCIsXHJcbn07XHJcblxyXG5jb25zdCBUSUxFX0NMQVNTRVMgPSB7XHJcbiAgICBXQVRFUjogXCJ3YXRlci1jZWxsXCIsXHJcbiAgICBNSVNTOiBcIm1pc3MtY2VsbFwiLFxyXG4gICAgSElUOiBcImhpdC1jZWxsXCIsXHJcbiAgICBTSElQOiBcInNoaXAtY2VsbFwiLFxyXG59O1xyXG5cclxuZXhwb3J0IHtcclxuICAgIEJPQVJEX1dJRFRILFxyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIE1BWF9TSElQUyxcclxuICAgIFRJTEVTLFxyXG4gICAgVElMRV9DTEFTU0VTLFxyXG59O1xyXG4iLCJpbXBvcnQge1xyXG4gICAgUExBWUVSXzFfQk9BUkRfSUQsXHJcbiAgICBQTEFZRVJfMl9CT0FSRF9JRCxcclxuICAgIFRJTEVfQ0xBU1NFUyxcclxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZURPTUJvYXJkSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IFNISVBfQ09MT1VSUyA9IHtcclxuICAgICAgICAyOiBcImhzbCgzMjAsIDYwJSwgODUlKVwiLFxyXG4gICAgICAgIDM6IFwiaHNsKDMwLCA2MCUsIDg1JSlcIixcclxuICAgICAgICA0OiBcImhzbCgyNzAsIDYwJSwgNzUlKVwiLFxyXG4gICAgICAgIDU6IFwiaHNsKDEyMCwgNjAlLCA4NSUpXCIsXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBib2FyZERpc3BsYXkgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjFCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgLy8gRXZlbnQgZm9yIHNlbGVjdGluZyBhIGNlbGwgb24gdGhlIGJvYXJkIGFuZCByZXR1cm5pbmcgaXQncyBjb29yZGluYXRlc1xyXG4gICAgY29uc3Qgc2VsZWN0Q2VsbEV2ZW50ID0gKGdyaWRDZWxsLCByZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2VsbENvb3JkaW5hdGVzID0gW1xyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiksXHJcbiAgICAgICAgICAgIGdyaWRDZWxsLmdldEF0dHJpYnV0ZShcImRhdGEteVwiKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICByZXNvbHZlKGNlbGxDb29yZGluYXRlcyk7XHJcbiAgICAgICAgZGlzYWJsZUNlbGxTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiBhIHBsYXllcidzIGdyaWQgdG8gZGlzcGxheSByZWxldmFudCBnYW1lIGluZm9ybWF0aW9uIHRvIHRoZSBwbGF5ZXJcclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUdyaWREaXNwbGF5KGdyaWQsIGlkKSB7XHJcbiAgICAgICAgY29uc3QgYm9hcmRIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XHJcbiAgICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZChcImJvYXJkLXRpdGxlXCIpO1xyXG4gICAgICAgIGlmIChpZCA9PT0gUExBWUVSXzFfQk9BUkRfSUQpIHtcclxuICAgICAgICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZChcInBsYXllci1ib2FyZC10aXRsZVwiKTtcclxuICAgICAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIllvdXIgU2hpcHNcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwib3Bwb25lbnQtYm9hcmQtdGl0bGVcIik7XHJcbiAgICAgICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJPcHBvbmVudCBTaGlwc1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGJvYXJkLmlkID0gaWQ7XHJcbiAgICAgICAgYm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWUtYm9hcmRcIik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBncmlkIGNlbGxzIHdpdGggY2VsbCBpbmZvcm1hdGlvbiBzdG9yZWQgYW5kIGRpc3BsYXllZFxyXG4gICAgICAgIGdyaWQuZm9yRWFjaCgocm93LCB4KSA9PiB7XHJcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChfLCB5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncmlkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoVElMRV9DTEFTU0VTLldBVEVSKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCB4KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteVwiLCB5KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIsIGlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChncmlkQ2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBib2FyZEhvbGRlci5hcHBlbmRDaGlsZCh0aXRsZSk7XHJcbiAgICAgICAgYm9hcmRIb2xkZXIuYXBwZW5kQ2hpbGQoYm9hcmQpO1xyXG4gICAgICAgIGJvYXJkRGlzcGxheS5wcmVwZW5kKGJvYXJkSG9sZGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgYWJpbGl0eSB0byBzZWxlY3QgYW55IGNlbGxzIG9uIHRoZSBjdXJyZW50IGFjdGl2ZSBib2FyZFxyXG4gICAgZnVuY3Rpb24gZGlzYWJsZUNlbGxTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gQ2xvbmUgdGhlIHBhcmVudCBub2RlIHRvIHJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgY29uc3QgY2xvbmVkQm9hcmQgPSBhY3RpdmVCb2FyZC5wYXJlbnRFbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICBib2FyZERpc3BsYXkucmVwbGFjZUNoaWxkKGNsb25lZEJvYXJkLCBhY3RpdmVCb2FyZC5wYXJlbnRFbGVtZW50KTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHJlZmVyZW5jZXNcclxuICAgICAgICBpZiAoYWN0aXZlQm9hcmQgPT09IHBsYXllcjFCb2FyZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBjbG9uZWRCb2FyZC5jaGlsZE5vZGVzWzFdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGNsb25lZEJvYXJkLmNoaWxkTm9kZXNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFjdGl2ZUJvYXJkID0gY2xvbmVkQm9hcmQuY2hpbGROb2Rlc1sxXTtcclxuXHJcbiAgICAgICAgYWN0aXZlQm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb25lXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERldGVybWluZXMgd2hldGhlciBhIGdpdmVuIHNldCBvZiBwb2ludHMgYXJlIHZhbGlkIHRvIGhhdmUgYSBzaGlwIHBsYWNlZCBiZXR3ZWVuIHRoZW1cclxuICAgIGZ1bmN0aW9uIHZhbGlkRW5kUG9pbnQoW3N0YXJ0WCwgc3RhcnRZXSwgW2VuZFgsIGVuZFldLCBhbGxvd2VkTGVuZ3Rocykge1xyXG4gICAgICAgIC8vIFNhbWUgY28tb3JkaW5hdGVcclxuICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYICYmIHN0YXJ0WSA9PT0gZW5kWSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGVuZ3RoID0gbnVsbDtcclxuICAgICAgICBsZXQgc3RhcnQgPSBudWxsO1xyXG4gICAgICAgIGxldCBlbmQgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBhbnkgcmVtYWluaW5nIHNoaXBzIG9mIHZhbGlkIGxlbmd0aCB0byBicmlkZ2UgdGhlc2UgcG9pbnRzXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAob2JqKSA9PiBvYmoubnVtYmVyID09PSBNYXRoLmFicyhzdGFydFkgLSBlbmRZKSArIDEsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3Igc2hpcHMgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcclxuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoc3RhcnRZLCBlbmRZKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSBzdGFydDsgeSA8IGVuZCArIDE7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHtzdGFydFh9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBhbnkgcmVtYWluaW5nIHNoaXBzIG9mIHZhbGlkIGxlbmd0aCB0byBicmlkZ2UgdGhlc2UgcG9pbnRzXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAob2JqKSA9PiBvYmoubnVtYmVyID09PSBNYXRoLmFicyhzdGFydFggLSBlbmRYKSArIDEsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3Igc2hpcHMgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBzdGFydDsgeCA8IGVuZCArIDE7IHggKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3N0YXJ0WX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmFsaWQgY29vcmRpbmF0ZXNcclxuICAgICAgICBpZiAobGVuZ3RoICYmIGxlbmd0aC5yZW1haW5pbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGFuZCByZW5kZXIgZGlzcGxheSBvZiBib3RoIHBsYXllcnMgYm9hcmRzXHJcbiAgICAgICAgcmVuZGVySW5pdGlhbEJvYXJkKHBsYXllcjFHcmlkLCBwbGF5ZXIyR3JpZCkge1xyXG4gICAgICAgICAgICBib2FyZERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkLWRpc3BsYXlcIik7XHJcblxyXG4gICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIyR3JpZCwgUExBWUVSXzJfQk9BUkRfSUQpO1xyXG4gICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIxR3JpZCwgUExBWUVSXzFfQk9BUkRfSUQpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzFfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke1BMQVlFUl8yX0JPQVJEX0lEfWApO1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9IHBsYXllcjJCb2FyZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBwb3NzaWJsZSBzdGFydCBwb3NpdGlvbnMgZm9yIHNoaXBzIHNlbGVjdGFibGVcclxuICAgICAgICBhc3luYyBlbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBwb3NzaWJsZSBlbmQgcG9zaXRpb25zIGZvciBzaGlwcyBzZWxlY3RhYmxlXHJcbiAgICAgICAgYXN5bmMgZW5hYmxlU2hpcEVuZFBvc2l0aW9uU2VsZWN0aW9uKHN0YXJ0UG9zLCBhbGxvd2VkTGVuZ3Rocykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKFRJTEVfQ0xBU1NFUy5TSElQKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZEVuZFBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXhcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dlZExlbmd0aHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzZWxlY3RhYmxlIGJ5IGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDZWxsRXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgcGxhY2VkIHNoaXAgdG8gdGhlIGJvYXJkXHJcbiAgICAgICAgcGxhY2VTaGlwKFtzdGFydFgsIHN0YXJ0WV0sIFtlbmRYLCBlbmRZXSwgaGlkZGVuKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBlbmQgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY29sb3VyID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IHBsYXllcklEID0gaGlkZGVuID8gUExBWUVSXzJfQk9BUkRfSUQgOiBQTEFZRVJfMV9CT0FSRF9JRDtcclxuXHJcbiAgICAgICAgICAgIC8vIFBsYWNpbmcgc2hpcCB0aWxlcyBhbG9uZyB0aGUgeS1heGlzXHJcbiAgICAgICAgICAgIGlmIChzdGFydFggPT09IGVuZFgpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WSwgZW5kWSk7XHJcbiAgICAgICAgICAgICAgICBjb2xvdXIgPSBTSElQX0NPTE9VUlNbZW5kIC0gc3RhcnQgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gc3RhcnQ7IHkgPCBlbmQgKyAxOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1wbGF5ZXItaWQ9XCIke3BsYXllcklEfVwiXVtkYXRhLXg9XCIke3N0YXJ0WH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFRJTEVfQ0xBU1NFUy5TSElQKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHgtYXhpc1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgICAgICBjb2xvdXIgPSBTSElQX0NPTE9VUlNbZW5kIC0gc3RhcnQgKyAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gc3RhcnQ7IHggPCBlbmQgKyAxOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1wbGF5ZXItaWQ9XCIke3BsYXllcklEfVwiXVtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7c3RhcnRZfVwiXWAsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFRJTEVfQ0xBU1NFUy5TSElQKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIGF0dGFja2FibGUgY2VsbHMgb24gb3Bwb25lbnQncyBib2FyZCBzZWxlY3RhYmxlIGZvciBhdHRhY2tzXHJcbiAgICAgICAgYXN5bmMgZW5hYmxlQXR0YWNrU2VsZWN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGlsZSBoYXNuJ3QgYWxyZWFkeSBiZWVuIGF0dGFja2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFbVElMRV9DTEFTU0VTLkhJVCwgVElMRV9DTEFTU0VTLk1JU1NdLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGlsZVR5cGUpID0+IGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKHRpbGVUeXBlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBBbHRlciB0aGUgYm9hcmQgdG8gcmVmbGVjdCBhbiBhdHRhY2tcclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSwgaGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1bZGF0YS1wbGF5ZXItaWQ9XCIke2FjdGl2ZUJvYXJkLmlkfVwiXWAsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IGVhcmxpZXIgc3R5bGluZ1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFRJTEVfQ0xBU1NFUy5XQVRFUik7XHJcbiAgICAgICAgICAgIGF0dGFja2VkQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LmFkZChcclxuICAgICAgICAgICAgICAgIGhpdCA/IFRJTEVfQ0xBU1NFUy5ISVQgOiBUSUxFX0NMQVNTRVMuTUlTUyxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDaGFuZ2Ugd2hpY2ggYm9hcmQgaXMgYWN0aXZlXHJcbiAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QucmVtb3ZlKFxyXG4gICAgICAgICAgICAgICAgXCJib2FyZC10aXRsZS1hY3RpdmVcIixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPVxyXG4gICAgICAgICAgICAgICAgYWN0aXZlQm9hcmQgPT09IHBsYXllcjFCb2FyZCA/IHBsYXllcjJCb2FyZCA6IHBsYXllcjFCb2FyZDtcclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQucGFyZW50RWxlbWVudC5jaGlsZE5vZGVzWzBdLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgICAgICAgICBcImJvYXJkLXRpdGxlLWFjdGl2ZVwiLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NQm9hcmRIYW5kbGVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgLy8gQ3JlYXRlIG1lc3NhZ2UgYmFubmVyXHJcbiAgICAvLyBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAvLyBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XHJcbiAgICBjb25zdCBtZXNzYWdlQmFubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lc3NhZ2VCYW5uZXIuY2xhc3NMaXN0LmFkZChcIm1lc3NhZ2UtYmFubmVyXCIpO1xyXG4gICAgLy8gbW9kYWwuYXBwZW5kQ2hpbGQobWVzc2FnZUJhbm5lcik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5wcmVwZW5kKG1lc3NhZ2VCYW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGlzcGxheVNoaXBQbGFjZVByb21wdChzaGlwc1JlbWFpbmluZykge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gYFBsYWNlIGEgc2hpcCwgJHtzaGlwc1JlbWFpbmluZ30gc2hpcHMgcmVtYWluaW5nYDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5Q3VycmVudFR1cm4ocGxheWVyVHVybiA9IHRydWUpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IHBsYXllclR1cm5cclxuICAgICAgICAgICAgICAgID8gXCJZb3VyIHR1cm4hIE1ha2UgYW4gYXR0YWNrXCJcclxuICAgICAgICAgICAgICAgIDogYE9wcG9uZW50IFR1cm4hIE1ha2luZyBhbiBhdHRhY2tgO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlBdHRhY2tSZXN1bHQoaGl0KSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBoaXQgPyBcIlNoaXAgaGl0IVwiIDogXCJTaG90IG1pc3NlZCFcIjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5V2lubmVyKG5hbWUpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IGBWaWN0b3J5IGZvciAke25hbWV9IWA7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVET01NZXNzYWdlSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlRE9NQm9hcmRIYW5kbGVyIH0gZnJvbSBcIi4vZG9tQm9hcmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xyXG5pbXBvcnQgeyBjcmVhdGVET01NZXNzYWdlSGFuZGxlciB9IGZyb20gXCIuL2RvbU1lc3NhZ2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE1BWF9TSElQUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgYWN0aXZlUGxheWVyID0gYWN0aXZlUGxheWVyID09PSBwbGF5ZXIxID8gcGxheWVyMiA6IHBsYXllcjE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPVxyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBib2FyZEhhbmRsZXIgPSBudWxsO1xyXG4gICAgbGV0IG1lc3NhZ2VIYW5kbGVyID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMiA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgYWN0aXZlUGxheWVyID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlciA9IGNyZWF0ZURPTUJvYXJkSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBtZXNzYWdlSGFuZGxlciA9IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKGZhbHNlKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIyID0gY3JlYXRlUGxheWVyKHRydWUpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9IHBsYXllcjE7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnJlbmRlckluaXRpYWxCb2FyZChcclxuICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5nZXRHcmlkKCksXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEZpbGwgdGhlIGJvYXJkIHdpdGggc2hpcHNcclxuICAgICAgICBhc3luYyBzZXR1cFNoaXBzKCkge1xyXG4gICAgICAgICAgICBsZXQgcGxhY2VkID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB1cCBjb21wdXRlciBzaGlwc1xyXG4gICAgICAgICAgICB3aGlsZSAocGxhY2VkIDwgTUFYX1NISVBTKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUcnkgcGxhY2luZyBhIHNoaXAgYXQgY29tcHV0ZXIgZ2VuZXJhdGVkIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBbc3RhcnRQb3MsIGVuZFBvc10gPSBwbGF5ZXIyLnByb3ZpZGVTaGlwQ29vcmRpbmF0ZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5nZXRBbGxvd2VkTGVuZ3RocygpLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbc3RhcnRQb3MsIGVuZFBvc10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5wbGFjZVNoaXAoc3RhcnRQb3MsIGVuZFBvcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VkICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coW3N0YXJ0UG9zLCBlbmRQb3NdKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGNvb3JkaW5hdGVzIGludmFsaWQsIGFzayBhZ2FpblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBib2FyZEhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgcGxhY2VkID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB1cCBwbGF5ZXIgc2hpcHNcclxuICAgICAgICAgICAgd2hpbGUgKHBsYWNlZCA8IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheVNoaXBQbGFjZVByb21wdChNQVhfU0hJUFMgLSBwbGFjZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdhaXQgZm9yIHNoaXAgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kUG9zID0gYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZVNoaXBFbmRQb3NpdGlvblNlbGVjdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFBvcyxcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0QWxsb3dlZExlbmd0aHMoKSxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVHJ5IHBsYWNpbmcgYSBzaGlwIGF0IHRob3NlIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW3N0YXJ0UG9zLCBlbmRQb3NdKTtcclxuICAgICAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIucGxhY2VTaGlwKHN0YXJ0UG9zLCBlbmRQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgY29vcmRpbmF0ZXMgaW52YWxpZCwgYXNrIGFnYWluXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlci5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1haW4gZ2FtZSBsb29wXHJcbiAgICAgICAgYXN5bmMgcGxheUdhbWUoKSB7XHJcbiAgICAgICAgICAgIGxldCBnYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCFnYW1lT3Zlcikge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheUN1cnJlbnRUdXJuKCFhY3RpdmVQbGF5ZXIuaXNDb21wdXRlcik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsaWRBdHRhY2sgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIXZhbGlkQXR0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGF0dGFjayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhpdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjb21wdXRlciBwbGF5ZXIgbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVQbGF5ZXIuaXNDb21wdXRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXVzZSB0byBzaW11bGF0ZSBjb21wdXRlciB0aGlua2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBc2sgY29tcHV0ZXIgZm9yIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2sgPSBhY3RpdmVQbGF5ZXIucHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgaHVtYW4gcGxheWVyIG1vdmVcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNrIGh1bWFuIHBsYXllciBmb3IgYXR0YWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjayA9IGF3YWl0IGJvYXJkSGFuZGxlci5lbmFibGVBdHRhY2tTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0aGF0IGF0dGFjayBvbiBvcHBvbmVudCBib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdCA9IGFjdGl2ZUJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnJlY2VpdmVBdHRhY2soYXR0YWNrLCBoaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZEF0dGFjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlBdHRhY2tSZXN1bHQoaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYXR0YWNrIGlzIGludmFsaWQsIGFzayBhZ2FpblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHJlZ2lzdGVyIGl0IGFuZCB0aGVuIGF3YWl0IGlucHV0IGZyb20gb3RoZXIgcGxheWVyXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQm9hcmQuaXNGbGVldFN1bmsoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdhbWUgb3ZlclxyXG4gICAgICAgICAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5V2lubmVyKFwiUGxheWVyIDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBwbGF5ZXIgdHVybnNcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZVBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5zd2l0Y2hBY3RpdmVCb2FyZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBCT0FSRF9XSURUSCwgTUFYX1NISVBTLCBUSUxFUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZWJvYXJkID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYWxsb3dlZExlbmd0aHMgPSBbXHJcbiAgICAgICAgeyBudW1iZXI6IDIsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiAzLCByZW1haW5pbmc6IDIgfSxcclxuICAgICAgICB7IG51bWJlcjogNCwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDUsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBncmlkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogQk9BUkRfV0lEVEggfSwgKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9KS5maWxsKFRJTEVTLldBVEVSKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBsYWNlZFNoaXBzID0gW107XHJcblxyXG4gICAgLy8gQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBwYWlyIG9mIGNvb3JkaW5hdGVzIGlzIHZhbGlkIGZvciBwbGFjaW5nIGEgc2hpcFxyXG4gICAgZnVuY3Rpb24gaXNWYWxpZENvb3JkcyhtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZKSB7XHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgb2ZmIHRoZSBib2FyZFxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgW21pblgsIG1pblksIG1heFgsIG1heFldLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAoY29vcmQpID0+IGNvb3JkIDwgMCB8fCBjb29yZCA+PSBCT0FSRF9XSURUSCxcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaGlwIHBsYWNlZCBkaWFnb25hbGx5XHJcbiAgICAgICAgaWYgKG1pblggIT09IG1heFggJiYgbWluWSAhPT0gbWF4WSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3Igc2hpcHMgYWxyZWFkeSBpbiB0aGUgZ3JpZFxyXG4gICAgICAgIGZvciAobGV0IHggPSBtaW5YOyB4IDw9IG1heFg7IHggKz0gMSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYWxyZWFkeSBwbGFjZWQgdGhlcmVcclxuICAgICAgICAgICAgICAgIGlmIChncmlkW3hdW3ldICE9PSBUSUxFUy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBQbGFjZSBhIHNoaXAgb24gdGhlIGdhbWUgYm9hcmQgYmFzZWQgb24gc3RhcnQgYW5kIGVuZCBjb29yZGluYXRlc1xyXG4gICAgICAgIHBsYWNlU2hpcChbW3N0YXJ0WCwgc3RhcnRZXSwgW2VuZFgsIGVuZFldXSkge1xyXG4gICAgICAgICAgICAvLyBNYXggc2hpcHMgYWxyZWFkeSBwbGFjZWRcclxuICAgICAgICAgICAgaWYgKHBsYWNlZFNoaXBzLmxlbmd0aCA+PSBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgY2FwYWNpdHkgcmVhY2hlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbWluWCA9IE1hdGgubWluKHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heFggPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xyXG4gICAgICAgICAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oc3RhcnRZLCBlbmRZKTtcclxuICAgICAgICAgICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KHN0YXJ0WSwgZW5kWSk7XHJcblxyXG4gICAgICAgICAgICAvLyBJbnZhbGlkIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZENvb3JkcyhtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlc1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9XHJcbiAgICAgICAgICAgICAgICAxICsgTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCksIE1hdGguYWJzKHN0YXJ0WSAtIGVuZFkpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHNoaXAgbGVuZ3RoIHZhbGlkaXR5XHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGFsbG93ZWRMZW5ndGhzLmZpbmQoKG9iaikgPT4gb2JqLm51bWJlciA9PT0gc2hpcExlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQgfHwgb2JqLnJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNoaXAgbGVuZ3RoXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHNoaXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NoaXAgPSBjcmVhdGVTaGlwKHNoaXBMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VkU2hpcHMucHVzaChuZXdTaGlwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgc2hpcCByZWZlcmVuY2VzIHRvIHRoZSBncmlkXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBwbGFjZWRTaGlwcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBvYmoucmVtYWluaW5nIC09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xyXG4gICAgICAgICAgICBpZiAoW3gsIHldLnNvbWUoKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBncmlkW3hdW3ldO1xyXG5cclxuICAgICAgICAgICAgLy8gRHVwbGljYXRlIGF0dGFja1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSBUSUxFUy5NSVNTIHx8IHNxdWFyZSA9PT0gVElMRVMuSElUKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbHJlYWR5IGF0dGFja2VkIHRoaXMgc3F1YXJlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNaXNzXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuTUlTUztcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEhpdFxyXG4gICAgICAgICAgICBwbGFjZWRTaGlwc1tzcXVhcmVdLmhpdCgpO1xyXG4gICAgICAgICAgICBncmlkW3hdW3ldID0gVElMRVMuSElUO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaXNGbGVldFN1bmsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZWRTaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0R3JpZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdyaWQ7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0QWxsb3dlZExlbmd0aHMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGxvd2VkTGVuZ3RocztcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVib2FyZCB9O1xyXG4iLCJpbXBvcnQgeyBCT0FSRF9XSURUSCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlUGxheWVyID0gKGlzQ29tcHV0ZXIpID0+IHtcclxuICAgIC8vIEZpbGwgYW4gYXJyYXkgd2l0aCBhbGwgcG9zc2libGUgYXR0YWNrcyBvbiB0aGUgYm9hcmRcclxuICAgIGNvbnN0IHBvc3NpYmxlQXR0YWNrcyA9IFtdO1xyXG5cclxuICAgIGNvbnN0IG9yaWVudGF0aW9ucyA9IHtcclxuICAgICAgICBIT1JJWk9OVEFMOiAwLFxyXG4gICAgICAgIFZFUlRJQ0FMOiAxLFxyXG4gICAgfTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEJPQVJEX1dJRFRIOyB4ICs9IDEpIHtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IEJPQVJEX1dJRFRIOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgcG9zc2libGVBdHRhY2tzLnB1c2goW3gsIHldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0NvbXB1dGVyLFxyXG5cclxuICAgICAgICBwcm92aWRlU2hpcENvb3JkaW5hdGVzKGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSBzdGFydCBjby1vcmRpbmF0ZXNcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnRYID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQk9BUkRfV0lEVEgpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCT0FSRF9XSURUSCk7XHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSBvcmllbnRhdGlvblxyXG4gICAgICAgICAgICBjb25zdCBvcmllbnRhdGlvbiA9XHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpIDwgMC41XHJcbiAgICAgICAgICAgICAgICAgICAgPyBvcmllbnRhdGlvbnMuSE9SSVpPTlRBTFxyXG4gICAgICAgICAgICAgICAgICAgIDogb3JpZW50YXRpb25zLlZFUlRJQ0FMO1xyXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgbGVuZ3RoXHJcbiAgICAgICAgICAgIGxldCBzaGlwTGVuZ3RoID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGVuZ3RoIG9mIGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVuZ3RoLnJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGlwTGVuZ3RoID0gbGVuZ3RoLm51bWJlciAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFBsYWNlIHNoaXAgaG9yaXpvbnRhbGx5XHJcbiAgICAgICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gb3JpZW50YXRpb25zLkhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIGFjY29yZGluZyB0byBib2FyZCB3aWR0aCBsaW1pdGF0aW9uc1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0WCAtIHNoaXBMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCArIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRYICsgc2hpcExlbmd0aCA+PSBCT0FSRF9XSURUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFggLSBzaGlwTGVuZ3RoLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSByYW5kb21seSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFggKyBzaGlwTGVuZ3RoLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCAtIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFBsYWNlIHNoaXAgdmVydGljYWxseVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIGFjY29yZGluZyB0byBib2FyZCB3aWR0aCBsaW1pdGF0aW9uc1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0WSAtIHNoaXBMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZICsgc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRZICsgc2hpcExlbmd0aCA+PSBCT0FSRF9XSURUSCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WSAtIHNoaXBMZW5ndGhdLFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSByYW5kb21seSB1cCBvciBkb3duXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WSArIHNoaXBMZW5ndGhdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZIC0gc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcHJvdmlkZUF0dGFja0Nvb3JkaW5hdGVzKCkge1xyXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmFuZG9tIGF0dGFja1xyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2tOdW1iZXIgPSBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQXR0YWNrcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYXR0YWNrIGZyb20gYWxsIHBvc3NpYmxlIGF0dGFja3MgYW5kIHJldHVybiBpdFxyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2sgPSBwb3NzaWJsZUF0dGFja3Muc3BsaWNlKGF0dGFja051bWJlciwgMSlbMF07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXR0YWNrO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlUGxheWVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZVNoaXAgPSAoc2hpcExlbmd0aCkgPT4ge1xyXG4gICAgLy8gRXJyb3IgY2hlY2tpbmdcclxuICAgIGlmICh0eXBlb2Ygc2hpcExlbmd0aCAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihzaGlwTGVuZ3RoKSB8fCBzaGlwTGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcclxuICAgIGxldCBoaXRzID0gMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIENoZWNrcyB3aGV0aGVyIHRoZSBzaGlwIGhhcyBtb3JlIGhpdHMgdGhhbiBsaXZlc1xyXG4gICAgICAgIGlzU3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGhpdHMgPj0gbGVuZ3RoO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBkYW1hZ2FlIHRvIHRoZSBzaGlwIGFuZCBjaGVjayBmb3Igc2lua2luZ1xyXG4gICAgICAgIGhpdCgpIHtcclxuICAgICAgICAgICAgaGl0cyArPSAxO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlU2hpcCB9O1xyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgOnJvb3Qge1xyXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XHJcbiAgICAtLWdyaWQtcGFkZGluZzogMnB4O1xyXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogM3JlbTtcclxuXHJcbiAgICAtLWJhbm5lci1iYWNrZ3JvdW5kOiAjMDAwMDAwOTk7XHJcblxyXG4gICAgLS1ib2FyZC10aXRsZS1iYWNrZ3JvdW5kOiByZ2IoMiwgMTEwLCAxMTApO1xyXG5cclxuICAgIC0tdGlsZS1hY3RpdmU6IHJnYigwLCAyNTMsIDI1Myk7XHJcbiAgICAtLXRpbGUtaW5hY3RpdmU6IHJnYigwLCAxOTksIDE5OSk7XHJcbiAgICAtLXRpbGUtaG92ZXJlZDogcmdiKDAsIDE4MywgMjU1KTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEdlbmVyYWwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbioge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2I5YjliOTtcclxufVxyXG5cclxuLmJvYXJkLWRpc3BsYXkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGdhcDogMnJlbTtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG4gICAgYm94LXNoYWRvdzogMnB4IDEwcHggMTVweCAjMDAwMDI1O1xyXG59XHJcblxyXG4vKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogQm9hcmQgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbi5ib2FyZC10aXRsZSB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIHBhZGRpbmc6IDFyZW0gMnJlbTtcclxuICAgIG1hcmdpbjogMXB4O1xyXG5cclxuICAgIGNvbG9yOiAjMDAwMDAwO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYm9hcmQtdGl0bGUtYmFja2dyb3VuZCk7XHJcbn1cclxuXHJcbi5ib2FyZC10aXRsZS1hY3RpdmUge1xyXG4gICAgY29sb3I6ICNmZmZmZmY7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgZ2FwOiB2YXIoLS1ncmlkLWNlbGwtZ2FwKTtcclxuXHJcbiAgICB3aWR0aDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcclxuICAgIGhlaWdodDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcclxuXHJcbiAgICBwYWRkaW5nOiAycHg7XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIENlbGwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XHJcbn1cclxuXHJcbi53YXRlci1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbGUtaW5hY3RpdmUpO1xyXG59XHJcblxyXG4uY2xpY2thYmxlIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10aWxlLWFjdGl2ZSk7XHJcbn1cclxuLmNsaWNrYWJsZTpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10aWxlLWhvdmVyZWQpO1xyXG59XHJcblxyXG4uc2hpcC1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigxOTcsIDE5NywgMTk3KTtcclxufVxyXG5cclxuLm1pc3MtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG59XHJcblxyXG4uaGl0LWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xyXG59XHJcblxyXG4vKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogTWVzc2FnZSBTdHlsaW5nXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKi9cclxuLm1lc3NhZ2UtYmFubmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgaGVpZ2h0OiAxMCU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuXHJcbiAgICBtYXJnaW4tYm90dG9tOiAxLjVyZW07XHJcbiAgICBwYWRkaW5nOiAxLjVyZW0gMDtcclxuXHJcbiAgICBmb250LXNpemU6IHh4eC1sYXJnZTtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFubmVyLWJhY2tncm91bmQpO1xyXG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixzQkFBc0I7O0lBRXRCLDhCQUE4Qjs7SUFFOUIsMENBQTBDOztJQUUxQywrQkFBK0I7SUFDL0IsaUNBQWlDO0lBQ2pDLGdDQUFnQztBQUNwQzs7QUFFQTs7OztFQUlFO0FBQ0Y7SUFDSSxzQkFBc0I7SUFDdEIsU0FBUztJQUNULFVBQVU7QUFDZDs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsU0FBUzs7SUFFVCx5QkFBeUI7SUFDekIsaUNBQWlDO0FBQ3JDOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixrQkFBa0I7SUFDbEIsV0FBVzs7SUFFWCxjQUFjO0lBQ2QsK0NBQStDO0FBQ25EOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsZUFBZTtJQUNmLHlCQUF5Qjs7SUFFekIsOEdBQThHO0lBQzlHLCtHQUErRzs7SUFFL0csWUFBWTs7SUFFWix5QkFBeUI7QUFDN0I7O0FBRUE7Ozs7RUFJRTtBQUNGO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7O0lBRXZCLDRCQUE0QjtJQUM1Qiw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxzQ0FBc0M7QUFDMUM7O0FBRUE7SUFDSSxlQUFlOztJQUVmLG9DQUFvQztBQUN4QztBQUNBO0lBQ0kscUNBQXFDO0FBQ3pDOztBQUVBO0lBQ0ksb0NBQW9DO0FBQ3hDOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kscUJBQXFCO0FBQ3pCOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2QixXQUFXO0lBQ1gsV0FBVzs7SUFFWCxxQkFBcUI7SUFDckIsaUJBQWlCOztJQUVqQixvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLFlBQVk7SUFDWiwwQ0FBMEM7QUFDOUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiOnJvb3Qge1xcclxcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcXHJcXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcXHJcXG4gICAgLS1ncmlkLWNlbGwtc2l6ZTogM3JlbTtcXHJcXG5cXHJcXG4gICAgLS1iYW5uZXItYmFja2dyb3VuZDogIzAwMDAwMDk5O1xcclxcblxcclxcbiAgICAtLWJvYXJkLXRpdGxlLWJhY2tncm91bmQ6IHJnYigyLCAxMTAsIDExMCk7XFxyXFxuXFxyXFxuICAgIC0tdGlsZS1hY3RpdmU6IHJnYigwLCAyNTMsIDI1Myk7XFxyXFxuICAgIC0tdGlsZS1pbmFjdGl2ZTogcmdiKDAsIDE5OSwgMTk5KTtcXHJcXG4gICAgLS10aWxlLWhvdmVyZWQ6IHJnYigwLCAxODMsIDI1NSk7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogR2VuZXJhbCBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuKiB7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjliOWI5O1xcclxcbn1cXHJcXG5cXHJcXG4uYm9hcmQtZGlzcGxheSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBnYXA6IDJyZW07XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxuICAgIGJveC1zaGFkb3c6IDJweCAxMHB4IDE1cHggIzAwMDAyNTtcXHJcXG59XFxyXFxuXFxyXFxuLypcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKiBCb2FyZCBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuLmJvYXJkLXRpdGxlIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDFyZW0gMnJlbTtcXHJcXG4gICAgbWFyZ2luOiAxcHg7XFxyXFxuXFxyXFxuICAgIGNvbG9yOiAjMDAwMDAwO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ib2FyZC10aXRsZS1iYWNrZ3JvdW5kKTtcXHJcXG59XFxyXFxuXFxyXFxuLmJvYXJkLXRpdGxlLWFjdGl2ZSB7XFxyXFxuICAgIGNvbG9yOiAjZmZmZmZmO1xcclxcbn1cXHJcXG5cXHJcXG4uZ2FtZS1ib2FyZCB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGZsZXgtd3JhcDogd3JhcDtcXHJcXG4gICAgZ2FwOiB2YXIoLS1ncmlkLWNlbGwtZ2FwKTtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuICAgIGhlaWdodDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG5cXHJcXG4gICAgcGFkZGluZzogMnB4O1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqIENlbGwgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbi5ncmlkLWNlbGwge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcXHJcXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XFxyXFxufVxcclxcblxcclxcbi53YXRlci1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGlsZS1pbmFjdGl2ZSk7XFxyXFxufVxcclxcblxcclxcbi5jbGlja2FibGUge1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbGUtYWN0aXZlKTtcXHJcXG59XFxyXFxuLmNsaWNrYWJsZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbGUtaG92ZXJlZCk7XFxyXFxufVxcclxcblxcclxcbi5zaGlwLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAxOTcsIDE5Nyk7XFxyXFxufVxcclxcblxcclxcbi5taXNzLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0LWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogTWVzc2FnZSBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuLm1lc3NhZ2UtYmFubmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG5cXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xcclxcbiAgICBwYWRkaW5nOiAxLjVyZW0gMDtcXHJcXG5cXHJcXG4gICAgZm9udC1zaXplOiB4eHgtbGFyZ2U7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhbm5lci1iYWNrZ3JvdW5kKTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcclxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBjb25zdCBiYXR0bGVTaGlwcyA9IGNyZWF0ZUdhbWVIYW5kbGVyKCk7XHJcbiAgICBiYXR0bGVTaGlwcy5zZXR1cEdhbWUoKTtcclxuICAgIGF3YWl0IGJhdHRsZVNoaXBzLnNldHVwU2hpcHMoKTtcclxuICAgIGJhdHRsZVNoaXBzLnBsYXlHYW1lKCk7XHJcbn1cclxuXHJcbm1haW4oKTtcclxuIl0sIm5hbWVzIjpbIkJPQVJEX1dJRFRIIiwiUExBWUVSXzFfQk9BUkRfSUQiLCJQTEFZRVJfMl9CT0FSRF9JRCIsIk1BWF9TSElQUyIsIlRJTEVTIiwiV0FURVIiLCJNSVNTIiwiSElUIiwiVElMRV9DTEFTU0VTIiwiU0hJUCIsImNyZWF0ZURPTUJvYXJkSGFuZGxlciIsIlNISVBfQ09MT1VSUyIsImJvYXJkRGlzcGxheSIsInBsYXllcjFCb2FyZCIsInBsYXllcjJCb2FyZCIsImFjdGl2ZUJvYXJkIiwic2VsZWN0Q2VsbEV2ZW50IiwiZ3JpZENlbGwiLCJyZXNvbHZlIiwiY2VsbENvb3JkaW5hdGVzIiwiZ2V0QXR0cmlidXRlIiwiZGlzYWJsZUNlbGxTZWxlY3Rpb24iLCJjcmVhdGVHcmlkRGlzcGxheSIsImdyaWQiLCJpZCIsImJvYXJkSG9sZGVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidGl0bGUiLCJjbGFzc0xpc3QiLCJhZGQiLCJ0ZXh0Q29udGVudCIsImJvYXJkIiwiZm9yRWFjaCIsInJvdyIsIngiLCJfIiwieSIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwicHJlcGVuZCIsImNsb25lZEJvYXJkIiwicGFyZW50RWxlbWVudCIsImNsb25lTm9kZSIsInJlcGxhY2VDaGlsZCIsImNoaWxkTm9kZXMiLCJjZWxsIiwicmVtb3ZlIiwiY29uc29sZSIsImxvZyIsInZhbGlkRW5kUG9pbnQiLCJfcmVmIiwiX3JlZjIiLCJhbGxvd2VkTGVuZ3RocyIsInN0YXJ0WCIsInN0YXJ0WSIsImVuZFgiLCJlbmRZIiwibGVuZ3RoIiwic3RhcnQiLCJlbmQiLCJmaW5kIiwib2JqIiwibnVtYmVyIiwiTWF0aCIsImFicyIsIm1pbiIsIm1heCIsInF1ZXJ5U2VsZWN0b3IiLCJjb250YWlucyIsInJlbWFpbmluZyIsInJlbmRlckluaXRpYWxCb2FyZCIsInBsYXllcjFHcmlkIiwicGxheWVyMkdyaWQiLCJlbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbiIsIlByb21pc2UiLCJBcnJheSIsImZyb20iLCJhZGRFdmVudExpc3RlbmVyIiwiZW5hYmxlU2hpcEVuZFBvc2l0aW9uU2VsZWN0aW9uIiwic3RhcnRQb3MiLCJwbGFjZVNoaXAiLCJfcmVmMyIsIl9yZWY0IiwiaGlkZGVuIiwiY29sb3VyIiwicGxheWVySUQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImVuYWJsZUF0dGFja1NlbGVjdGlvbiIsInNvbWUiLCJ0aWxlVHlwZSIsInJlY2VpdmVBdHRhY2siLCJfcmVmNSIsImhpdCIsImF0dGFja2VkQ2VsbCIsInN3aXRjaEFjdGl2ZUJvYXJkIiwiY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIiLCJtZXNzYWdlQmFubmVyIiwiZGlzcGxheVNoaXBQbGFjZVByb21wdCIsInNoaXBzUmVtYWluaW5nIiwiZGlzcGxheUN1cnJlbnRUdXJuIiwicGxheWVyVHVybiIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImRpc3BsYXlBdHRhY2tSZXN1bHQiLCJkaXNwbGF5V2lubmVyIiwibmFtZSIsImNyZWF0ZVBsYXllciIsImNyZWF0ZUdhbWVib2FyZCIsImNyZWF0ZUdhbWVIYW5kbGVyIiwic3dpdGNoQWN0aXZlUGxheWVyIiwiYWN0aXZlUGxheWVyIiwicGxheWVyMSIsInBsYXllcjIiLCJib2FyZEhhbmRsZXIiLCJtZXNzYWdlSGFuZGxlciIsInNldHVwR2FtZSIsImdldEdyaWQiLCJzZXR1cFNoaXBzIiwicGxhY2VkIiwiZW5kUG9zIiwicHJvdmlkZVNoaXBDb29yZGluYXRlcyIsImdldEFsbG93ZWRMZW5ndGhzIiwicGxheUdhbWUiLCJnYW1lT3ZlciIsImlzQ29tcHV0ZXIiLCJ2YWxpZEF0dGFjayIsImF0dGFjayIsInNldFRpbWVvdXQiLCJwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMiLCJpc0ZsZWV0U3VuayIsImNyZWF0ZVNoaXAiLCJmaWxsIiwicGxhY2VkU2hpcHMiLCJpc1ZhbGlkQ29vcmRzIiwibWluWCIsIm1pblkiLCJtYXhYIiwibWF4WSIsImNvb3JkIiwiRXJyb3IiLCJzaGlwTGVuZ3RoIiwibmV3U2hpcCIsInB1c2giLCJlcnJvciIsInNxdWFyZSIsImV2ZXJ5Iiwic2hpcCIsImlzU3VuayIsInBvc3NpYmxlQXR0YWNrcyIsIm9yaWVudGF0aW9ucyIsIkhPUklaT05UQUwiLCJWRVJUSUNBTCIsImZsb29yIiwicmFuZG9tIiwib3JpZW50YXRpb24iLCJhdHRhY2tOdW1iZXIiLCJzcGxpY2UiLCJpc05hTiIsImhpdHMiLCJtYWluIiwiYmF0dGxlU2hpcHMiXSwic291cmNlUm9vdCI6IiJ9