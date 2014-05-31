// Branch Class
var Branch = (function(SVG){
  // params = hash
  // position_top = position top of the first square OR branch object which correspond to the parent of this branch
  // position_left = position left of the first square
  // svg_div = DOM element which correspond to the svg element
  Branch = function(params, position_top, position_left, svg_div){
    var _this = this
    this.month_gap = 0.00000002 //space between millisecond in px
    this.squareWidth = 100
    this.spaceBetweenBranch = 400

    // if this branch is a branch child of "position_top" parent
    if (typeof position_top == "object"){
      this.parent = position_top
      this.branchSide = params.side
    }
    this.name = params.name
    this.img = params.img
    this.dates = params.dates
    this.isMaster = !this.parent


    if (this.isMaster){
      this.beginning_position = {
        top: position_top,
        left: position_left
      }
    }else{
      this.calculateBeginningPosition()
    }
    this.svg_div = svg_div || this.parent.svg_div

    if (params.dates.length > 0)
      this.date_beginning = new Date(Date.parse(params.dates[0].date))

    this.parseDate()

    if (params.children){
      this.children = []
      _.forEach(params.children, function(children){
        _this.children.push(new Branch(children, _this))
      })
    }
    return this
  }

  // Calculate the position of the square with the image of children branch
  Branch.prototype.calculateBeginningPosition = function(){
    _diff_month = Date.parse(this.dates[0].date) - Date.parse(this.parent.dates[0].date) //Difference in millisecond
    var _top = this.parent.beginning_position.top + parseInt(_diff_month) * this.month_gap - 200
    var _left = this.parent.beginning_position.left
    //the branch is at the left or at the right of the master branch
    if (this.branchSide == "left"){
      _left = _left - this.spaceBetweenBranch
    }else{
      _left = _left + this.spaceBetweenBranch
    }
    this.beginning_position = {
      top: _top,
      left: _left
    }
  }

  // Square with the img
  Branch.prototype.draw_begining = function(){
      this.svg_div.appendChild(SVG.createSquare({attributes : {x: this.beginning_position.left, y: this.beginning_position.top, width: this.squareWidth, fill: "transparent", stroke: "red"}}))
  }

  Branch.prototype.parseDate = function(){
    var _this = this
    _left = this.beginning_position.left
    _top = parseInt(this.beginning_position.top)
    _date_before = null
    _.forEach(this.dates, function(date){
          date.parsedDate = Date.parse(date.date)
          if (!_date_before)
            _top += 200
          else{
            _diff_month = date.parsedDate - _date_before.parsedDate //Difference in millisecond
            _top += parseInt(_diff_month) * _this.month_gap
          }
          date.position = {
            top: _top,
            left: _left
          }
          _date_before = date
    })
  }

  Branch.prototype.drawIt = function(){
    var _this = this
    _.forEach(this.dates, function(date, k){
      _this.drawDate(date, k)
    })
  }
  Branch.prototype.updateTotalHeight = function(height){
    if (this.parent)
      this.parent.updateTotalHeight(height)
    else{
      if (!this.totalHeight || parseInt(height) > parseInt(this.totalHeight)){ 
        this.totalHeight = parseInt(height)
      }
    }
  }

  Branch.prototype.drawDate = function(date, index){
    // Draw path from the previous
    // Draw the square when arrive on it
    if (index == 0){
      // Draw the square with the image
      this.draw_begining()
      line_x1 = this.beginning_position.left + this.squareWidth/2
      line_y1 = this.beginning_position.top + this.squareWidth
    }else{
      line_x1 = this.dates[index-1].position.left + this.squareWidth/2
      line_y1 = this.dates[index-1].position.top + this.squareWidth
    }
    line_x2 = date.position.left + this.squareWidth/2
    line_y2 = date.position.top
    
    // Create the transition line
    if (index == 0 && this.parent){
      if (this.branchSide == "left"){
        tx1 = this.beginning_position.left + this.spaceBetweenBranch + this.squareWidth / 2
        ty1 = this.beginning_position.top + this.squareWidth + 50
        tx2 = this.beginning_position.left + this.squareWidth / 2
        ty2 = this.beginning_position.top + this.squareWidth + 50
      }else{
        tx1 = this.beginning_position.left - this.spaceBetweenBranch + this.squareWidth / 2
        ty1 = this.beginning_position.top + this.squareWidth + 50
        tx2 = this.beginning_position.left + this.squareWidth / 2
        ty2 = this.beginning_position.top + this.squareWidth + 50
      }
      this.svg_div.appendChild(SVG.createLine({attributes: {x1: tx1, y1: ty1, x2: tx2, y2: ty2, stroke: "red"}}))
    }
    
    // Draw Line From previous date to the next date
    this.svg_div.appendChild(SVG.createLine({attributes: {x1: line_x1, y1: line_y1, x2: line_x2, y2: line_y2, stroke: "red"}}))
    // Draw Square for the new date
    this.svg_div.appendChild(SVG.createSquare({attributes : {x: date.position.left, y: date.position.top, width: this.squareWidth, fill: "transparent", stroke: "red"}}))
    //update the total Height of the branch
    this.updateTotalHeight(date.position.top + this.squareWidth)

    // Draw Text for the new date
    this.svg_div.appendChild(SVG.createText({text: date.date, attributes : {x: date.position.left - 100, y: date.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: "red"}}))
    this.svg_div.appendChild(SVG.createText({text: date.content, attributes : {x: date.position.left + 120, y: date.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: "red"}}))

    if (this.children){
    _.forEach(this.children, function(branch, k){
      branch.drawIt()
    })
    }
  }

  return Branch
})(SVG)
