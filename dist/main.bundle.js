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

  // Event for selecting the start cell when placing a ship
  const selectShipStartEvent = (gridCell, resolve) => {
    gridCell.classList.add("ship-start");
    selectCellEvent(gridCell, resolve);
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

.ship-start {
    background-color: var(--tile-hovered);
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
}`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,oBAAoB;IACpB,mBAAmB;IACnB,sBAAsB;;IAEtB,8BAA8B;;IAE9B,0CAA0C;;IAE1C,+BAA+B;IAC/B,iCAAiC;IACjC,gCAAgC;AACpC;;AAEA;;;;EAIE;AACF;IACI,sBAAsB;IACtB,SAAS;IACT,UAAU;AACd;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;;IAEvB,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,SAAS;;IAET,yBAAyB;IACzB,iCAAiC;AACrC;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,kBAAkB;IAClB,WAAW;;IAEX,cAAc;IACd,+CAA+C;AACnD;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,eAAe;IACf,yBAAyB;;IAEzB,8GAA8G;IAC9G,+GAA+G;;IAE/G,YAAY;;IAEZ,yBAAyB;AAC7B;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,4BAA4B;IAC5B,6BAA6B;AACjC;;AAEA;IACI,sCAAsC;AAC1C;;AAEA;IACI,eAAe;;IAEf,oCAAoC;AACxC;AACA;IACI,qCAAqC;AACzC;;AAEA;IACI,oCAAoC;AACxC;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,qBAAqB;AACzB;;AAEA;IACI,qCAAqC;AACzC;;AAEA;;;;EAIE;AACF;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;;IAEvB,WAAW;IACX,WAAW;;IAEX,qBAAqB;IACrB,iBAAiB;;IAEjB,oBAAoB;IACpB,iBAAiB;IACjB,YAAY;IACZ,0CAA0C;AAC9C","sourcesContent":[":root {\r\n    --grid-cell-gap: 1px;\r\n    --grid-padding: 2px;\r\n    --grid-cell-size: 3rem;\r\n\r\n    --banner-background: #00000099;\r\n\r\n    --board-title-background: rgb(2, 110, 110);\r\n\r\n    --tile-active: rgb(0, 253, 253);\r\n    --tile-inactive: rgb(0, 199, 199);\r\n    --tile-hovered: rgb(0, 183, 255);\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * General Styling\r\n * ------------------------------------------------------------\r\n */\r\n* {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nbody {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    background-color: #b9b9b9;\r\n}\r\n\r\n.board-display {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 2rem;\r\n\r\n    background-color: #000000;\r\n    box-shadow: 2px 10px 15px #000025;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Board Styling\r\n * ------------------------------------------------------------\r\n */\r\n.board-title {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    padding: 1rem 2rem;\r\n    margin: 1px;\r\n\r\n    color: #000000;\r\n    background-color: var(--board-title-background);\r\n}\r\n\r\n.board-title-active {\r\n    color: #ffffff;\r\n}\r\n\r\n.game-board {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    gap: var(--grid-cell-gap);\r\n\r\n    width: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n    height: calc(calc(10 * var(--grid-cell-size)) + calc(var(--grid-padding) * 2) + calc(var(--grid-cell-gap) * 9));\r\n\r\n    padding: 2px;\r\n\r\n    background-color: #000000;\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Cell Styling\r\n * ------------------------------------------------------------\r\n */\r\n.grid-cell {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    width: var(--grid-cell-size);\r\n    height: var(--grid-cell-size);\r\n}\r\n\r\n.water-cell {\r\n    background-color: var(--tile-inactive);\r\n}\r\n\r\n.clickable {\r\n    cursor: pointer;\r\n\r\n    background-color: var(--tile-active);\r\n}\r\n.clickable:hover {\r\n    background-color: var(--tile-hovered);\r\n}\r\n\r\n.ship-cell {\r\n    background-color: rgb(197, 197, 197);\r\n}\r\n\r\n.miss-cell {\r\n    background-color: #ffffff;\r\n}\r\n\r\n.hit-cell {\r\n    background-color: red;\r\n}\r\n\r\n.ship-start {\r\n    background-color: var(--tile-hovered);\r\n}\r\n\r\n/*\r\n * ------------------------------------------------------------\r\n * Message Styling\r\n * ------------------------------------------------------------\r\n */\r\n.message-banner {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    height: 10%;\r\n    width: 100%;\r\n\r\n    margin-bottom: 1.5rem;\r\n    padding: 1.5rem 0;\r\n\r\n    font-size: xxx-large;\r\n    font-weight: bold;\r\n    color: white;\r\n    background-color: var(--banner-background);\r\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sZ0ZBQWdGLFlBQVksYUFBYSxjQUFjLGNBQWMsY0FBYyxhQUFhLGFBQWEsYUFBYSxPQUFPLFFBQVEsS0FBSyxLQUFLLFlBQVksV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxjQUFjLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxhQUFhLFlBQVksWUFBWSxhQUFhLE9BQU8sUUFBUSxLQUFLLEtBQUssVUFBVSxZQUFZLGNBQWMsYUFBYSxZQUFZLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxPQUFP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V0FBVyxDQUFDN0MsU0FBUyxDQUFDLENBQUM7RUFDdkIsTUFBTTZDLFdBQVcsQ0FBQzNDLFVBQVUsQ0FBQyxDQUFDO0VBQzlCMkMsV0FBVyxDQUFDdEMsUUFBUSxDQUFDLENBQUM7QUFDMUI7QUFFQXFDLElBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9kb21Cb2FyZEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbU1lc3NhZ2VIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCT0FSRF9XSURUSCA9IDEwO1xyXG5jb25zdCBQTEFZRVJfMV9CT0FSRF9JRCA9IFwicGxheWVyMUJvYXJkXCI7XHJcbmNvbnN0IFBMQVlFUl8yX0JPQVJEX0lEID0gXCJwbGF5ZXIyQm9hcmRcIjtcclxuY29uc3QgTUFYX1NISVBTID0gNTtcclxuXHJcbmNvbnN0IFRJTEVTID0ge1xyXG4gICAgV0FURVI6IFwiV1wiLFxyXG4gICAgTUlTUzogXCJPXCIsXHJcbiAgICBISVQ6IFwiWFwiLFxyXG59O1xyXG5cclxuY29uc3QgVElMRV9DTEFTU0VTID0ge1xyXG4gICAgV0FURVI6IFwid2F0ZXItY2VsbFwiLFxyXG4gICAgTUlTUzogXCJtaXNzLWNlbGxcIixcclxuICAgIEhJVDogXCJoaXQtY2VsbFwiLFxyXG4gICAgU0hJUDogXCJzaGlwLWNlbGxcIixcclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBCT0FSRF9XSURUSCxcclxuICAgIFBMQVlFUl8xX0JPQVJEX0lELFxyXG4gICAgUExBWUVSXzJfQk9BUkRfSUQsXHJcbiAgICBNQVhfU0hJUFMsXHJcbiAgICBUSUxFUyxcclxuICAgIFRJTEVfQ0xBU1NFUyxcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICAgIFBMQVlFUl8xX0JPQVJEX0lELFxyXG4gICAgUExBWUVSXzJfQk9BUkRfSUQsXHJcbiAgICBUSUxFX0NMQVNTRVMsXHJcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVET01Cb2FyZEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBTSElQX0NPTE9VUlMgPSB7XHJcbiAgICAgICAgMjogXCJoc2woMzIwLCA2MCUsIDg1JSlcIixcclxuICAgICAgICAzOiBcImhzbCgzMCwgNjAlLCA4NSUpXCIsXHJcbiAgICAgICAgNDogXCJoc2woMjcwLCA2MCUsIDc1JSlcIixcclxuICAgICAgICA1OiBcImhzbCgxMjAsIDYwJSwgODUlKVwiLFxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgYm9hcmREaXNwbGF5ID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgYWN0aXZlQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIC8vIEV2ZW50IGZvciBzZWxlY3RpbmcgYSBjZWxsIG9uIHRoZSBib2FyZCBhbmQgcmV0dXJuaW5nIGl0J3MgY29vcmRpbmF0ZXNcclxuICAgIGNvbnN0IHNlbGVjdENlbGxFdmVudCA9IChncmlkQ2VsbCwgcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNlbGxDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgZ3JpZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS14XCIpLFxyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiksXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShjZWxsQ29vcmRpbmF0ZXMpO1xyXG4gICAgICAgIGRpc2FibGVDZWxsU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV2ZW50IGZvciBzZWxlY3RpbmcgdGhlIHN0YXJ0IGNlbGwgd2hlbiBwbGFjaW5nIGEgc2hpcFxyXG4gICAgY29uc3Qgc2VsZWN0U2hpcFN0YXJ0RXZlbnQgPSAoZ3JpZENlbGwsIHJlc29sdmUpID0+IHtcclxuICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcC1zdGFydFwiKTtcclxuICAgICAgICBzZWxlY3RDZWxsRXZlbnQoZ3JpZENlbGwsIHJlc29sdmUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBjb3B5IG9mIGEgcGxheWVyJ3MgZ3JpZCB0byBkaXNwbGF5IHJlbGV2YW50IGdhbWUgaW5mb3JtYXRpb24gdG8gdGhlIHBsYXllclxyXG4gICAgZnVuY3Rpb24gY3JlYXRlR3JpZERpc3BsYXkoZ3JpZCwgaWQpIHtcclxuICAgICAgICBjb25zdCBib2FyZEhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcclxuICAgICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwiYm9hcmQtdGl0bGVcIik7XHJcbiAgICAgICAgaWYgKGlkID09PSBQTEFZRVJfMV9CT0FSRF9JRCkge1xyXG4gICAgICAgICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKFwicGxheWVyLWJvYXJkLXRpdGxlXCIpO1xyXG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiWW91ciBTaGlwc1wiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoXCJvcHBvbmVudC1ib2FyZC10aXRsZVwiKTtcclxuICAgICAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIk9wcG9uZW50IFNoaXBzXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgYm9hcmQuaWQgPSBpZDtcclxuICAgICAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1ib2FyZFwiKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGdyaWQgY2VsbHMgd2l0aCBjZWxsIGluZm9ybWF0aW9uIHN0b3JlZCBhbmQgZGlzcGxheWVkXHJcbiAgICAgICAgZ3JpZC5mb3JFYWNoKChyb3csIHgpID0+IHtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKF8sIHkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jZWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS14XCIsIHgpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS15XCIsIHkpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuc2V0QXR0cmlidXRlKFwiZGF0YS1wbGF5ZXItaWRcIiwgaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGdyaWRDZWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGJvYXJkSG9sZGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICAgICAgICBib2FyZEhvbGRlci5hcHBlbmRDaGlsZChib2FyZCk7XHJcbiAgICAgICAgYm9hcmREaXNwbGF5LnByZXBlbmQoYm9hcmRIb2xkZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBhYmlsaXR5IHRvIHNlbGVjdCBhbnkgY2VsbHMgb24gdGhlIGN1cnJlbnQgYWN0aXZlIGJvYXJkXHJcbiAgICBmdW5jdGlvbiBkaXNhYmxlQ2VsbFNlbGVjdGlvbigpIHtcclxuICAgICAgICAvLyBDbG9uZSB0aGUgcGFyZW50IG5vZGUgdG8gcmVtb3ZlIGFsbCBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICBjb25zdCBjbG9uZWRCb2FyZCA9IGFjdGl2ZUJvYXJkLnBhcmVudEVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIGJvYXJkRGlzcGxheS5yZXBsYWNlQ2hpbGQoY2xvbmVkQm9hcmQsIGFjdGl2ZUJvYXJkLnBhcmVudEVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvLyBVcGRhdGUgcmVmZXJlbmNlc1xyXG4gICAgICAgIGlmIChhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkKSB7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGNsb25lZEJvYXJkLmNoaWxkTm9kZXNbMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gY2xvbmVkQm9hcmQuY2hpbGROb2Rlc1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPSBjbG9uZWRCb2FyZC5jaGlsZE5vZGVzWzFdO1xyXG5cclxuICAgICAgICBhY3RpdmVCb2FyZC5jaGlsZE5vZGVzLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbmVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gc2V0IG9mIHBvaW50cyBhcmUgdmFsaWQgdG8gaGF2ZSBhIHNoaXAgcGxhY2VkIGJldHdlZW4gdGhlbVxyXG4gICAgZnVuY3Rpb24gdmFsaWRFbmRQb2ludChbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV0sIGFsbG93ZWRMZW5ndGhzKSB7XHJcbiAgICAgICAgLy8gU2FtZSBjby1vcmRpbmF0ZVxyXG4gICAgICAgIGlmIChzdGFydFggPT09IGVuZFggJiYgc3RhcnRZID09PSBlbmRZKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsZW5ndGggPSBudWxsO1xyXG4gICAgICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICAgICAgbGV0IGVuZCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChzdGFydFggPT09IGVuZFgpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIGFueSByZW1haW5pbmcgc2hpcHMgb2YgdmFsaWQgbGVuZ3RoIHRvIGJyaWRnZSB0aGVzZSBwb2ludHNcclxuICAgICAgICAgICAgbGVuZ3RoID0gYWxsb3dlZExlbmd0aHMuZmluZChcclxuICAgICAgICAgICAgICAgIChvYmopID0+IG9iai5udW1iZXIgPT09IE1hdGguYWJzKHN0YXJ0WSAtIGVuZFkpICsgMSxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBzaGlwcyBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFksIGVuZFkpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0OyB5IDwgZW5kICsgMTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3N0YXJ0WH1cIl1bZGF0YS15PVwiJHt5fVwiXWAsXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydFkgPT09IGVuZFkpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIGFueSByZW1haW5pbmcgc2hpcHMgb2YgdmFsaWQgbGVuZ3RoIHRvIGJyaWRnZSB0aGVzZSBwb2ludHNcclxuICAgICAgICAgICAgbGVuZ3RoID0gYWxsb3dlZExlbmd0aHMuZmluZChcclxuICAgICAgICAgICAgICAgIChvYmopID0+IG9iai5udW1iZXIgPT09IE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpICsgMSxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNraW5nIGZvciBzaGlwcyBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydFgsIGVuZFgpO1xyXG4gICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7c3RhcnRZfVwiXWAsXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNoaXAgYmV0d2VlbiB0aGUgcG9pbnRzXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBWYWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgIGlmIChsZW5ndGggJiYgbGVuZ3RoLnJlbWFpbmluZyA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBDcmVhdGUgYW5kIHJlbmRlciBkaXNwbGF5IG9mIGJvdGggcGxheWVycyBib2FyZHNcclxuICAgICAgICByZW5kZXJJbml0aWFsQm9hcmQocGxheWVyMUdyaWQsIHBsYXllcjJHcmlkKSB7XHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmQtZGlzcGxheVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjJHcmlkLCBQTEFZRVJfMl9CT0FSRF9JRCk7XHJcbiAgICAgICAgICAgIGNyZWF0ZUdyaWREaXNwbGF5KHBsYXllcjFHcmlkLCBQTEFZRVJfMV9CT0FSRF9JRCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtQTEFZRVJfMV9CT0FSRF9JRH1gKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzJfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIHBvc3NpYmxlIHN0YXJ0IHBvc2l0aW9ucyBmb3Igc2hpcHMgc2VsZWN0YWJsZVxyXG4gICAgICAgIGFzeW5jIGVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0U2hpcFN0YXJ0RXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBhbGwgcG9zc2libGUgZW5kIHBvc2l0aW9ucyBmb3Igc2hpcHMgc2VsZWN0YWJsZVxyXG4gICAgICAgIGFzeW5jIGVuYWJsZVNoaXBFbmRQb3NpdGlvblNlbGVjdGlvbihzdGFydFBvcywgYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFjZWxsLmNsYXNzTGlzdC5jb250YWlucyhUSUxFX0NMQVNTRVMuU0hJUCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRFbmRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS14XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93ZWRMZW5ndGhzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2VsbEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjbGlja2FibGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEFkZCBhIHBsYWNlZCBzaGlwIHRvIHRoZSBib2FyZFxyXG4gICAgICAgIHBsYWNlU2hpcChbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV0sIGhpZGRlbikge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgZW5kID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGNvbG91ciA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXJJRCA9IGhpZGRlbiA/IFBMQVlFUl8yX0JPQVJEX0lEIDogUExBWUVSXzFfQk9BUkRfSUQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHktYXhpc1xyXG4gICAgICAgICAgICBpZiAoc3RhcnRYID09PSBlbmRYKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0WSwgZW5kWSk7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICAgICAgY29sb3VyID0gU0hJUF9DT0xPVVJTW2VuZCAtIHN0YXJ0ICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IHN0YXJ0OyB5IDwgZW5kICsgMTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtcGxheWVyLWlkPVwiJHtwbGF5ZXJJRH1cIl1bZGF0YS14PVwiJHtzdGFydFh9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuU0hJUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUGxhY2luZyBzaGlwIHRpbGVzIGFsb25nIHRoZSB4LWF4aXNcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xyXG4gICAgICAgICAgICAgICAgY29sb3VyID0gU0hJUF9DT0xPVVJTW2VuZCAtIHN0YXJ0ICsgMV07XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtcGxheWVyLWlkPVwiJHtwbGF5ZXJJRH1cIl1bZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3N0YXJ0WX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuU0hJUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG91cjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWtlIGFsbCBhdHRhY2thYmxlIGNlbGxzIG9uIG9wcG9uZW50J3MgYm9hcmQgc2VsZWN0YWJsZSBmb3IgYXR0YWNrc1xyXG4gICAgICAgIGFzeW5jIGVuYWJsZUF0dGFja1NlbGVjdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRpbGUgaGFzbid0IGFscmVhZHkgYmVlbiBhdHRhY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAhW1RJTEVfQ0xBU1NFUy5ISVQsIFRJTEVfQ0xBU1NFUy5NSVNTXS5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRpbGVUeXBlKSA9PiBjZWxsLmNsYXNzTGlzdC5jb250YWlucyh0aWxlVHlwZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzZWxlY3RhYmxlIGJ5IGNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDZWxsRXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWx0ZXIgdGhlIGJvYXJkIHRvIHJlZmxlY3QgYW4gYXR0YWNrXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhbeCwgeV0sIGhpdCkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHt4fVwiXVtkYXRhLXk9XCIke3l9XCJdW2RhdGEtcGxheWVyLWlkPVwiJHthY3RpdmVCb2FyZC5pZH1cIl1gLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBlYXJsaWVyIHN0eWxpbmdcclxuICAgICAgICAgICAgYXR0YWNrZWRDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgYXR0YWNrZWRDZWxsLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgICAgICAgICBoaXQgPyBUSUxFX0NMQVNTRVMuSElUIDogVElMRV9DTEFTU0VTLk1JU1MsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIHdoaWNoIGJvYXJkIGlzIGFjdGl2ZVxyXG4gICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCkge1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZC5wYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbMF0uY2xhc3NMaXN0LnJlbW92ZShcclxuICAgICAgICAgICAgICAgIFwiYm9hcmQtdGl0bGUtYWN0aXZlXCIsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID1cclxuICAgICAgICAgICAgICAgIGFjdGl2ZUJvYXJkID09PSBwbGF5ZXIxQm9hcmQgPyBwbGF5ZXIyQm9hcmQgOiBwbGF5ZXIxQm9hcmQ7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkLnBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1swXS5jbGFzc0xpc3QuYWRkKFxyXG4gICAgICAgICAgICAgICAgXCJib2FyZC10aXRsZS1hY3RpdmVcIixcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZURPTUJvYXJkSGFuZGxlciB9O1xyXG4iLCJjb25zdCBjcmVhdGVET01NZXNzYWdlSGFuZGxlciA9ICgpID0+IHtcclxuICAgIC8vIENyZWF0ZSBtZXNzYWdlIGJhbm5lclxyXG4gICAgLy8gY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgLy8gbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xyXG4gICAgY29uc3QgbWVzc2FnZUJhbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBtZXNzYWdlQmFubmVyLmNsYXNzTGlzdC5hZGQoXCJtZXNzYWdlLWJhbm5lclwiKTtcclxuICAgIC8vIG1vZGFsLmFwcGVuZENoaWxkKG1lc3NhZ2VCYW5uZXIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikucHJlcGVuZChtZXNzYWdlQmFubmVyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRpc3BsYXlTaGlwUGxhY2VQcm9tcHQoc2hpcHNSZW1haW5pbmcpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IGBQbGFjZSBhIHNoaXAsICR7c2hpcHNSZW1haW5pbmd9IHNoaXBzIHJlbWFpbmluZ2A7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheUN1cnJlbnRUdXJuKHBsYXllclR1cm4gPSB0cnVlKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBwbGF5ZXJUdXJuXHJcbiAgICAgICAgICAgICAgICA/IFwiWW91ciB0dXJuISBNYWtlIGFuIGF0dGFja1wiXHJcbiAgICAgICAgICAgICAgICA6IGBPcHBvbmVudCBUdXJuISBNYWtpbmcgYW4gYXR0YWNrYDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5QXR0YWNrUmVzdWx0KGhpdCkge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gaGl0ID8gXCJTaGlwIGhpdCFcIiA6IFwiU2hvdCBtaXNzZWQhXCI7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZGlzcGxheVdpbm5lcihuYW1lKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBgVmljdG9yeSBmb3IgJHtuYW1lfSFgO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgfTtcclxuIiwiaW1wb3J0IHsgY3JlYXRlUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZURPTUJvYXJkSGFuZGxlciB9IGZyb20gXCIuL2RvbUJvYXJkSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcclxuaW1wb3J0IHsgY3JlYXRlRE9NTWVzc2FnZUhhbmRsZXIgfSBmcm9tIFwiLi9kb21NZXNzYWdlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBNQVhfU0hJUFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZUdhbWVIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gc3dpdGNoQWN0aXZlUGxheWVyKCkge1xyXG4gICAgICAgIGFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyMSA/IHBsYXllcjIgOiBwbGF5ZXIxO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN3aXRjaEFjdGl2ZUJvYXJkKCkge1xyXG4gICAgICAgIGFjdGl2ZUJvYXJkID1cclxuICAgICAgICAgICAgYWN0aXZlQm9hcmQgPT09IHBsYXllcjFCb2FyZCA/IHBsYXllcjJCb2FyZCA6IHBsYXllcjFCb2FyZDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYm9hcmRIYW5kbGVyID0gbnVsbDtcclxuICAgIGxldCBtZXNzYWdlSGFuZGxlciA9IG51bGw7XHJcblxyXG4gICAgbGV0IHBsYXllcjEgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjFCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgbGV0IHBsYXllcjIgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgbGV0IGFjdGl2ZVBsYXllciA9IG51bGw7XHJcbiAgICBsZXQgYWN0aXZlQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0dXBHYW1lKCkge1xyXG4gICAgICAgICAgICBib2FyZEhhbmRsZXIgPSBjcmVhdGVET01Cb2FyZEhhbmRsZXIoKTtcclxuICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIgPSBjcmVhdGVET01NZXNzYWdlSGFuZGxlcigpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyMSA9IGNyZWF0ZVBsYXllcihmYWxzZSk7XHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZCA9IGNyZWF0ZUdhbWVib2FyZCgpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyMiA9IGNyZWF0ZVBsYXllcih0cnVlKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXIxO1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9IHBsYXllcjJCb2FyZDtcclxuXHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZW5kZXJJbml0aWFsQm9hcmQoXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBGaWxsIHRoZSBib2FyZCB3aXRoIHNoaXBzXHJcbiAgICAgICAgYXN5bmMgc2V0dXBTaGlwcygpIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdXAgY29tcHV0ZXIgc2hpcHNcclxuICAgICAgICAgICAgd2hpbGUgKHBsYWNlZCA8IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgLy8gVHJ5IHBsYWNpbmcgYSBzaGlwIGF0IGNvbXB1dGVyIGdlbmVyYXRlZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW3N0YXJ0UG9zLCBlbmRQb3NdID0gcGxheWVyMi5wcm92aWRlU2hpcENvb3JkaW5hdGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQuZ2V0QWxsb3dlZExlbmd0aHMoKSxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW3N0YXJ0UG9zLCBlbmRQb3NdKTtcclxuICAgICAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIucGxhY2VTaGlwKHN0YXJ0UG9zLCBlbmRQb3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFtzdGFydFBvcywgZW5kUG9zXSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBjb29yZGluYXRlcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgICAgIHBsYWNlZCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdXAgcGxheWVyIHNoaXBzXHJcbiAgICAgICAgICAgIHdoaWxlIChwbGFjZWQgPCBNQVhfU0hJUFMpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlTaGlwUGxhY2VQcm9tcHQoTUFYX1NISVBTIC0gcGxhY2VkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBXYWl0IGZvciBzaGlwIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb25zXHJcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRQb3MgPVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGJvYXJkSGFuZGxlci5lbmFibGVTaGlwU3RhcnRQb3NpdGlvblNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZFBvcyA9IGF3YWl0IGJvYXJkSGFuZGxlci5lbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmdldEFsbG93ZWRMZW5ndGhzKCksXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRyeSBwbGFjaW5nIGEgc2hpcCBhdCB0aG9zZSBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtzdGFydFBvcywgZW5kUG9zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRIYW5kbGVyLnBsYWNlU2hpcChzdGFydFBvcywgZW5kUG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgKz0gMTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGNvb3JkaW5hdGVzIGludmFsaWQsIGFzayBhZ2FpblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBib2FyZEhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWluIGdhbWUgbG9vcFxyXG4gICAgICAgIGFzeW5jIHBsYXlHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZ2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlDdXJyZW50VHVybighYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbGlkQXR0YWNrID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCF2YWxpZEF0dGFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoaXQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY29tcHV0ZXIgcGxheWVyIG1vdmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGF1c2UgdG8gc2ltdWxhdGUgY29tcHV0ZXIgdGhpbmtpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNrIGNvbXB1dGVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYWN0aXZlUGxheWVyLnByb3ZpZGVBdHRhY2tDb29yZGluYXRlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGh1bWFuIHBsYXllciBtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBodW1hbiBwbGF5ZXIgZm9yIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2sgPSBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlQXR0YWNrU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdGhhdCBhdHRhY2sgb24gb3Bwb25lbnQgYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXQgPSBhY3RpdmVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZWNlaXZlQXR0YWNrKGF0dGFjaywgaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRBdHRhY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5QXR0YWNrUmVzdWx0KGhpdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGF0dGFjayBpcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCByZWdpc3RlciBpdCBhbmQgdGhlbiBhd2FpdCBpbnB1dCBmcm9tIG90aGVyIHBsYXllclxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUJvYXJkLmlzRmxlZXRTdW5rKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIG92ZXJcclxuICAgICAgICAgICAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheVdpbm5lcihcIlBsYXllciAxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggcGxheWVyIHR1cm5zXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVQbGF5ZXIoKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZUhhbmRsZXIgfTtcclxuIiwiaW1wb3J0IHsgQk9BUkRfV0lEVEgsIE1BWF9TSElQUywgVElMRVMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY3JlYXRlU2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZUdhbWVib2FyZCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGFsbG93ZWRMZW5ndGhzID0gW1xyXG4gICAgICAgIHsgbnVtYmVyOiAyLCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogMywgcmVtYWluaW5nOiAyIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDQsIHJlbWFpbmluZzogMSB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA1LCByZW1haW5pbmc6IDEgfSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgZ3JpZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0sICgpID0+IHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogQk9BUkRfV0lEVEggfSkuZmlsbChUSUxFUy5XQVRFUik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwbGFjZWRTaGlwcyA9IFtdO1xyXG5cclxuICAgIC8vIENoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gcGFpciBvZiBjb29yZGluYXRlcyBpcyB2YWxpZCBmb3IgcGxhY2luZyBhIHNoaXBcclxuICAgIGZ1bmN0aW9uIGlzVmFsaWRDb29yZHMobWluWCwgbWluWSwgbWF4WCwgbWF4WSkge1xyXG4gICAgICAgIC8vIFNoaXAgcGxhY2VkIG9mZiB0aGUgYm9hcmRcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIFttaW5YLCBtaW5ZLCBtYXhYLCBtYXhZXS5zb21lKFxyXG4gICAgICAgICAgICAgICAgKGNvb3JkKSA9PiBjb29yZCA8IDAgfHwgY29vcmQgPj0gQk9BUkRfV0lEVEgsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2hpcCBwbGFjZWQgZGlhZ29uYWxseVxyXG4gICAgICAgIGlmIChtaW5YICE9PSBtYXhYICYmIG1pblkgIT09IG1heFkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNoaXBzIGFscmVhZHkgaW4gdGhlIGdyaWRcclxuICAgICAgICBmb3IgKGxldCB4ID0gbWluWDsgeCA8PSBtYXhYOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTaGlwIGFscmVhZHkgcGxhY2VkIHRoZXJlXHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JpZFt4XVt5XSAhPT0gVElMRVMuV0FURVIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gUGxhY2UgYSBzaGlwIG9uIHRoZSBnYW1lIGJvYXJkIGJhc2VkIG9uIHN0YXJ0IGFuZCBlbmQgY29vcmRpbmF0ZXNcclxuICAgICAgICBwbGFjZVNoaXAoW1tzdGFydFgsIHN0YXJ0WV0sIFtlbmRYLCBlbmRZXV0pIHtcclxuICAgICAgICAgICAgLy8gTWF4IHNoaXBzIGFscmVhZHkgcGxhY2VkXHJcbiAgICAgICAgICAgIGlmIChwbGFjZWRTaGlwcy5sZW5ndGggPj0gTUFYX1NISVBTKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaGlwIGNhcGFjaXR5IHJlYWNoZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbihzdGFydFgsIGVuZFgpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgY29uc3QgbWluWSA9IE1hdGgubWluKHN0YXJ0WSwgZW5kWSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heChzdGFydFksIGVuZFkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52YWxpZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWRDb29yZHMobWluWCwgbWluWSwgbWF4WCwgbWF4WSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPVxyXG4gICAgICAgICAgICAgICAgMSArIE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpLCBNYXRoLmFicyhzdGFydFkgLSBlbmRZKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBzaGlwIGxlbmd0aCB2YWxpZGl0eVxyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBhbGxvd2VkTGVuZ3Rocy5maW5kKChvYmopID0+IG9iai5udW1iZXIgPT09IHNoaXBMZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkIHx8IG9iai5yZW1haW5pbmcgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzaGlwXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTaGlwID0gY3JlYXRlU2hpcChzaGlwTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlZFNoaXBzLnB1c2gobmV3U2hpcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIHNoaXAgcmVmZXJlbmNlcyB0byB0aGUgZ3JpZFxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSBtaW5YOyB4IDw9IG1heFg7IHggKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncmlkW3hdW3ldID0gcGxhY2VkU2hpcHMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLnJlbWFpbmluZyAtPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVjZWl2ZUF0dGFjayhbeCwgeV0pIHtcclxuICAgICAgICAgICAgaWYgKFt4LCB5XS5zb21lKChjb29yZCkgPT4gY29vcmQgPCAwIHx8IGNvb3JkID49IEJPQVJEX1dJRFRIKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBjb29yZGluYXRlc1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gZ3JpZFt4XVt5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBhdHRhY2tcclxuICAgICAgICAgICAgaWYgKHNxdWFyZSA9PT0gVElMRVMuTUlTUyB8fCBzcXVhcmUgPT09IFRJTEVTLkhJVCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWxyZWFkeSBhdHRhY2tlZCB0aGlzIHNxdWFyZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTWlzc1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlID09PSBUSUxFUy5XQVRFUikge1xyXG4gICAgICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IFRJTEVTLk1JU1M7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIaXRcclxuICAgICAgICAgICAgcGxhY2VkU2hpcHNbc3F1YXJlXS5oaXQoKTtcclxuICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IFRJTEVTLkhJVDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGlzRmxlZXRTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGxhY2VkU2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEdyaWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBncmlkO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEFsbG93ZWRMZW5ndGhzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsb3dlZExlbmd0aHM7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVHYW1lYm9hcmQgfTtcclxuIiwiaW1wb3J0IHsgQk9BUkRfV0lEVEggfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZVBsYXllciA9IChpc0NvbXB1dGVyKSA9PiB7XHJcbiAgICAvLyBGaWxsIGFuIGFycmF5IHdpdGggYWxsIHBvc3NpYmxlIGF0dGFja3Mgb24gdGhlIGJvYXJkXHJcbiAgICBjb25zdCBwb3NzaWJsZUF0dGFja3MgPSBbXTtcclxuXHJcbiAgICBjb25zdCBvcmllbnRhdGlvbnMgPSB7XHJcbiAgICAgICAgSE9SSVpPTlRBTDogMCxcclxuICAgICAgICBWRVJUSUNBTDogMSxcclxuICAgIH07XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBCT0FSRF9XSURUSDsgeCArPSAxKSB7XHJcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBCT0FSRF9XSURUSDsgeSArPSAxKSB7XHJcbiAgICAgICAgICAgIHBvc3NpYmxlQXR0YWNrcy5wdXNoKFt4LCB5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNDb21wdXRlcixcclxuXHJcbiAgICAgICAgcHJvdmlkZVNoaXBDb29yZGluYXRlcyhhbGxvd2VkTGVuZ3Rocykge1xyXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgc3RhcnQgY28tb3JkaW5hdGVzXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJPQVJEX1dJRFRIKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnRZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQk9BUkRfV0lEVEgpO1xyXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgb3JpZW50YXRpb25cclxuICAgICAgICAgICAgY29uc3Qgb3JpZW50YXRpb24gPVxyXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSA8IDAuNVxyXG4gICAgICAgICAgICAgICAgICAgID8gb3JpZW50YXRpb25zLkhPUklaT05UQUxcclxuICAgICAgICAgICAgICAgICAgICA6IG9yaWVudGF0aW9ucy5WRVJUSUNBTDtcclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGxlbmd0aFxyXG4gICAgICAgICAgICBsZXQgc2hpcExlbmd0aCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxlbmd0aCBvZiBhbGxvd2VkTGVuZ3Rocykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlbmd0aC5yZW1haW5pbmcgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcExlbmd0aCA9IGxlbmd0aC5udW1iZXIgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwIGhvcml6b250YWxseVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IG9yaWVudGF0aW9ucy5IT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSBhY2NvcmRpbmcgdG8gYm9hcmQgd2lkdGggbGltaXRhdGlvbnNcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydFggLSBzaGlwTGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFggKyBzaGlwTGVuZ3RoLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0WCArIHNoaXBMZW5ndGggPj0gQk9BUkRfV0lEVEgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYIC0gc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgcmFuZG9tbHkgbGVmdCBvciByaWdodFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYICsgc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFggLSBzaGlwTGVuZ3RoLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwIHZlcnRpY2FsbHlcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBQbGFjZSBhY2NvcmRpbmcgdG8gYm9hcmQgd2lkdGggbGltaXRhdGlvbnNcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydFkgLSBzaGlwTGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WSArIHNoaXBMZW5ndGhdLFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0WSArIHNoaXBMZW5ndGggPj0gQk9BUkRfV0lEVEgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgLSBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgcmFuZG9tbHkgdXAgb3IgZG93blxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgKyBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WSAtIHNoaXBMZW5ndGhdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHByb3ZpZGVBdHRhY2tDb29yZGluYXRlcygpIHtcclxuICAgICAgICAgICAgLy8gUGljayBhIHJhbmRvbSBhdHRhY2tcclxuICAgICAgICAgICAgY29uc3QgYXR0YWNrTnVtYmVyID0gTWF0aC5mbG9vcihcclxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUF0dGFja3MubGVuZ3RoLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGF0dGFjayBmcm9tIGFsbCBwb3NzaWJsZSBhdHRhY2tzIGFuZCByZXR1cm4gaXRcclxuICAgICAgICAgICAgY29uc3QgYXR0YWNrID0gcG9zc2libGVBdHRhY2tzLnNwbGljZShhdHRhY2tOdW1iZXIsIDEpWzBdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGF0dGFjaztcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZVBsYXllciB9O1xyXG4iLCJjb25zdCBjcmVhdGVTaGlwID0gKHNoaXBMZW5ndGgpID0+IHtcclxuICAgIC8vIEVycm9yIGNoZWNraW5nXHJcbiAgICBpZiAodHlwZW9mIHNoaXBMZW5ndGggIT09IFwibnVtYmVyXCIgfHwgaXNOYU4oc2hpcExlbmd0aCkgfHwgc2hpcExlbmd0aCA8IDEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNoaXAgbGVuZ3RoXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBMZW5ndGg7XHJcbiAgICBsZXQgaGl0cyA9IDA7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAvLyBDaGVja3Mgd2hldGhlciB0aGUgc2hpcCBoYXMgbW9yZSBoaXRzIHRoYW4gbGl2ZXNcclxuICAgICAgICBpc1N1bmsoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoaXRzID49IGxlbmd0aDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBBZGQgZGFtYWdhZSB0byB0aGUgc2hpcCBhbmQgY2hlY2sgZm9yIHNpbmtpbmdcclxuICAgICAgICBoaXQoKSB7XHJcbiAgICAgICAgICAgIGhpdHMgKz0gMTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZVNoaXAgfTtcclxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYDpyb290IHtcclxuICAgIC0tZ3JpZC1jZWxsLWdhcDogMXB4O1xyXG4gICAgLS1ncmlkLXBhZGRpbmc6IDJweDtcclxuICAgIC0tZ3JpZC1jZWxsLXNpemU6IDNyZW07XHJcblxyXG4gICAgLS1iYW5uZXItYmFja2dyb3VuZDogIzAwMDAwMDk5O1xyXG5cclxuICAgIC0tYm9hcmQtdGl0bGUtYmFja2dyb3VuZDogcmdiKDIsIDExMCwgMTEwKTtcclxuXHJcbiAgICAtLXRpbGUtYWN0aXZlOiByZ2IoMCwgMjUzLCAyNTMpO1xyXG4gICAgLS10aWxlLWluYWN0aXZlOiByZ2IoMCwgMTk5LCAxOTkpO1xyXG4gICAgLS10aWxlLWhvdmVyZWQ6IHJnYigwLCAxODMsIDI1NSk7XHJcbn1cclxuXHJcbi8qXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBHZW5lcmFsIFN0eWxpbmdcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG4qIHtcclxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICBtYXJnaW46IDA7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG59XHJcblxyXG5ib2R5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNiOWI5Yjk7XHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBnYXA6IDJyZW07XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxuICAgIGJveC1zaGFkb3c6IDJweCAxMHB4IDE1cHggIzAwMDAyNTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEJvYXJkIFN0eWxpbmdcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG4uYm9hcmQtdGl0bGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBwYWRkaW5nOiAxcmVtIDJyZW07XHJcbiAgICBtYXJnaW46IDFweDtcclxuXHJcbiAgICBjb2xvcjogIzAwMDAwMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvYXJkLXRpdGxlLWJhY2tncm91bmQpO1xyXG59XHJcblxyXG4uYm9hcmQtdGl0bGUtYWN0aXZlIHtcclxuICAgIGNvbG9yOiAjZmZmZmZmO1xyXG59XHJcblxyXG4uZ2FtZS1ib2FyZCB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICAgIGdhcDogdmFyKC0tZ3JpZC1jZWxsLWdhcCk7XHJcblxyXG4gICAgd2lkdGg6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XHJcbiAgICBoZWlnaHQ6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XHJcblxyXG4gICAgcGFkZGluZzogMnB4O1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi8qXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBDZWxsIFN0eWxpbmdcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG4uZ3JpZC1jZWxsIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcblxyXG4gICAgd2lkdGg6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcclxuICAgIGhlaWdodDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG59XHJcblxyXG4ud2F0ZXItY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10aWxlLWluYWN0aXZlKTtcclxufVxyXG5cclxuLmNsaWNrYWJsZSB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGlsZS1hY3RpdmUpO1xyXG59XHJcbi5jbGlja2FibGU6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGlsZS1ob3ZlcmVkKTtcclxufVxyXG5cclxuLnNoaXAtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTk3LCAxOTcsIDE5Nyk7XHJcbn1cclxuXHJcbi5taXNzLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcclxufVxyXG5cclxuLmhpdC1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJlZDtcclxufVxyXG5cclxuLnNoaXAtc3RhcnQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGlsZS1ob3ZlcmVkKTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIE1lc3NhZ2UgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbi5tZXNzYWdlLWJhbm5lciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG5cclxuICAgIGhlaWdodDogMTAlO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xyXG4gICAgcGFkZGluZzogMS41cmVtIDA7XHJcblxyXG4gICAgZm9udC1zaXplOiB4eHgtbGFyZ2U7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhbm5lci1iYWNrZ3JvdW5kKTtcclxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsc0JBQXNCOztJQUV0Qiw4QkFBOEI7O0lBRTlCLDBDQUEwQzs7SUFFMUMsK0JBQStCO0lBQy9CLGlDQUFpQztJQUNqQyxnQ0FBZ0M7QUFDcEM7O0FBRUE7Ozs7RUFJRTtBQUNGO0lBQ0ksc0JBQXNCO0lBQ3RCLFNBQVM7SUFDVCxVQUFVO0FBQ2Q7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQix1QkFBdUI7O0lBRXZCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7O0lBRVQseUJBQXlCO0lBQ3pCLGlDQUFpQztBQUNyQzs7QUFFQTs7OztFQUlFO0FBQ0Y7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsa0JBQWtCO0lBQ2xCLFdBQVc7O0lBRVgsY0FBYztJQUNkLCtDQUErQztBQUNuRDs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGVBQWU7SUFDZix5QkFBeUI7O0lBRXpCLDhHQUE4RztJQUM5RywrR0FBK0c7O0lBRS9HLFlBQVk7O0lBRVoseUJBQXlCO0FBQzdCOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2Qiw0QkFBNEI7SUFDNUIsNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksc0NBQXNDO0FBQzFDOztBQUVBO0lBQ0ksZUFBZTs7SUFFZixvQ0FBb0M7QUFDeEM7QUFDQTtJQUNJLHFDQUFxQztBQUN6Qzs7QUFFQTtJQUNJLG9DQUFvQztBQUN4Qzs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTtJQUNJLHFDQUFxQztBQUN6Qzs7QUFFQTs7OztFQUlFO0FBQ0Y7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1Qjs7SUFFdkIsV0FBVztJQUNYLFdBQVc7O0lBRVgscUJBQXFCO0lBQ3JCLGlCQUFpQjs7SUFFakIsb0JBQW9CO0lBQ3BCLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osMENBQTBDO0FBQzlDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjpyb290IHtcXHJcXG4gICAgLS1ncmlkLWNlbGwtZ2FwOiAxcHg7XFxyXFxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XFxyXFxuICAgIC0tZ3JpZC1jZWxsLXNpemU6IDNyZW07XFxyXFxuXFxyXFxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcXHJcXG5cXHJcXG4gICAgLS1ib2FyZC10aXRsZS1iYWNrZ3JvdW5kOiByZ2IoMiwgMTEwLCAxMTApO1xcclxcblxcclxcbiAgICAtLXRpbGUtYWN0aXZlOiByZ2IoMCwgMjUzLCAyNTMpO1xcclxcbiAgICAtLXRpbGUtaW5hY3RpdmU6IHJnYigwLCAxOTksIDE5OSk7XFxyXFxuICAgIC0tdGlsZS1ob3ZlcmVkOiByZ2IoMCwgMTgzLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqIEdlbmVyYWwgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbioge1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcblxcclxcbmJvZHkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2I5YjliOTtcXHJcXG59XFxyXFxuXFxyXFxuLmJvYXJkLWRpc3BsYXkge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgZ2FwOiAycmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbiAgICBib3gtc2hhZG93OiAycHggMTBweCAxNXB4ICMwMDAwMjU7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogQm9hcmQgU3R5bGluZ1xcclxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcclxcbiAqL1xcclxcbi5ib2FyZC10aXRsZSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBwYWRkaW5nOiAxcmVtIDJyZW07XFxyXFxuICAgIG1hcmdpbjogMXB4O1xcclxcblxcclxcbiAgICBjb2xvcjogIzAwMDAwMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYm9hcmQtdGl0bGUtYmFja2dyb3VuZCk7XFxyXFxufVxcclxcblxcclxcbi5ib2FyZC10aXRsZS1hY3RpdmUge1xcclxcbiAgICBjb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmdhbWUtYm9hcmQge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgICBmbGV4LXdyYXA6IHdyYXA7XFxyXFxuICAgIGdhcDogdmFyKC0tZ3JpZC1jZWxsLWdhcCk7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xcclxcbiAgICBoZWlnaHQ6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDJweDtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLypcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKiBDZWxsIFN0eWxpbmdcXHJcXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXHJcXG4gKi9cXHJcXG4uZ3JpZC1jZWxsIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIHdpZHRoOiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XFxyXFxuICAgIGhlaWdodDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xcclxcbn1cXHJcXG5cXHJcXG4ud2F0ZXItY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbGUtaW5hY3RpdmUpO1xcclxcbn1cXHJcXG5cXHJcXG4uY2xpY2thYmxlIHtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10aWxlLWFjdGl2ZSk7XFxyXFxufVxcclxcbi5jbGlja2FibGU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10aWxlLWhvdmVyZWQpO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5NywgMTk3LCAxOTcpO1xcclxcbn1cXHJcXG5cXHJcXG4ubWlzcy1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1zdGFydCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbGUtaG92ZXJlZCk7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogTWVzc2FnZSBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuLm1lc3NhZ2UtYmFubmVyIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxuICAgIGhlaWdodDogMTAlO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG5cXHJcXG4gICAgbWFyZ2luLWJvdHRvbTogMS41cmVtO1xcclxcbiAgICBwYWRkaW5nOiAxLjVyZW0gMDtcXHJcXG5cXHJcXG4gICAgZm9udC1zaXplOiB4eHgtbGFyZ2U7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhbm5lci1iYWNrZ3JvdW5kKTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH0gZnJvbSBcIi4vZ2FtZUhhbmRsZXJcIjtcclxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBjb25zdCBiYXR0bGVTaGlwcyA9IGNyZWF0ZUdhbWVIYW5kbGVyKCk7XHJcbiAgICBiYXR0bGVTaGlwcy5zZXR1cEdhbWUoKTtcclxuICAgIGF3YWl0IGJhdHRsZVNoaXBzLnNldHVwU2hpcHMoKTtcclxuICAgIGJhdHRsZVNoaXBzLnBsYXlHYW1lKCk7XHJcbn1cclxuXHJcbm1haW4oKTtcclxuIl0sIm5hbWVzIjpbIkJPQVJEX1dJRFRIIiwiUExBWUVSXzFfQk9BUkRfSUQiLCJQTEFZRVJfMl9CT0FSRF9JRCIsIk1BWF9TSElQUyIsIlRJTEVTIiwiV0FURVIiLCJNSVNTIiwiSElUIiwiVElMRV9DTEFTU0VTIiwiU0hJUCIsImNyZWF0ZURPTUJvYXJkSGFuZGxlciIsIlNISVBfQ09MT1VSUyIsImJvYXJkRGlzcGxheSIsInBsYXllcjFCb2FyZCIsInBsYXllcjJCb2FyZCIsImFjdGl2ZUJvYXJkIiwic2VsZWN0Q2VsbEV2ZW50IiwiZ3JpZENlbGwiLCJyZXNvbHZlIiwiY2VsbENvb3JkaW5hdGVzIiwiZ2V0QXR0cmlidXRlIiwiZGlzYWJsZUNlbGxTZWxlY3Rpb24iLCJzZWxlY3RTaGlwU3RhcnRFdmVudCIsImNsYXNzTGlzdCIsImFkZCIsImNyZWF0ZUdyaWREaXNwbGF5IiwiZ3JpZCIsImlkIiwiYm9hcmRIb2xkZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0aXRsZSIsInRleHRDb250ZW50IiwiYm9hcmQiLCJmb3JFYWNoIiwicm93IiwieCIsIl8iLCJ5Iiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJwcmVwZW5kIiwiY2xvbmVkQm9hcmQiLCJwYXJlbnRFbGVtZW50IiwiY2xvbmVOb2RlIiwicmVwbGFjZUNoaWxkIiwiY2hpbGROb2RlcyIsImNlbGwiLCJyZW1vdmUiLCJjb25zb2xlIiwibG9nIiwidmFsaWRFbmRQb2ludCIsIl9yZWYiLCJfcmVmMiIsImFsbG93ZWRMZW5ndGhzIiwic3RhcnRYIiwic3RhcnRZIiwiZW5kWCIsImVuZFkiLCJsZW5ndGgiLCJzdGFydCIsImVuZCIsImZpbmQiLCJvYmoiLCJudW1iZXIiLCJNYXRoIiwiYWJzIiwibWluIiwibWF4IiwicXVlcnlTZWxlY3RvciIsImNvbnRhaW5zIiwicmVtYWluaW5nIiwicmVuZGVySW5pdGlhbEJvYXJkIiwicGxheWVyMUdyaWQiLCJwbGF5ZXIyR3JpZCIsImVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uIiwiUHJvbWlzZSIsIkFycmF5IiwiZnJvbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24iLCJzdGFydFBvcyIsInBsYWNlU2hpcCIsIl9yZWYzIiwiX3JlZjQiLCJoaWRkZW4iLCJjb2xvdXIiLCJwbGF5ZXJJRCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZW5hYmxlQXR0YWNrU2VsZWN0aW9uIiwic29tZSIsInRpbGVUeXBlIiwicmVjZWl2ZUF0dGFjayIsIl9yZWY1IiwiaGl0IiwiYXR0YWNrZWRDZWxsIiwic3dpdGNoQWN0aXZlQm9hcmQiLCJjcmVhdGVET01NZXNzYWdlSGFuZGxlciIsIm1lc3NhZ2VCYW5uZXIiLCJkaXNwbGF5U2hpcFBsYWNlUHJvbXB0Iiwic2hpcHNSZW1haW5pbmciLCJkaXNwbGF5Q3VycmVudFR1cm4iLCJwbGF5ZXJUdXJuIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiZGlzcGxheUF0dGFja1Jlc3VsdCIsImRpc3BsYXlXaW5uZXIiLCJuYW1lIiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlR2FtZWJvYXJkIiwiY3JlYXRlR2FtZUhhbmRsZXIiLCJzd2l0Y2hBY3RpdmVQbGF5ZXIiLCJhY3RpdmVQbGF5ZXIiLCJwbGF5ZXIxIiwicGxheWVyMiIsImJvYXJkSGFuZGxlciIsIm1lc3NhZ2VIYW5kbGVyIiwic2V0dXBHYW1lIiwiZ2V0R3JpZCIsInNldHVwU2hpcHMiLCJwbGFjZWQiLCJlbmRQb3MiLCJwcm92aWRlU2hpcENvb3JkaW5hdGVzIiwiZ2V0QWxsb3dlZExlbmd0aHMiLCJwbGF5R2FtZSIsImdhbWVPdmVyIiwiaXNDb21wdXRlciIsInZhbGlkQXR0YWNrIiwiYXR0YWNrIiwic2V0VGltZW91dCIsInByb3ZpZGVBdHRhY2tDb29yZGluYXRlcyIsImlzRmxlZXRTdW5rIiwiY3JlYXRlU2hpcCIsImZpbGwiLCJwbGFjZWRTaGlwcyIsImlzVmFsaWRDb29yZHMiLCJtaW5YIiwibWluWSIsIm1heFgiLCJtYXhZIiwiY29vcmQiLCJFcnJvciIsInNoaXBMZW5ndGgiLCJuZXdTaGlwIiwicHVzaCIsImVycm9yIiwic3F1YXJlIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwicG9zc2libGVBdHRhY2tzIiwib3JpZW50YXRpb25zIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiZmxvb3IiLCJyYW5kb20iLCJvcmllbnRhdGlvbiIsImF0dGFja051bWJlciIsInNwbGljZSIsImlzTmFOIiwiaGl0cyIsIm1haW4iLCJiYXR0bGVTaGlwcyJdLCJzb3VyY2VSb290IjoiIn0=