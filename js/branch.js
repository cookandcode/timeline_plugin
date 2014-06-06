// Branch Class
var Branch = (function(SVG){
  // params = hash
  // position_top = position top of the first square OR branch object which correspond to the parent of this branch
  // position_left = position left of the first square
  // svg_div = DOM element which correspond to the svg element
  Branch = function(params, position_top, position_left, svg_div){
    var _this = this
    this.month_gap = 0.00000002 //space between millisecond in px ~= 55px for a month
    this.squareWidth = 50
    this.beginningSquareWidth = 70
    this.curveSize = 5
    this.lineThickness = 4
    this.spaceBetweenBranch = 400
    this.color = params.color || "black"
    this.heightFirstLine = 200

    // if this branch is a branch child of "position_top" parent
    if (typeof position_top == "object"){
      this.parent = position_top
      this.branchSide = params.side
    }
    this.name = params.name
    this.img = params.img
    this.events = params.events
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

    if (params.events.length > 0)
      this.event_beginning = new Date(Date.parse(params.events[0].date))

    this.parseEvents()

    if (params.children){
      this.children = []
      _.forEach(params.children, function(children){
        _this.children.push(new Branch(children, _this))
      })
    }
    return this
  }

  // Generate Gradient for the (line) transition
  Branch.prototype.getGradient = function(){
    //create Pattern for the img
    _this = this

    if (!this.defDiv){
        this.defDiv = SVG.createDefs({})
        this.svg_div.appendChild(this.defDiv)
    }
    if (!this.gradient){
      var gradient = SVG.createGradient({attributes: {id: "Gradient-"+this.getFirstDate()}})
      if (this.branchSide == "left"){
        var stop1 = SVG.createStop({attributes: {offset: "0%", "stop-color": this.color}})
        var stop2 = SVG.createStop({attributes: {offset: "60%", "stop-color": this.parent.color}})
      }else{
        var stop1 = SVG.createStop({attributes: {offset: "40%", "stop-color": this.parent.color}})
        var stop2 = SVG.createStop({attributes: {offset: "100%", "stop-color": this.color}})
      }
      gradient.appendChild(stop1)
      gradient.appendChild(stop2)
      this.gradient = gradient
      this.defDiv.appendChild(this.gradient)
    }

    return this.gradient

  }


  // Calculate the position of the square with the image of children branch
  Branch.prototype.calculateBeginningPosition = function(){
    var _diff_month = Date.parse(this.getFirstDate()) - Date.parse(this.parent.getFirstDate()) //Difference in millisecond
    var _top = this.parent.beginning_position.top + (parseInt(_diff_month) * this.month_gap) 
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

  // Return the first date for the branch
  Branch.prototype.getFirstDate = function(){
    if (typeof this.events[0].date == "string"){
      return this.events[0].date
    }else{
      return this.events[0].date.start
    }
  }


  // Write the branch name
  Branch.prototype.writeName = function(){
    var topName = this.beginning_position.top - 10
    var branchNameElement = SVG.createText({text: this.name, attributes : {x: 0, y: topName, fill: "transparent", stroke: this.color}})
    this.svg_div.appendChild(branchNameElement)
    var leftName = this.getLeftBeginning() + ((this.beginningSquareWidth + (this.lineThickness * 2) - branchNameElement.offsetWidth) / 2)
    branchNameElement.setAttribute('x', leftName)
  }

  // Get the left position of the beginning square
  // because it can be differente if the squarewidth and the beginningsquarewidth are different
  // Permit to have the beginningsquare center relative to the other square
  Branch.prototype.getLeftBeginning = function(){
    if (this.beginningSquareWidth != this.squareWidth){
      return (this.beginning_position.left - (this.beginningSquareWidth - this.squareWidth)/2)
    }else{
      return this.beginning_position.left
    }
  }


  // Draw the beginning square 
  // Square with the img
  Branch.prototype.drawBeginning = function(){
    //create Pattern for the img
    _this = this
    this.writeName()

    if (!this.defDiv){
      //_.forEach(this.svg_div.children, function(child){
        //if (child.localName == "defs"){
          //_this.defDiv = child
        //}
      //})
      //if (!this.defDiv) {
        this.defDiv = SVG.createDefs({})
        this.svg_div.appendChild(this.defDiv)
      //}
    }
    var image = SVG.createImage({attributes: {x: 0, y: 0, "xlink:href": '', height: this.beginningSquareWidth, width: this.beginningSquareWidth, preserveAspectRatio:"none"}})
    var pattern = SVG.createPattern({attributes: {id: this.getFirstDate(),  width: 100, height: 100}})
    pattern.appendChild(image)
    this.defDiv.appendChild(pattern)
    this.svg_div.appendChild(SVG.createSquare({attributes : {rx: this.curveSize, x: this.getLeftBeginning(), y: this.beginning_position.top, width: this.beginningSquareWidth, "fill": "url(#"+this.getFirstDate()+")", stroke: this.color, "stroke-width": this.lineThickness}}))
  }

  // Parse event to define the position of the event
  // and add date in js format
  Branch.prototype.parseEvents = function(){
    var _this = this
    var _left = this.beginning_position.left
    var _top = parseInt(this.beginning_position.top)
    var _event_before = null
    _.forEach(this.events, function(event){
          if (typeof event.date == "string"){
            event.parsedDate = Date.parse(event.date)
          }else{
            event.parsedDate = Date.parse(event.date.start)
          }
          if (!_event_before)
            _top +=  _this.heightFirstLine
          else{
            _diff_month = event.parsedDate - _event_before.parsedDate //Difference in millisecond
            _top = _event_before.position.top + parseInt(_diff_month) * _this.month_gap
          }
          event.position = {
            top: _top,
            left: _left
          }
          _event_before = event
    })
  }

  // Function to draw the entire branch
  Branch.prototype.drawIt = function(){
    var _this = this
    _.forEach(this.events, function(event, k){
      _this.drawEvent(event)
    })

    if (this.children){
      _.forEach(this.children, function(branch, k){
        branch.drawIt()
      })
    }
  }

  // Update the total height of the branch
  Branch.prototype.updateTotalHeight = function(height){
    if (this.parent)
      this.parent.updateTotalHeight(height)
    else{
      if (!this.totalHeight || parseInt(height) > parseInt(this.totalHeight)){ 
        this.totalHeight = parseInt(height)
      }
    }
  }

  // Total height of a square
  // height + border
  Branch.prototype.fullSquareSize = function(){
    return this.squareWidth + this.lineThickness * 2
  }

  Branch.prototype.drawEvent = function(event){
    var _this = this
    var index = this.events.indexOf(event)
    //
    // Draw path from the previous
    // Draw the square when arrive on it
    if (index == 0){
      // Draw the square with the image
      this.drawBeginning()
      var line_x1 = this.beginning_position.left + this.squareWidth/2
      var line_y1 = this.beginning_position.top + this.beginningSquareWidth
    }else{
      var line_x1 = this.events[index-1].position.left + this.squareWidth/2
      var line_y1 = this.events[index-1].position.top + this.squareWidth
    }
    var line_x2 = event.position.left + this.squareWidth/2
    var line_y2 = event.position.top
    
    // Create the transition line
    // between the master branch and the children branch
    if (index == 0 && this.parent){
      if (this.branchSide == "left"){
        //tx1 = this.beginning_position.left + this.spaceBetweenBranch + this.squareWidth / 2
        //ty1 = this.beginning_position.top + this.squareWidth + 50
        var tx1 = this.beginning_position.left + this.squareWidth / 2
        var ty1 = this.beginning_position.top + this.squareWidth + 50
      }else{
        var tx1 = this.beginning_position.left - this.spaceBetweenBranch + this.squareWidth / 2
        var ty1 = this.beginning_position.top + this.squareWidth + 50
        //tx2 = this.beginning_position.left + this.squareWidth / 2
        //ty2 = this.beginning_position.top + this.squareWidth + 50
      }
      //check if the line is not on event square
      //if it is the case, so the line is move under the square
      _.forEach(this.parent.events, function(event){
        if (ty1 >= event.position.top && ty1 <= event.position.top + _this.squareWidth){
          ty1 = event.position.top + _this.squareWidth + 10
        }
      })
      //this.svg_div.appendChild(SVG.createLine({attributes: {x1: tx1, y1: ty1, x2: tx2, y2: ty2, stroke: "url(#"+this.getGradient().id+")", "stroke-width": "10"}}))
      this.svg_div.appendChild(SVG.createRect({attributes: {x: tx1, y: ty1, width: this.spaceBetweenBranch, height: this.lineThickness, fill: "url(#"+this.getGradient().id+")"}}))
    }
    
    // Draw Line From previous event to the next event
    this.svg_div.appendChild(SVG.createLine({attributes: {x1: line_x1, y1: line_y1, x2: line_x2, y2: line_y2, stroke: this.color, "stroke-width": this.lineThickness},}))
    // Draw Square for the new event
    this.svg_div.appendChild(SVG.createSquare({attributes : {rx: this.curveSize, x: event.position.left, y: event.position.top, width: this.squareWidth, fill: "transparent", stroke: this.color, "stroke-width": this.lineThickness}}))
    //update the total Height of the branch
    this.updateTotalHeight(event.position.top + this.squareWidth)

    // Draw Text for the new event
    if (typeof event.date == "string"){
      var d = new Date(event.parsedDate)
      eventText = d.toDateString()
    }else{
      var start = new Date(event.parsedDate)
      var end = new Date(Date.parse(event.date.end))
      eventText = start.toDateString() + " \n " + end.toDateString()
    }
    var dateTextElement = SVG.createText({text: eventText, attributes : {x: event.position.left - 100, y: event.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: this.color}})
    var contentTextElement = SVG.createText({text: event.content, attributes : {x: event.position.left + 120, y: event.position.top + this.squareWidth/2, width: this.squareWidth, fill: "transparent", stroke: this.color}})
    this.svg_div.appendChild(dateTextElement)
    this.svg_div.appendChild(contentTextElement)
    // Set x and y here
    // in order to center the text and have the same margin
    dateTextElement.setAttribute("x", this.beginning_position.left - dateTextElement.offsetWidth - 20)
    dateTextElement.setAttribute("y", event.position.top + this.squareWidth / 2 + dateTextElement.offsetHeight / 2)
    contentTextElement.setAttribute("x", this.beginning_position.left + this.squareWidth + 20)
    contentTextElement.setAttribute("y", event.position.top + this.squareWidth / 2 + contentTextElement.offsetHeight / 2)
    console.log("height", contentTextElement.offsetHeight)
  }

  return Branch
})(SVG)
