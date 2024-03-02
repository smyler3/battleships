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
    placeShip(_ref3, _ref4, hidden) {
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
          const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${startY}"]`);
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
      // player2Board.placeShip([
      //     [9, 9],
      //     [5, 9],
      // ]);
      // player2Board.placeShip([
      //     [9, 8],
      //     [6, 8],
      // ]);
      // player2Board.placeShip([
      //     [9, 7],
      //     [7, 7],
      // ]);
      // player2Board.placeShip([
      //     [9, 6],
      //     [7, 6],
      // ]);
      // player2Board.placeShip([
      //     [9, 5],
      //     [8, 5],
      // ]);

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
      boardHandler.flipBoards();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7O0FDQWtEO0FBQzdCO0FBRXJCLGVBQWVDLElBQUlBLENBQUEsRUFBRztFQUNsQixNQUFNQyxXQUFXLEdBQUd0RCwrREFBaUIsQ0FBQyxDQUFDO0VBQ3ZDc0QsV0FBVyxDQUFDL0MsU0FBUyxDQUFDLENBQUM7RUFDdkIsTUFBTStDLFdBQVcsQ0FBQzdDLFVBQVUsQ0FBQyxDQUFDO0VBQzlCNkMsV0FBVyxDQUFDdEMsUUFBUSxDQUFDLENBQUM7QUFDMUI7QUFFQXFDLElBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9kb21Cb2FyZEhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2RvbU1lc3NhZ2VIYW5kbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9nYW1lSGFuZGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCT0FSRF9XSURUSCA9IDEwO1xyXG5jb25zdCBQTEFZRVJfMV9CT0FSRF9JRCA9IFwicGxheWVyMUJvYXJkXCI7XHJcbmNvbnN0IFBMQVlFUl8yX0JPQVJEX0lEID0gXCJwbGF5ZXIyQm9hcmRcIjtcclxuY29uc3QgTUFYX1NISVBTID0gNTtcclxuXHJcbmNvbnN0IFRJTEVTID0ge1xyXG4gICAgV0FURVI6IFwiV1wiLFxyXG4gICAgTUlTUzogXCJPXCIsXHJcbiAgICBISVQ6IFwiWFwiLFxyXG59O1xyXG5cclxuY29uc3QgVElMRV9DTEFTU0VTID0ge1xyXG4gICAgV0FURVI6IFwid2F0ZXItY2VsbFwiLFxyXG4gICAgTUlTUzogXCJtaXNzLWNlbGxcIixcclxuICAgIEhJVDogXCJoaXQtY2VsbFwiLFxyXG4gICAgU0hJUDogXCJzaGlwLWNlbGxcIixcclxufTtcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBCT0FSRF9XSURUSCxcclxuICAgIFBMQVlFUl8xX0JPQVJEX0lELFxyXG4gICAgUExBWUVSXzJfQk9BUkRfSUQsXHJcbiAgICBNQVhfU0hJUFMsXHJcbiAgICBUSUxFUyxcclxuICAgIFRJTEVfQ0xBU1NFUyxcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICAgIFBMQVlFUl8xX0JPQVJEX0lELFxyXG4gICAgUExBWUVSXzJfQk9BUkRfSUQsXHJcbiAgICBUSUxFX0NMQVNTRVMsXHJcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVET01Cb2FyZEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBsZXQgYm9hcmREaXNwbGF5ID0gbnVsbDtcclxuICAgIGxldCBwbGF5ZXIxQm9hcmQgPSBudWxsO1xyXG4gICAgbGV0IHBsYXllcjJCb2FyZCA9IG51bGw7XHJcbiAgICBsZXQgYWN0aXZlQm9hcmQgPSBudWxsO1xyXG5cclxuICAgIC8vIEV2ZW50IGZvciBzZWxlY3RpbmcgYSBjZWxsIG9uIHRoZSBib2FyZCBhbmQgcmV0dXJuaW5nIGl0J3MgY29vcmRpbmF0ZXNcclxuICAgIGNvbnN0IHNlbGVjdENlbGxFdmVudCA9IChncmlkQ2VsbCwgcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNlbGxDb29yZGluYXRlcyA9IFtcclxuICAgICAgICAgICAgZ3JpZENlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS14XCIpLFxyXG4gICAgICAgICAgICBncmlkQ2VsbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXlcIiksXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShjZWxsQ29vcmRpbmF0ZXMpO1xyXG4gICAgICAgIGRpc2FibGVBdHRhY2tDZWxsU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEV2ZW50IGZvciBzZWxlY3RpbmcgdGhlIHN0YXJ0IGNlbGwgd2hlbiBwbGFjaW5nIGEgc2hpcFxyXG4gICAgY29uc3Qgc2VsZWN0U2hpcFN0YXJ0RXZlbnQgPSAoZ3JpZENlbGwsIHJlc29sdmUpID0+IHtcclxuICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcC1zdGFydFwiKTtcclxuICAgICAgICBzZWxlY3RDZWxsRXZlbnQoZ3JpZENlbGwsIHJlc29sdmUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBjb3B5IG9mIGEgcGxheWVyJ3MgZ3JpZCB0byBkaXNwbGF5IHJlbGV2YW50IGdhbWUgaW5mb3JtYXRpb24gdG8gdGhlIHBsYXllclxyXG4gICAgZnVuY3Rpb24gY3JlYXRlR3JpZERpc3BsYXkoZ3JpZCwgaWQpIHtcclxuICAgICAgICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIGJvYXJkLmlkID0gaWQ7XHJcbiAgICAgICAgYm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWUtYm9hcmRcIik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBncmlkIGNlbGxzIHdpdGggY2VsbCBpbmZvcm1hdGlvbiBzdG9yZWQgYW5kIGRpc3BsYXllZFxyXG4gICAgICAgIGdyaWQuZm9yRWFjaCgocm93LCB4KSA9PiB7XHJcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChfLCB5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncmlkQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLmNsYXNzTGlzdC5hZGQoVElMRV9DTEFTU0VTLldBVEVSKTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteFwiLCB4KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEteVwiLCB5KTtcclxuICAgICAgICAgICAgICAgIGdyaWRDZWxsLnNldEF0dHJpYnV0ZShcImRhdGEtcGxheWVyLWlkXCIsIGlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBib2FyZC5hcHBlbmRDaGlsZChncmlkQ2VsbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBib2FyZERpc3BsYXkucHJlcGVuZChib2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIGFiaWxpdHkgdG8gYXR0YWNrIGNlbGxzIG9uIG9wcG9uZW50J3MgYm9hcmRcclxuICAgIGZ1bmN0aW9uIGRpc2FibGVBdHRhY2tDZWxsU2VsZWN0aW9uKCkge1xyXG4gICAgICAgIC8vIENsb25lIHRoZSBwYXJlbnQgbm9kZSB0byByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgIGNvbnN0IGNsb25lZEJvYXJkID0gYWN0aXZlQm9hcmQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgIGJvYXJkRGlzcGxheS5yZXBsYWNlQ2hpbGQoY2xvbmVkQm9hcmQsIGFjdGl2ZUJvYXJkKTtcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHJlZmVyZW5jZXNcclxuICAgICAgICBpZiAoYWN0aXZlQm9hcmQgPT09IHBsYXllcjFCb2FyZCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPSBjbG9uZWRCb2FyZDtcclxuXHJcbiAgICAgICAgYWN0aXZlQm9hcmQuY2hpbGROb2Rlcy5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBzZXQgb2YgcG9pbnRzIGFyZSB2YWxpZCB0byBoYXZlIGEgc2hpcCBwbGFjZWQgYmV0d2VlbiB0aGVtXHJcbiAgICBmdW5jdGlvbiB2YWxpZEVuZFBvaW50KFtzdGFydFgsIHN0YXJ0WV0sIFtlbmRYLCBlbmRZXSwgYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAvLyBTYW1lIGNvLW9yZGluYXRlXHJcbiAgICAgICAgaWYgKHN0YXJ0WCA9PT0gZW5kWCAmJiBzdGFydFkgPT09IGVuZFkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxlbmd0aCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gbnVsbDtcclxuICAgICAgICBsZXQgZW5kID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0WCA9PT0gZW5kWCkge1xyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3IgYW55IHJlbWFpbmluZyBzaGlwcyBvZiB2YWxpZCBsZW5ndGggdG8gYnJpZGdlIHRoZXNlIHBvaW50c1xyXG4gICAgICAgICAgICBsZW5ndGggPSBhbGxvd2VkTGVuZ3Rocy5maW5kKFxyXG4gICAgICAgICAgICAgICAgKG9iaikgPT4gb2JqLm51bWJlciA9PT0gTWF0aC5hYnMoc3RhcnRZIC0gZW5kWSkgKyAxLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIHNoaXBzIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0WSwgZW5kWSk7XHJcbiAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WSwgZW5kWSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gc3RhcnQ7IHkgPCBlbmQgKyAxOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7c3RhcnRYfVwiXVtkYXRhLXk9XCIke3l9XCJdYCxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2hpcCBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucyhUSUxFX0NMQVNTRVMuU0hJUCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0WSA9PT0gZW5kWSkge1xyXG4gICAgICAgICAgICAvLyBDaGVja2luZyBmb3IgYW55IHJlbWFpbmluZyBzaGlwcyBvZiB2YWxpZCBsZW5ndGggdG8gYnJpZGdlIHRoZXNlIHBvaW50c1xyXG4gICAgICAgICAgICBsZW5ndGggPSBhbGxvd2VkTGVuZ3Rocy5maW5kKFxyXG4gICAgICAgICAgICAgICAgKG9iaikgPT4gb2JqLm51bWJlciA9PT0gTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgKyAxLFxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgZm9yIHNoaXBzIGJldHdlZW4gdGhlIHBvaW50c1xyXG4gICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gc3RhcnQ7IHggPCBlbmQgKyAxOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHtzdGFydFl9XCJdYCxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2hpcCBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucyhUSUxFX0NMQVNTRVMuU0hJUCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFZhbGlkIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgaWYgKGxlbmd0aCAmJiBsZW5ndGgucmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmVzIGFsbCBzaGlwIHBsYWNlbWVudCBpbmRpY2F0b3JzIGZyb20gdGhlIGJvYXJkIGZvciBncmVhdGVyIGNsYXJpdHlcclxuICAgIGZ1bmN0aW9uIHdpcGVTaGlwUGxhY2VtZW50SW5kaWNhdG9ycygpIHtcclxuICAgICAgICAvLyBSZW1vdmUgc2hpcCBzdGFydCBzcXVhcmUgaW5kaWNhdG9yXHJcbiAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYC5ncmlkLWNlbGxbY2xhc3MqPVwic2hpcC1zdGFydFwiXWApXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwLXN0YXJ0XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHBvdGVudGlhbCBzaGlwIGVuZCBzcXVhcmUgaW5kaWNhdG9yc1xyXG4gICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGAuZ3JpZC1jZWxsW2NsYXNzKj1cInBvdGVudGlhbC1zaGlwLWVuZFwiXWApXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJwb3RlbnRpYWwtc2hpcC1lbmRcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIGFuZCByZW5kZXIgZGlzcGxheSBvZiBib3RoIHBsYXllcnMgYm9hcmRzXHJcbiAgICAgICAgcmVuZGVySW5pdGlhbEJvYXJkKHBsYXllcjFHcmlkLCBwbGF5ZXIyR3JpZCkge1xyXG4gICAgICAgICAgICBib2FyZERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkLWRpc3BsYXlcIik7XHJcblxyXG4gICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIxR3JpZCwgUExBWUVSXzFfQk9BUkRfSUQpO1xyXG4gICAgICAgICAgICBjcmVhdGVHcmlkRGlzcGxheShwbGF5ZXIyR3JpZCwgUExBWUVSXzJfQk9BUkRfSUQpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7UExBWUVSXzFfQk9BUkRfSUR9YCk7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke1BMQVlFUl8yX0JPQVJEX0lEfWApO1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9IHBsYXllcjJCb2FyZDtcclxuXHJcbiAgICAgICAgICAgIC8vIFBvc2l0aW9uIHBsYXllciAxJ3MgYm9hcmQgZmFjaW5nIHNjcmVlblxyXG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmQuY2xhc3NMaXN0LmFkZChcImZvY3VzZWQtYm9hcmRcIik7XHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5jbGFzc0xpc3QuYWRkKFwidW5mb2N1c2VkLWJvYXJkXCIpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEZsaXAgdGhlIHJlbmRlcmVkIGJvYXJkIGRpc3BsYXlcclxuICAgICAgICBmbGlwQm9hcmRzKCkge1xyXG4gICAgICAgICAgICAvLyBGbGlwIHBsYXllciAxIGJvYXJkIGNlbGxzXHJcbiAgICAgICAgICAgIHBsYXllcjFCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwiZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJ1bmZvY3VzZWQtYm9hcmRcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBGbGlwIHBsYXllciAyIGJvYXJkIGNlbGxzXHJcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5jbGFzc0xpc3QudG9nZ2xlKFwiZm9jdXNlZC1ib2FyZFwiKTtcclxuICAgICAgICAgICAgcGxheWVyMkJvYXJkLmNsYXNzTGlzdC50b2dnbGUoXCJ1bmZvY3VzZWQtYm9hcmRcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTd2l0Y2ggYm9hcmQgcG9zaXRpb25zXHJcbiAgICAgICAgICAgIGJvYXJkRGlzcGxheS5wcmVwZW5kKGJvYXJkRGlzcGxheS5sYXN0Q2hpbGQpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIHBvc3NpYmxlIHN0YXJ0IHBvc2l0aW9ucyBmb3Igc2hpcHMgc2VsZWN0YWJsZVxyXG4gICAgICAgIGFzeW5jIGVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoVElMRV9DTEFTU0VTLlNISVApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0U2hpcFN0YXJ0RXZlbnQoY2VsbCwgcmVzb2x2ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gTWFrZSBhbGwgcG9zc2libGUgZW5kIHBvc2l0aW9ucyBmb3Igc2hpcHMgc2VsZWN0YWJsZVxyXG4gICAgICAgIGFzeW5jIGVuYWJsZVNoaXBFbmRQb3NpdGlvblNlbGVjdGlvbihzdGFydFBvcywgYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGFjdGl2ZUJvYXJkLmNoaWxkTm9kZXMpLmZvckVhY2goKGNlbGwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFjZWxsLmNsYXNzTGlzdC5jb250YWlucyhUSUxFX0NMQVNTRVMuU0hJUCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRFbmRQb2ludChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS14XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZ2V0QXR0cmlidXRlKFwiZGF0YS15XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93ZWRMZW5ndGhzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc2VsZWN0YWJsZSBieSBjbGlja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2VsbEV2ZW50KGNlbGwsIHJlc29sdmUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJwb3RlbnRpYWwtc2hpcC1lbmRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgcGxhY2VkIHNoaXAgdG8gdGhlIGJvYXJkXHJcbiAgICAgICAgcGxhY2VTaGlwKFtzdGFydFgsIHN0YXJ0WV0sIFtlbmRYLCBlbmRZXSwgaGlkZGVuKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBlbmQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2luZyBzaGlwIHRpbGVzIGFsb25nIHRoZSB5LWF4aXNcclxuICAgICAgICAgICAgaWYgKHN0YXJ0WCA9PT0gZW5kWCkge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoc3RhcnRZLCBlbmRZKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gc3RhcnQ7IHkgPCBlbmQgKyAxOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS14PVwiJHtzdGFydFh9XCJdW2RhdGEteT1cIiR7eX1cIl1gLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChUSUxFX0NMQVNTRVMuU0hJUCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQbGFjaW5nIHNoaXAgdGlsZXMgYWxvbmcgdGhlIHgtYXhpc1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0OyB4IDwgZW5kICsgMTsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEteD1cIiR7eH1cIl1bZGF0YS15PVwiJHtzdGFydFl9XCJdYCxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWhpZGRlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoVElMRV9DTEFTU0VTLlNISVApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoVElMRV9DTEFTU0VTLldBVEVSKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHdpcGVTaGlwUGxhY2VtZW50SW5kaWNhdG9ycygpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1ha2UgYWxsIGF0dGFja2FibGUgY2VsbHMgb24gb3Bwb25lbnQncyBib2FyZCBzZWxlY3RhYmxlIGZvciBhdHRhY2tzXHJcbiAgICAgICAgYXN5bmMgZW5hYmxlQXR0YWNrU2VsZWN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oYWN0aXZlQm9hcmQuY2hpbGROb2RlcykuZm9yRWFjaCgoY2VsbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGlsZSBoYXNuJ3QgYWxyZWFkeSBiZWVuIGF0dGFja2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFbVElMRV9DTEFTU0VTLkhJVCwgVElMRV9DTEFTU0VTLk1JU1NdLnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGlsZVR5cGUpID0+IGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKHRpbGVUeXBlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHNlbGVjdGFibGUgYnkgY2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdENlbGxFdmVudChjZWxsLCByZXNvbHZlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2xpY2thYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBBbHRlciB0aGUgYm9hcmQgdG8gcmVmbGVjdCBhbiBhdHRhY2tcclxuICAgICAgICByZWNlaXZlQXR0YWNrKFt4LCB5XSwgaGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXg9XCIke3h9XCJdW2RhdGEteT1cIiR7eX1cIl1bZGF0YS1wbGF5ZXItaWQ9XCIke2FjdGl2ZUJvYXJkLmlkfVwiXWAsXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShUSUxFX0NMQVNTRVMuV0FURVIpO1xyXG4gICAgICAgICAgICBhdHRhY2tlZENlbGwuY2xhc3NMaXN0LnJlbW92ZShcImNsaWNrYWJsZVwiKTtcclxuICAgICAgICAgICAgYXR0YWNrZWRDZWxsLmNsYXNzTGlzdC5hZGQoXHJcbiAgICAgICAgICAgICAgICBoaXQgPyBUSUxFX0NMQVNTRVMuSElUIDogVElMRV9DTEFTU0VTLk1JU1MsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2hhbmdlIHdoaWNoIGJvYXJkIGlzIGFjdGl2ZVxyXG4gICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCkge1xyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlRE9NQm9hcmRIYW5kbGVyIH07XHJcbiIsImNvbnN0IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgLy8gQ3JlYXRlIG1lc3NhZ2UgYmFubmVyXHJcbiAgICAvLyBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAvLyBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XHJcbiAgICBjb25zdCBtZXNzYWdlQmFubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG1lc3NhZ2VCYW5uZXIuY2xhc3NMaXN0LmFkZChcIm1lc3NhZ2UtYmFubmVyXCIpO1xyXG4gICAgLy8gbW9kYWwuYXBwZW5kQ2hpbGQobWVzc2FnZUJhbm5lcik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5wcmVwZW5kKG1lc3NhZ2VCYW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGlzcGxheVNoaXBQbGFjZVByb21wdChzaGlwc1JlbWFpbmluZykge1xyXG4gICAgICAgICAgICBtZXNzYWdlQmFubmVyLnRleHRDb250ZW50ID0gYFBsYWNlIGEgc2hpcCwgJHtzaGlwc1JlbWFpbmluZ30gc2hpcHMgcmVtYWluaW5nYDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5Q3VycmVudFR1cm4ocGxheWVyVHVybiA9IHRydWUpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IHBsYXllclR1cm5cclxuICAgICAgICAgICAgICAgID8gXCJZb3VyIHR1cm4hIE1ha2UgYW4gYXR0YWNrXCJcclxuICAgICAgICAgICAgICAgIDogYE9wcG9uZW50IFR1cm4hIE1ha2luZyBhbiBhdHRhY2tgO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRpc3BsYXlBdHRhY2tSZXN1bHQoaGl0KSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2VCYW5uZXIudGV4dENvbnRlbnQgPSBoaXQgPyBcIlNoaXAgaGl0IVwiIDogXCJTaG90IG1pc3NlZCFcIjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkaXNwbGF5V2lubmVyKG5hbWUpIHtcclxuICAgICAgICAgICAgbWVzc2FnZUJhbm5lci50ZXh0Q29udGVudCA9IGBWaWN0b3J5IGZvciAke25hbWV9IWA7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVET01NZXNzYWdlSGFuZGxlciB9O1xyXG4iLCJpbXBvcnQgeyBjcmVhdGVQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlRE9NQm9hcmRIYW5kbGVyIH0gZnJvbSBcIi4vZG9tQm9hcmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xyXG5pbXBvcnQgeyBjcmVhdGVET01NZXNzYWdlSGFuZGxlciB9IGZyb20gXCIuL2RvbU1lc3NhZ2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE1BWF9TSElQUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuY29uc3QgY3JlYXRlR2FtZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBzd2l0Y2hBY3RpdmVQbGF5ZXIoKSB7XHJcbiAgICAgICAgYWN0aXZlUGxheWVyID0gYWN0aXZlUGxheWVyID09PSBwbGF5ZXIxID8gcGxheWVyMiA6IHBsYXllcjE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3dpdGNoQWN0aXZlQm9hcmQoKSB7XHJcbiAgICAgICAgYWN0aXZlQm9hcmQgPVxyXG4gICAgICAgICAgICBhY3RpdmVCb2FyZCA9PT0gcGxheWVyMUJvYXJkID8gcGxheWVyMkJvYXJkIDogcGxheWVyMUJvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBib2FyZEhhbmRsZXIgPSBudWxsO1xyXG4gICAgbGV0IG1lc3NhZ2VIYW5kbGVyID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMSA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMUJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcGxheWVyMiA9IG51bGw7XHJcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gbnVsbDtcclxuXHJcbiAgICBsZXQgYWN0aXZlUGxheWVyID0gbnVsbDtcclxuICAgIGxldCBhY3RpdmVCb2FyZCA9IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXR1cEdhbWUoKSB7XHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlciA9IGNyZWF0ZURPTUJvYXJkSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBtZXNzYWdlSGFuZGxlciA9IGNyZWF0ZURPTU1lc3NhZ2VIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKGZhbHNlKTtcclxuICAgICAgICAgICAgcGxheWVyMUJvYXJkID0gY3JlYXRlR2FtZWJvYXJkKCk7XHJcblxyXG4gICAgICAgICAgICBwbGF5ZXIyID0gY3JlYXRlUGxheWVyKHRydWUpO1xyXG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmQgPSBjcmVhdGVHYW1lYm9hcmQoKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllciA9IHBsYXllcjE7XHJcbiAgICAgICAgICAgIGFjdGl2ZUJvYXJkID0gcGxheWVyMkJvYXJkO1xyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcHMgcGxheWVyIDFcclxuICAgICAgICAgICAgLy8gcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgIC8vICAgICBbMywgM10sXHJcbiAgICAgICAgICAgIC8vICAgICBbNywgM10sXHJcbiAgICAgICAgICAgIC8vIF0pO1xyXG4gICAgICAgICAgICAvLyBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFszLCA0XSxcclxuICAgICAgICAgICAgLy8gICAgIFs2LCA0XSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAvLyAgICAgWzMsIDVdLFxyXG4gICAgICAgICAgICAvLyAgICAgWzUsIDVdLFxyXG4gICAgICAgICAgICAvLyBdKTtcclxuICAgICAgICAgICAgLy8gcGxheWVyMUJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgIC8vICAgICBbMywgNl0sXHJcbiAgICAgICAgICAgIC8vICAgICBbNSwgNl0sXHJcbiAgICAgICAgICAgIC8vIF0pO1xyXG4gICAgICAgICAgICAvLyBwbGF5ZXIxQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFszLCA3XSxcclxuICAgICAgICAgICAgLy8gICAgIFs0LCA3XSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBzaGlwcyBwbGF5ZXIgMlxyXG4gICAgICAgICAgICAvLyBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFs5LCA5XSxcclxuICAgICAgICAgICAgLy8gICAgIFs1LCA5XSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAvLyAgICAgWzksIDhdLFxyXG4gICAgICAgICAgICAvLyAgICAgWzYsIDhdLFxyXG4gICAgICAgICAgICAvLyBdKTtcclxuICAgICAgICAgICAgLy8gcGxheWVyMkJvYXJkLnBsYWNlU2hpcChbXHJcbiAgICAgICAgICAgIC8vICAgICBbOSwgN10sXHJcbiAgICAgICAgICAgIC8vICAgICBbNywgN10sXHJcbiAgICAgICAgICAgIC8vIF0pO1xyXG4gICAgICAgICAgICAvLyBwbGF5ZXIyQm9hcmQucGxhY2VTaGlwKFtcclxuICAgICAgICAgICAgLy8gICAgIFs5LCA2XSxcclxuICAgICAgICAgICAgLy8gICAgIFs3LCA2XSxcclxuICAgICAgICAgICAgLy8gXSk7XHJcbiAgICAgICAgICAgIC8vIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW1xyXG4gICAgICAgICAgICAvLyAgICAgWzksIDVdLFxyXG4gICAgICAgICAgICAvLyAgICAgWzgsIDVdLFxyXG4gICAgICAgICAgICAvLyBdKTtcclxuXHJcbiAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZW5kZXJJbml0aWFsQm9hcmQoXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0R3JpZCgpLFxyXG4gICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmdldEdyaWQoKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBGaWxsIHRoZSBib2FyZCB3aXRoIHNoaXBzXHJcbiAgICAgICAgYXN5bmMgc2V0dXBTaGlwcygpIHtcclxuICAgICAgICAgICAgbGV0IHBsYWNlZCA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdXAgY29tcHV0ZXIgc2hpcHNcclxuICAgICAgICAgICAgd2hpbGUgKHBsYWNlZCA8IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgLy8gVHJ5IHBsYWNpbmcgYSBzaGlwIGF0IGNvbXB1dGVyIGdlbmVyYXRlZCBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW3N0YXJ0UG9zLCBlbmRQb3NdID0gcGxheWVyMi5wcm92aWRlU2hpcENvb3JkaW5hdGVzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQuZ2V0QWxsb3dlZExlbmd0aHMoKSxcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXAoW3N0YXJ0UG9zLCBlbmRQb3NdKTtcclxuICAgICAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIucGxhY2VTaGlwKHN0YXJ0UG9zLCBlbmRQb3MsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFtzdGFydFBvcywgZW5kUG9zXSk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBjb29yZGluYXRlcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYm9hcmRIYW5kbGVyLmZsaXBCb2FyZHMoKTtcclxuICAgICAgICAgICAgcGxhY2VkID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB1cCBwbGF5ZXIgc2hpcHNcclxuICAgICAgICAgICAgd2hpbGUgKHBsYWNlZCA8IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheVNoaXBQbGFjZVByb21wdChNQVhfU0hJUFMgLSBwbGFjZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdhaXQgZm9yIHNoaXAgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kUG9zID0gYXdhaXQgYm9hcmRIYW5kbGVyLmVuYWJsZVNoaXBFbmRQb3NpdGlvblNlbGVjdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFBvcyxcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuZ2V0QWxsb3dlZExlbmd0aHMoKSxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVHJ5IHBsYWNpbmcgYSBzaGlwIGF0IHRob3NlIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5wbGFjZVNoaXAoW3N0YXJ0UG9zLCBlbmRQb3NdKTtcclxuICAgICAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIucGxhY2VTaGlwKHN0YXJ0UG9zLCBlbmRQb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlZCArPSAxO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgY29vcmRpbmF0ZXMgaW52YWxpZCwgYXNrIGFnYWluXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNYWluIGdhbWUgbG9vcFxyXG4gICAgICAgIGFzeW5jIHBsYXlHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghZ2FtZU92ZXIpIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VIYW5kbGVyLmRpc3BsYXlDdXJyZW50VHVybighYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbGlkQXR0YWNrID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCF2YWxpZEF0dGFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhdHRhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoaXQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY29tcHV0ZXIgcGxheWVyIG1vdmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGF1c2UgdG8gc2ltdWxhdGUgY29tcHV0ZXIgdGhpbmtpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNrIGNvbXB1dGVyIGZvciBhdHRhY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrID0gYWN0aXZlUGxheWVyLnByb3ZpZGVBdHRhY2tDb29yZGluYXRlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGh1bWFuIHBsYXllciBtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFzayBodW1hbiBwbGF5ZXIgZm9yIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2sgPSBhd2FpdCBib2FyZEhhbmRsZXIuZW5hYmxlQXR0YWNrU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdGhhdCBhdHRhY2sgb24gb3Bwb25lbnQgYm9hcmRcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXQgPSBhY3RpdmVCb2FyZC5yZWNlaXZlQXR0YWNrKGF0dGFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkSGFuZGxlci5yZWNlaXZlQXR0YWNrKGF0dGFjaywgaGl0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRBdHRhY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGFuZGxlci5kaXNwbGF5QXR0YWNrUmVzdWx0KGhpdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGF0dGFjayBpcyBpbnZhbGlkLCBhc2sgYWdhaW5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCByZWdpc3RlciBpdCBhbmQgdGhlbiBhd2FpdCBpbnB1dCBmcm9tIG90aGVyIHBsYXllclxyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUJvYXJkLmlzRmxlZXRTdW5rKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBHYW1lIG92ZXJcclxuICAgICAgICAgICAgICAgICAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUhhbmRsZXIuZGlzcGxheVdpbm5lcihcIlBsYXllciAxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggcGxheWVyIHR1cm5zXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVQbGF5ZXIoKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZUJvYXJkKCk7XHJcbiAgICAgICAgICAgICAgICBib2FyZEhhbmRsZXIuc3dpdGNoQWN0aXZlQm9hcmQoKTtcclxuICAgICAgICAgICAgICAgIC8vIGJvYXJkSGFuZGxlci5mbGlwQm9hcmRzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCB7IGNyZWF0ZUdhbWVIYW5kbGVyIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRILCBNQVhfU0hJUFMsIFRJTEVTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNoaXAgfSBmcm9tIFwiLi9zaGlwXCI7XHJcblxyXG5jb25zdCBjcmVhdGVHYW1lYm9hcmQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhbGxvd2VkTGVuZ3RocyA9IFtcclxuICAgICAgICB7IG51bWJlcjogMiwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICAgICAgeyBudW1iZXI6IDMsIHJlbWFpbmluZzogMiB9LFxyXG4gICAgICAgIHsgbnVtYmVyOiA0LCByZW1haW5pbmc6IDEgfSxcclxuICAgICAgICB7IG51bWJlcjogNSwgcmVtYWluaW5nOiAxIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBCT0FSRF9XSURUSCB9LCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IEJPQVJEX1dJRFRIIH0pLmZpbGwoVElMRVMuV0FURVIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcGxhY2VkU2hpcHMgPSBbXTtcclxuXHJcbiAgICAvLyBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHBhaXIgb2YgY29vcmRpbmF0ZXMgaXMgdmFsaWQgZm9yIHBsYWNpbmcgYSBzaGlwXHJcbiAgICBmdW5jdGlvbiBpc1ZhbGlkQ29vcmRzKG1pblgsIG1pblksIG1heFgsIG1heFkpIHtcclxuICAgICAgICAvLyBTaGlwIHBsYWNlZCBvZmYgdGhlIGJvYXJkXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0uc29tZShcclxuICAgICAgICAgICAgICAgIChjb29yZCkgPT4gY29vcmQgPCAwIHx8IGNvb3JkID49IEJPQVJEX1dJRFRILFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNoaXAgcGxhY2VkIGRpYWdvbmFsbHlcclxuICAgICAgICBpZiAobWluWCAhPT0gbWF4WCAmJiBtaW5ZICE9PSBtYXhZKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBzaGlwcyBhbHJlYWR5IGluIHRoZSBncmlkXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IG1pblg7IHggPD0gbWF4WDsgeCArPSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2hpcCBhbHJlYWR5IHBsYWNlZCB0aGVyZVxyXG4gICAgICAgICAgICAgICAgaWYgKGdyaWRbeF1beV0gIT09IFRJTEVTLldBVEVSKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIFBsYWNlIGEgc2hpcCBvbiB0aGUgZ2FtZSBib2FyZCBiYXNlZCBvbiBzdGFydCBhbmQgZW5kIGNvb3JkaW5hdGVzXHJcbiAgICAgICAgcGxhY2VTaGlwKFtbc3RhcnRYLCBzdGFydFldLCBbZW5kWCwgZW5kWV1dKSB7XHJcbiAgICAgICAgICAgIC8vIE1heCBzaGlwcyBhbHJlYWR5IHBsYWNlZFxyXG4gICAgICAgICAgICBpZiAocGxhY2VkU2hpcHMubGVuZ3RoID49IE1BWF9TSElQUykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hpcCBjYXBhY2l0eSByZWFjaGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtaW5YID0gTWF0aC5taW4oc3RhcnRYLCBlbmRYKTtcclxuICAgICAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbihzdGFydFksIGVuZFkpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoc3RhcnRZLCBlbmRZKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEludmFsaWQgY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkQ29vcmRzKG1pblgsIG1pblksIG1heFgsIG1heFkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzaGlwTGVuZ3RoID1cclxuICAgICAgICAgICAgICAgIDEgKyBNYXRoLm1heChNYXRoLmFicyhzdGFydFggLSBlbmRYKSwgTWF0aC5hYnMoc3RhcnRZIC0gZW5kWSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgc2hpcCBsZW5ndGggdmFsaWRpdHlcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gYWxsb3dlZExlbmd0aHMuZmluZCgob2JqKSA9PiBvYmoubnVtYmVyID09PSBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCB8fCBvYmoucmVtYWluaW5nIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc2hpcCBsZW5ndGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgc2hpcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2hpcCA9IGNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBzaGlwIHJlZmVyZW5jZXMgdG8gdGhlIGdyaWRcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gbWluWDsgeCA8PSBtYXhYOyB4ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZFt4XVt5XSA9IHBsYWNlZFNoaXBzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG9iai5yZW1haW5pbmcgLT0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlY2VpdmVBdHRhY2soW3gsIHldKSB7XHJcbiAgICAgICAgICAgIGlmIChbeCwgeV0uc29tZSgoY29vcmQpID0+IGNvb3JkIDwgMCB8fCBjb29yZCA+PSBCT0FSRF9XSURUSCkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY29vcmRpbmF0ZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IGdyaWRbeF1beV07XHJcblxyXG4gICAgICAgICAgICAvLyBEdXBsaWNhdGUgYXR0YWNrXHJcbiAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IFRJTEVTLk1JU1MgfHwgc3F1YXJlID09PSBUSUxFUy5ISVQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFscmVhZHkgYXR0YWNrZWQgdGhpcyBzcXVhcmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE1pc3NcclxuICAgICAgICAgICAgaWYgKHNxdWFyZSA9PT0gVElMRVMuV0FURVIpIHtcclxuICAgICAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5NSVNTO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSGl0XHJcbiAgICAgICAgICAgIHBsYWNlZFNoaXBzW3NxdWFyZV0uaGl0KCk7XHJcbiAgICAgICAgICAgIGdyaWRbeF1beV0gPSBUSUxFUy5ISVQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpc0ZsZWV0U3VuaygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlZFNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRHcmlkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JpZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbGxvd2VkTGVuZ3RocygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbG93ZWRMZW5ndGhzO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHsgY3JlYXRlR2FtZWJvYXJkIH07XHJcbiIsImltcG9ydCB7IEJPQVJEX1dJRFRIIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XHJcblxyXG5jb25zdCBjcmVhdGVQbGF5ZXIgPSAoaXNDb21wdXRlcikgPT4ge1xyXG4gICAgLy8gRmlsbCBhbiBhcnJheSB3aXRoIGFsbCBwb3NzaWJsZSBhdHRhY2tzIG9uIHRoZSBib2FyZFxyXG4gICAgY29uc3QgcG9zc2libGVBdHRhY2tzID0gW107XHJcblxyXG4gICAgY29uc3Qgb3JpZW50YXRpb25zID0ge1xyXG4gICAgICAgIEhPUklaT05UQUw6IDAsXHJcbiAgICAgICAgVkVSVElDQUw6IDEsXHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgQk9BUkRfV0lEVEg7IHggKz0gMSkge1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgQk9BUkRfV0lEVEg7IHkgKz0gMSkge1xyXG4gICAgICAgICAgICBwb3NzaWJsZUF0dGFja3MucHVzaChbeCwgeV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQ29tcHV0ZXIsXHJcblxyXG4gICAgICAgIHByb3ZpZGVTaGlwQ29vcmRpbmF0ZXMoYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHN0YXJ0IGNvLW9yZGluYXRlc1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydFggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCT0FSRF9XSURUSCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0WSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJPQVJEX1dJRFRIKTtcclxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIG9yaWVudGF0aW9uXHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWVudGF0aW9uID1cclxuICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgPCAwLjVcclxuICAgICAgICAgICAgICAgICAgICA/IG9yaWVudGF0aW9ucy5IT1JJWk9OVEFMXHJcbiAgICAgICAgICAgICAgICAgICAgOiBvcmllbnRhdGlvbnMuVkVSVElDQUw7XHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSBsZW5ndGhcclxuICAgICAgICAgICAgbGV0IHNoaXBMZW5ndGggPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBsZW5ndGggb2YgYWxsb3dlZExlbmd0aHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsZW5ndGgucmVtYWluaW5nID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBMZW5ndGggPSBsZW5ndGgubnVtYmVyIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcCBob3Jpem9udGFsbHlcclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBvcmllbnRhdGlvbnMuSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgYWNjb3JkaW5nIHRvIGJvYXJkIHdpZHRoIGxpbWl0YXRpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRYIC0gc2hpcExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYICsgc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFggKyBzaGlwTGVuZ3RoID49IEJPQVJEX1dJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCAtIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIHJhbmRvbWx5IGxlZnQgb3IgcmlnaHRcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCArIHNoaXBMZW5ndGgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYIC0gc2hpcExlbmd0aCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUGxhY2Ugc2hpcCB2ZXJ0aWNhbGx5XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gUGxhY2UgYWNjb3JkaW5nIHRvIGJvYXJkIHdpZHRoIGxpbWl0YXRpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRZIC0gc2hpcExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgKyBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFkgKyBzaGlwTGVuZ3RoID49IEJPQVJEX1dJRFRIKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZIC0gc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIFBsYWNlIHJhbmRvbWx5IHVwIG9yIGRvd25cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0YXJ0WCwgc3RhcnRZICsgc2hpcExlbmd0aF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGFydFgsIHN0YXJ0WV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3RhcnRYLCBzdGFydFkgLSBzaGlwTGVuZ3RoXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBwcm92aWRlQXR0YWNrQ29vcmRpbmF0ZXMoKSB7XHJcbiAgICAgICAgICAgIC8vIFBpY2sgYSByYW5kb20gYXR0YWNrXHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFja051bWJlciA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogcG9zc2libGVBdHRhY2tzLmxlbmd0aCxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhdHRhY2sgZnJvbSBhbGwgcG9zc2libGUgYXR0YWNrcyBhbmQgcmV0dXJuIGl0XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGFjayA9IHBvc3NpYmxlQXR0YWNrcy5zcGxpY2UoYXR0YWNrTnVtYmVyLCAxKVswXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhdHRhY2s7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVQbGF5ZXIgfTtcclxuIiwiY29uc3QgY3JlYXRlU2hpcCA9IChzaGlwTGVuZ3RoKSA9PiB7XHJcbiAgICAvLyBFcnJvciBjaGVja2luZ1xyXG4gICAgaWYgKHR5cGVvZiBzaGlwTGVuZ3RoICE9PSBcIm51bWJlclwiIHx8IGlzTmFOKHNoaXBMZW5ndGgpIHx8IHNoaXBMZW5ndGggPCAxKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzaGlwIGxlbmd0aFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xyXG4gICAgbGV0IGhpdHMgPSAwO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIHNoaXAgaGFzIG1vcmUgaGl0cyB0aGFuIGxpdmVzXHJcbiAgICAgICAgaXNTdW5rKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaGl0cyA+PSBsZW5ndGg7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQWRkIGRhbWFnYWUgdG8gdGhlIHNoaXAgYW5kIGNoZWNrIGZvciBzaW5raW5nXHJcbiAgICAgICAgaGl0KCkge1xyXG4gICAgICAgICAgICBoaXRzICs9IDE7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgeyBjcmVhdGVTaGlwIH07XHJcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGA6cm9vdCB7XHJcbiAgICAtLWdyaWQtY2VsbC1nYXA6IDFweDtcclxuICAgIC0tZ3JpZC1wYWRkaW5nOiAycHg7XHJcbiAgICAtLWdyaWQtY2VsbC1zaXplOiAycmVtO1xyXG5cclxuICAgIC0tYmFubmVyLWJhY2tncm91bmQ6ICMwMDAwMDA5OTtcclxufVxyXG5cclxuLypcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIEdlbmVyYWwgU3R5bGluZ1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICovXHJcbioge1xyXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICAgIG1hcmdpbjogMDtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbmJvZHkge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbn1cclxuXHJcbi5ib2FyZC1kaXNwbGF5IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZ2FwOiAycmVtO1xyXG5cclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5nYW1lLWJvYXJkIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBnYXA6IHZhcigtLWdyaWQtY2VsbC1nYXApO1xyXG5cclxuICAgIHdpZHRoOiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG4gICAgaGVpZ2h0OiBjYWxjKGNhbGMoMTAgKiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSkpICsgY2FsYyh2YXIoLS1ncmlkLXBhZGRpbmcpICogMikgKyBjYWxjKHZhcigtLWdyaWQtY2VsbC1nYXApICogOSkpO1xyXG5cclxuICAgIHBhZGRpbmc6IDJweDtcclxuXHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xyXG59XHJcblxyXG4uZm9jdXNlZC1ib2FyZCB7XHJcbiAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbn1cclxuXHJcbi51bmZvY3VzZWQtYm9hcmQge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdy1yZXZlcnNlO1xyXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XHJcbn1cclxuXHJcbi5ncmlkLWNlbGwge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICB3aWR0aDogdmFyKC0tZ3JpZC1jZWxsLXNpemUpO1xyXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XHJcbn1cclxuXHJcbi5jbGlja2FibGUge1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbi5jbGlja2FibGU6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDAsIDE4MywgMjU1KTtcclxufVxyXG5cclxuLndhdGVyLWNlbGwge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcclxufVxyXG5cclxuLnNoaXAtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG59XHJcblxyXG4ubWlzcy1jZWxsIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcbn1cclxuXHJcbi5oaXQtY2VsbCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XHJcbn1cclxuXHJcbi5zaGlwLXN0YXJ0IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVueWVsbG93O1xyXG59XHJcblxyXG4ucG90ZW50aWFsLXNoaXAtZW5kIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xyXG59XHJcblxyXG4ubWVzc2FnZS1iYW5uZXIge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuXHJcbiAgICBoZWlnaHQ6IDEwJTtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcclxuICAgIHBhZGRpbmc6IDEuNXJlbSAwO1xyXG5cclxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XHJcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxvQkFBb0I7SUFDcEIsbUJBQW1CO0lBQ25CLHNCQUFzQjs7SUFFdEIsOEJBQThCO0FBQ2xDOztBQUVBOzs7O0VBSUU7QUFDRjtJQUNJLHNCQUFzQjtJQUN0QixTQUFTO0lBQ1QsVUFBVTtBQUNkOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLFNBQVM7O0lBRVQseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLHlCQUF5Qjs7SUFFekIsOEdBQThHO0lBQzlHLCtHQUErRzs7SUFFL0csWUFBWTs7SUFFWix5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxlQUFlO0FBQ25COztBQUVBO0lBQ0ksMkJBQTJCO0lBQzNCLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsdUJBQXVCOztJQUV2Qiw0QkFBNEI7SUFDNUIsNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjtBQUNBO0lBQ0ksa0NBQWtDO0FBQ3RDOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kscUJBQXFCO0FBQ3pCOztBQUVBO0lBQ0ksNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7O0lBRXZCLFdBQVc7SUFDWCxXQUFXOztJQUVYLHFCQUFxQjtJQUNyQixpQkFBaUI7O0lBRWpCLG9CQUFvQjtJQUNwQixpQkFBaUI7SUFDakIsWUFBWTtJQUNaLDBDQUEwQztBQUM5Q1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCI6cm9vdCB7XFxyXFxuICAgIC0tZ3JpZC1jZWxsLWdhcDogMXB4O1xcclxcbiAgICAtLWdyaWQtcGFkZGluZzogMnB4O1xcclxcbiAgICAtLWdyaWQtY2VsbC1zaXplOiAycmVtO1xcclxcblxcclxcbiAgICAtLWJhbm5lci1iYWNrZ3JvdW5kOiAjMDAwMDAwOTk7XFxyXFxufVxcclxcblxcclxcbi8qXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICogR2VuZXJhbCBTdHlsaW5nXFxyXFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxyXFxuICovXFxyXFxuKiB7XFxyXFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uYm9hcmQtZGlzcGxheSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBnYXA6IDJyZW07XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5nYW1lLWJvYXJkIHtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZ2FwOiB2YXIoLS1ncmlkLWNlbGwtZ2FwKTtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IGNhbGMoY2FsYygxMCAqIHZhcigtLWdyaWQtY2VsbC1zaXplKSkgKyBjYWxjKHZhcigtLWdyaWQtcGFkZGluZykgKiAyKSArIGNhbGModmFyKC0tZ3JpZC1jZWxsLWdhcCkgKiA5KSk7XFxyXFxuICAgIGhlaWdodDogY2FsYyhjYWxjKDEwICogdmFyKC0tZ3JpZC1jZWxsLXNpemUpKSArIGNhbGModmFyKC0tZ3JpZC1wYWRkaW5nKSAqIDIpICsgY2FsYyh2YXIoLS1ncmlkLWNlbGwtZ2FwKSAqIDkpKTtcXHJcXG5cXHJcXG4gICAgcGFkZGluZzogMnB4O1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uZm9jdXNlZC1ib2FyZCB7XFxyXFxuICAgIGZsZXgtd3JhcDogd3JhcDtcXHJcXG59XFxyXFxuXFxyXFxuLnVuZm9jdXNlZC1ib2FyZCB7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcXHJcXG4gICAgZmxleC13cmFwOiB3cmFwLXJldmVyc2U7XFxyXFxufVxcclxcblxcclxcbi5ncmlkLWNlbGwge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgd2lkdGg6IHZhcigtLWdyaWQtY2VsbC1zaXplKTtcXHJcXG4gICAgaGVpZ2h0OiB2YXIoLS1ncmlkLWNlbGwtc2l6ZSk7XFxyXFxufVxcclxcblxcclxcbi5jbGlja2FibGUge1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcbi5jbGlja2FibGU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMTgzLCAyNTUpO1xcclxcbn1cXHJcXG5cXHJcXG4ud2F0ZXItY2VsbCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxyXFxufVxcclxcblxcclxcbi5zaGlwLWNlbGwge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xcclxcbn1cXHJcXG5cXHJcXG4ubWlzcy1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdC1jZWxsIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4uc2hpcC1zdGFydCB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZWVueWVsbG93O1xcclxcbn1cXHJcXG5cXHJcXG4ucG90ZW50aWFsLXNoaXAtZW5kIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5tZXNzYWdlLWJhbm5lciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcblxcclxcbiAgICBoZWlnaHQ6IDEwJTtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuXFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcXHJcXG4gICAgcGFkZGluZzogMS41cmVtIDA7XFxyXFxuXFxyXFxuICAgIGZvbnQtc2l6ZTogeHh4LWxhcmdlO1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgY29sb3I6IHdoaXRlO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1iYW5uZXItYmFja2dyb3VuZCk7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBjcmVhdGVHYW1lSGFuZGxlciB9IGZyb20gXCIuL2dhbWVIYW5kbGVyXCI7XHJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgY29uc3QgYmF0dGxlU2hpcHMgPSBjcmVhdGVHYW1lSGFuZGxlcigpO1xyXG4gICAgYmF0dGxlU2hpcHMuc2V0dXBHYW1lKCk7XHJcbiAgICBhd2FpdCBiYXR0bGVTaGlwcy5zZXR1cFNoaXBzKCk7XHJcbiAgICBiYXR0bGVTaGlwcy5wbGF5R2FtZSgpO1xyXG59XHJcblxyXG5tYWluKCk7XHJcbiJdLCJuYW1lcyI6WyJCT0FSRF9XSURUSCIsIlBMQVlFUl8xX0JPQVJEX0lEIiwiUExBWUVSXzJfQk9BUkRfSUQiLCJNQVhfU0hJUFMiLCJUSUxFUyIsIldBVEVSIiwiTUlTUyIsIkhJVCIsIlRJTEVfQ0xBU1NFUyIsIlNISVAiLCJjcmVhdGVET01Cb2FyZEhhbmRsZXIiLCJib2FyZERpc3BsYXkiLCJwbGF5ZXIxQm9hcmQiLCJwbGF5ZXIyQm9hcmQiLCJhY3RpdmVCb2FyZCIsInNlbGVjdENlbGxFdmVudCIsImdyaWRDZWxsIiwicmVzb2x2ZSIsImNlbGxDb29yZGluYXRlcyIsImdldEF0dHJpYnV0ZSIsImRpc2FibGVBdHRhY2tDZWxsU2VsZWN0aW9uIiwic2VsZWN0U2hpcFN0YXJ0RXZlbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJjcmVhdGVHcmlkRGlzcGxheSIsImdyaWQiLCJpZCIsImJvYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZm9yRWFjaCIsInJvdyIsIngiLCJfIiwieSIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwicHJlcGVuZCIsImNsb25lZEJvYXJkIiwiY2xvbmVOb2RlIiwicmVwbGFjZUNoaWxkIiwiY2hpbGROb2RlcyIsImNlbGwiLCJyZW1vdmUiLCJ2YWxpZEVuZFBvaW50IiwiX3JlZiIsIl9yZWYyIiwiYWxsb3dlZExlbmd0aHMiLCJzdGFydFgiLCJzdGFydFkiLCJlbmRYIiwiZW5kWSIsImxlbmd0aCIsInN0YXJ0IiwiZW5kIiwiZmluZCIsIm9iaiIsIm51bWJlciIsIk1hdGgiLCJhYnMiLCJtaW4iLCJtYXgiLCJxdWVyeVNlbGVjdG9yIiwiY29udGFpbnMiLCJyZW1haW5pbmciLCJ3aXBlU2hpcFBsYWNlbWVudEluZGljYXRvcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVuZGVySW5pdGlhbEJvYXJkIiwicGxheWVyMUdyaWQiLCJwbGF5ZXIyR3JpZCIsImZsaXBCb2FyZHMiLCJ0b2dnbGUiLCJzd2l0Y2hBY3RpdmVCb2FyZCIsImxhc3RDaGlsZCIsImVuYWJsZVNoaXBTdGFydFBvc2l0aW9uU2VsZWN0aW9uIiwiUHJvbWlzZSIsIkFycmF5IiwiZnJvbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbmFibGVTaGlwRW5kUG9zaXRpb25TZWxlY3Rpb24iLCJzdGFydFBvcyIsInBsYWNlU2hpcCIsIl9yZWYzIiwiX3JlZjQiLCJoaWRkZW4iLCJlbmFibGVBdHRhY2tTZWxlY3Rpb24iLCJzb21lIiwidGlsZVR5cGUiLCJyZWNlaXZlQXR0YWNrIiwiX3JlZjUiLCJoaXQiLCJhdHRhY2tlZENlbGwiLCJjcmVhdGVET01NZXNzYWdlSGFuZGxlciIsIm1lc3NhZ2VCYW5uZXIiLCJkaXNwbGF5U2hpcFBsYWNlUHJvbXB0Iiwic2hpcHNSZW1haW5pbmciLCJ0ZXh0Q29udGVudCIsImRpc3BsYXlDdXJyZW50VHVybiIsInBsYXllclR1cm4iLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJkaXNwbGF5QXR0YWNrUmVzdWx0IiwiZGlzcGxheVdpbm5lciIsIm5hbWUiLCJjcmVhdGVQbGF5ZXIiLCJjcmVhdGVHYW1lYm9hcmQiLCJjcmVhdGVHYW1lSGFuZGxlciIsInN3aXRjaEFjdGl2ZVBsYXllciIsImFjdGl2ZVBsYXllciIsInBsYXllcjEiLCJwbGF5ZXIyIiwiYm9hcmRIYW5kbGVyIiwibWVzc2FnZUhhbmRsZXIiLCJzZXR1cEdhbWUiLCJnZXRHcmlkIiwic2V0dXBTaGlwcyIsInBsYWNlZCIsImVuZFBvcyIsInByb3ZpZGVTaGlwQ29vcmRpbmF0ZXMiLCJnZXRBbGxvd2VkTGVuZ3RocyIsImNvbnNvbGUiLCJsb2ciLCJwbGF5R2FtZSIsImdhbWVPdmVyIiwiaXNDb21wdXRlciIsInZhbGlkQXR0YWNrIiwiYXR0YWNrIiwic2V0VGltZW91dCIsInByb3ZpZGVBdHRhY2tDb29yZGluYXRlcyIsImlzRmxlZXRTdW5rIiwiY3JlYXRlU2hpcCIsImZpbGwiLCJwbGFjZWRTaGlwcyIsImlzVmFsaWRDb29yZHMiLCJtaW5YIiwibWluWSIsIm1heFgiLCJtYXhZIiwiY29vcmQiLCJFcnJvciIsInNoaXBMZW5ndGgiLCJuZXdTaGlwIiwicHVzaCIsImVycm9yIiwic3F1YXJlIiwiZXZlcnkiLCJzaGlwIiwiaXNTdW5rIiwicG9zc2libGVBdHRhY2tzIiwib3JpZW50YXRpb25zIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiZmxvb3IiLCJyYW5kb20iLCJvcmllbnRhdGlvbiIsImF0dGFja051bWJlciIsInNwbGljZSIsImlzTmFOIiwiaGl0cyIsIm1haW4iLCJiYXR0bGVTaGlwcyJdLCJzb3VyY2VSb290IjoiIn0=