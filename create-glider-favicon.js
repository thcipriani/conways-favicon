(function() {
  'use strict'

  var GameOfLife,
    _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GameOfLife = function() {
    this.tick = _bind(this.tick, this)
    this.createCanvas()
    this.resizeCanvas()
    this.createDrawingContext()
    this.seed()
    this.tick()
  }

  GameOfLife.prototype.curCellGen      = []
  GameOfLife.prototype.cellSize        = 5
  GameOfLife.prototype.numberOfRows    = 3
  GameOfLife.prototype.numberOfCols    = 3
  GameOfLife.prototype.tickLength      = 1250
  GameOfLife.prototype.canvas          = null
  GameOfLife.prototype.drawingContext  = null
  GameOfLife.prototype.generation      = 0
  GameOfLife.prototype.glider = [
    {x: 0, y: 1}
   ,{x: 1, y: 2}
   ,{x: 2, y: 0}
   ,{x: 2, y: 1}
   ,{x: 2, y: 2}
  ]

  GameOfLife.prototype.createCanvas = function() {
    this.canvas = document.createElement('canvas')
    this.favicon = document.createElement('link')
    this.favicon.rel = 'icon'
    document.getElementsByTagName('head')[0].appendChild(link)
  }

  GameOfLife.prototype.resizeCanvas = function() {
    this.canvas.height = this.cellSize * this.numberOfRows
    this.canvas.width = this.cellSize * this.numberOfCols
  }

  GameOfLife.prototype.createDrawingContext = function() {
    this.drawingContext = this.canvas.getContext('2d')
  }

  /**
   * Seed with default of glider
   */
  GameOfLife.prototype.seed = function() {
    var i, j, rowLen, colLen, row, col, gliderLen

    // Start with all empty
    for(i = row = 0, rowLen = this.numberOfRows; i < rowLen; row = ++i) {
      this.curCellGen[row] = []
      for(j = col = 0, colLen = this.numberOfCols; j < colLen; col = ++j) {
        this.curCellGen[row][col] = this.createCell(false, row, col)
      }
    }

    // Create glider
    for(i = 0, gliderLen = this.glider.length; i < gliderLen; i++) {
      var x, y

      x = this.glider[i].x
      y = this.glider[i].y

      this.curCellGen[x][y] = this.createCell(true, x, y)
    }
  }

  GameOfLife.prototype.createCell = function(alive, x, y) {
    return {
      isAlive: alive,
      row: x,
      col: y
    }
  }

  GameOfLife.prototype.drawGrid = function() {
    var i, j, rowLen, colLen, row, col

    for(i = row = 0, rowLen = this.numberOfRows; i < rowLen; row = ++i) {
      for(j = col = 0, colLen = this.numberOfCols; j < colLen; col = ++j) {
        this.drawCell(this.curCellGen[row][col])
      }
    }

    this.favicon.href = this.canvas.toDataURL('img/png')
  }

  GameOfLife.prototype.drawCell = function(cell) {
    var fillStyle, x, y

    x = cell.col * this.cellSize
    y = cell.row * this.cellSize

    fillStyle = 'rgb(255, 255, 255)'

    if (cell.isAlive)
      fillStyle = 'rgb(0, 0, 0)'

    this.drawingContext.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
    this.drawingContext.fillStyle = fillStyle;

    return this.drawingContext.fillRect(x, y, this.cellSize, this.cellSize);
  }

  GameOfLife.prototype.evolve = function() {
    var newGen, i, j, rowLen, colLen, row, col

    var newGen = [];

    for(i = row = 0, rowLen = this.numberOfRows; i < rowLen; row = ++i) {
      newGen[row] = [];
      for(j = col = 0, colLen = this.numberOfCols; j < colLen; col = ++j) {
        newGen[row][col] = this.evolveCell(row, col)
      }
    }

    this.curCellGen = newGen
  }

  GameOfLife.prototype.evolveCell = function(x, y) {
    var cell, aliveNeighbors, isAlive

    cell = this.curCellGen[x][y]
    isAlive = false
    aliveNeighbors = this.countAliveNeighbors(cell)

    // Cell is alive OR there are three live neighbor cells
    if (cell.isAlive || aliveNeighbors === 3)
      isAlive = (aliveNeighbors > 1 && aliveNeighbors < 4)

    return this.createCell(isAlive, x, y)
  }

  GameOfLife.prototype.countAliveNeighbors = function(cell) {
    var col, lowerCol, lowerRow, count, row, upperCol, upperRow, i, j

    count = 0

    lowerRow = Math.max(cell.row - 1, 0)
    upperRow = Math.min(cell.row + 1, this.numberOfRows - 1)

    lowerCol = Math.max(cell.col - 1, 0)
    upperCol = Math.min(cell.col + 1, this.numberOfCols - 1)

    for (i = row = lowerRow; i <= upperRow; row = ++i) {
      for (j = col = lowerCol; j <= upperCol; col = ++j) {

        console.log(row, col)
        if (row === cell.row && col === cell.col)
          continue

        if (this.curCellGen[row][col].isAlive)
          count++
      }
    }
    return count;
  }

  GameOfLife.prototype.tick = function() {
      var start

      start = new Date().getTime()

      this.drawGrid()

      // if (this.generation > 10) {
      //   this.generation = 0
      //   this.seed()
      // } else {
      //   this.evolve()
      // }

      // this.generation++

      // setTimeout(
      //   this.tick,
      //   this.tickLength - (new Date().getTime() - start)
      // )
  }

  new GameOfLife();
}());
