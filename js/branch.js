// Branch Class
var Branch = (function(SVG){
  Branch = function(params, position_top, position_left, svg_div, ref_date){
    this.month_gap = 0.00000002 //space between millisecond in px
    this.squareWidth = 100
    this.isMaster = params.master
    this.name = params.branch_name
    this.img = params.branch_img
    this.dates = params.dates
    this.spaceBetweenBranch = 400

    if (this.isMaster){
      this.beginning_position = {
        top: position_top,
        left: position_left
      }
    }else{
      this.ref_date = ref_date
      this.calculateBeginningPosition(position_top, position_left)
    }
    this.svg_div = svg_div

    if (params.dates.length > 0)
      this.date_beginning = new Date(Date.parse(params.dates[0].date))

    this.parseDate()
    return this
  }

  Branch.prototype.calculateBeginningPosition = function(top, left){
    _diff_month = Date.parse(this.dates[0].date) - Date.parse(this.ref_date) //Difference in millisecond
    top += parseInt(_diff_month) * this.month_gap - 200
    this.beginning_position = {
      top: top,
      left: left - this.spaceBetweenBranch
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

  Branch.prototype.drawDate = function(date, index){
    // Draw path from the previous
    // Draw the square when arrive on it
    if (index == 0){
      line_x1 = this.beginning_position.left + this.squareWidth/2
      line_y1 = this.beginning_position.top + this.squareWidth
    }else{
      line_x1 = this.dates[index-1].position.left + this.squareWidth/2
      line_y1 = this.dates[index-1].position.top + this.squareWidth
    }
    line_x2 = date.position.left + this.squareWidth/2
    line_y2 = date.position.top
    console.log(line_x2, 'test', this)
    
    // Create the transition line
    if (index == 0 && this.ref_date){
      tx1 = this.beginning_position.left + this.spaceBetweenBranch + this.squareWidth / 2
      ty1 = this.beginning_position.top + this.squareWidth + 50
      tx2 = this.beginning_position.left + this.squareWidth / 2
      ty2 = this.beginning_position.top + this.squareWidth + 50
      this.svg_div.appendChild(SVG.createLine({attributes: {x1: tx1, y1: ty1, x2: tx2, y2: ty2, stroke: "red"}}))
    }
    
    // Draw Line From previous date to the next date
    this.svg_div.appendChild(SVG.createLine({attributes: {x1: line_x1, y1: line_y1, x2: line_x2, y2: line_y2, stroke: "red"}}))
    // Draw Square for the new date
    this.svg_div.appendChild(SVG.createSquare({attributes : {x: date.position.left, y: date.position.top, width: this.squareWidth, fill: "transparent", stroke: "red"}}))

    // Draw Text for the new date
    this.svg_div.appendChild(SVG.createText({text: date.date, attributes : {x: date.position.left - 100, y: date.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: "red"}}))
    this.svg_div.appendChild(SVG.createText({text: date.content, attributes : {x: date.position.left + 120, y: date.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: "red"}}))
  }

  return Branch
})(SVG)
