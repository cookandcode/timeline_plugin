// Branch Class
var Branch = (function(SVG){
  // params = hash
  // position_top = position top of the first square OR branch object which correspond to the parent of this branch
  // position_left = position left of the first square
  // svg_div = DOM element which correspond to the svg element
  Branch = function(params, position_top, svg_div){
    var _this = this
    this.month_gap = 0.000000012 //space between millisecond in px ~= 55px for a month
    this.squareWidth = 20
    this.beginningSquareWidth = 40
    this.curveSize = 5
    this.lineThickness = 4
    this.spaceBetweenBranch = 500
    this.color = params.color || "black"
    this.text_color = params.text_color || this.color
    this.heightFirstLine = 200

    // if this branch is a branch child of "position_top" parent
    if (typeof position_top == "object"){
      this.parent = position_top
      this.branchSide = params.side
    }

    this.svg_div = svg_div || this.parent.svg_div
    this.name = params.name
    this.img = params.img
    this.events = params.events
    this.isMaster = !this.parent



    if (params.events.length > 0){
      if (typeof params.events[0].date == "string"){
        var dateToParse = params.events[0].date
      }else{
        var dateToParse = params.events[0].date.start
      }
      this.event_beginning = new Date(Date.parse(dateToParse))
    }

    // Fictif but usefull to define the position of all the event
    // Correspond to the firstDate - the space between the firstSquare with the img and the firstDate / gap between mont in px
    this.beginningDate = this.event_beginning - this.heightFirstLine / this.month_gap 

    
    if (this.isMaster){
      var position_left = (this.svg_div.offsetWidth - this.squareWidth) / 2 
      this.beginning_position = {
        top: position_top,
        left: position_left
      }
    }else{
      // The children beginning position
      // depend of master position
      this.calculateBeginningPosition()
    }


    this.parseEvents()

    if (params.children){
      this.children = []
      _.forEach(params.children, function(children){
        _this.children.push(new Branch(children, _this))
      })
    }
    return this
  }

  Branch.prototype.getDefDiv = function(value){
    var defDiv 
    if (value){
      defDiv = value
    }
    if (this.parent){
      if (value) this.parent.defDiv = defDiv
      return this.parent.defDiv
    }else{
      if (value) this.defDiv = defDiv
      return this.defDiv
    }
  }
  // Generate Gradient for the (line) transition
  Branch.prototype.getGradient = function(){
    //create Pattern for the img
    var _this = this

    if (!this.getDefDiv()){
        this.getDefDiv(SVG.createDefs({}))
        this.svg_div.appendChild(this.getDefDiv().element)
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
      gradient.element.appendChild(stop1.element)
      gradient.element.appendChild(stop2.element)
      this.gradient = gradient
      this.getDefDiv().element.appendChild(this.gradient.element)
    }

    return this.gradient

  }


  // Calculate the position of the square with the image of children branch
  Branch.prototype.calculateBeginningPosition = function(){
    var _diff_month = this.beginningDate - this.parent.beginningDate //Difference in millisecond
    var _top = this.parent.beginning_position.top + (parseInt(_diff_month) * this.month_gap) 
    //the branch is at the left or at the right of the master branch
    if (this.branchSide == "left"){
      var branchLeft = function(){
        return this.parent.beginning_position.left - this.spaceBetweenBranch
      }
    }else{
      var branchLeft = function(){
        return this.parent.beginning_position.left + this.spaceBetweenBranch
      }
    }
    this.beginning_position = {
      top: _top,
      left: branchLeft.bind(this)
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

  // Get the left position of the beginning square
  // because it can be differente if the squarewidth and the beginningsquarewidth are different
  // Permit to have the beginningsquare center relative to the other square
  Branch.prototype.getLeftBeginning = function(){
    if (typeof this.beginning_position.left == "function"){
      var left =  this.beginning_position.left()
    }else{
      var left = this.beginning_position.left
    }
    if (this.beginningSquareWidth != this.squareWidth){
      return (left - (this.beginningSquareWidth - this.squareWidth)/2)
    }else{
      return left
    }
  }

  // Build Name of the branch
  Branch.prototype.buildName = function(){
    var _this = this
    var topName = function(){
      return this.beginning_position.top - 10
    }
    return {
      svgType: 'Text',
      svgData: {
        text: this.name,
        attributes : {
          x: 0,
          y: topName.bind(this),
          fill: "transparent",
          stroke: this.color
        },
        afterCreate: function(){
          var leftName = _this.getLeftBeginning() + ((_this.beginningSquareWidth + (_this.lineThickness * 2) - this.offsetWidth) / 2)
          this.setAttribute('x', leftName)
        }
      }
    }
  }

  // build the beginning square 
  // Square with the img
  Branch.prototype.buildBeginning = function(image){
    var builders = []
    var nameBuilder = this.buildName()
    builders.push(nameBuilder)

    // For the moment, the image are blured
    // Waiting for correction
    if (image){
      var imageBuilder = {
        svgType: 'Image',
        svgData: {
          attributes: {
            x: 0,
            y: 0,
            "xlink:href": this.img,
            height: this.beginningSquareWidth,
            width: this.beginningSquareWidth,
            preserveAspectRatio: "xMinYMin slice"
          }
        }
      }
     
      // Pattern which contain the image
      var patternBuilder = {
        svgType: 'Pattern',
        svgData: {
          attributes: {
            id: this.getFirstDate(),  
            width: 100,
            height: 100
          },
        },
        contain: imageBuilder
      }

      builders.push(patternBuilder)
    }

    var squareBuilder = {
      svgType: 'Square',
      svgData: {
        attributes: {
          rx: this.curveSize,
          x: this.getLeftBeginning.bind(this),
          y: this.beginning_position.top,
          width: this.beginningSquareWidth,
          "fill": (image) ? "url(#"+this.getFirstDate()+")" : this.color,
          stroke: this.color,
          "stroke-width": this.lineThickness
        }
      }
    }
    builders.push(squareBuilder)
    return builders
  }

  Branch.prototype.clearSVG = function(){
    this.svg_div.innerHTML = ""
    delete this.gradient
    delete this.defDiv
    if (this.children){
      _.forEach(this.children, function(children){
        children.clearSVG()
      })
    }
  }
  // Parse event to define the position of the event
  // and add date in js format
  Branch.prototype.parseEvents = function(){
    var _this = this
    var _left = function(){
      if (this.parent){
        return this.beginning_position.left()
      }else{
        return this.beginning_position.left
      }
    }
    var _top = parseInt(this.beginning_position.top)
    var _event_before = null
    _.forEach(this.events, function(event){
          if (typeof event.date == "string"){
            event.parsedDate = Date.parse(event.date)
          }else{
            event.parsedDate = Date.parse(event.date.start)
          }
          _top = function(){
            _diff_month = event.parsedDate - this.beginningDate //Difference in millisecond
            return this.beginning_position.top + parseInt(_diff_month) * this.month_gap
          }
          event.position = {
            top: _top.bind(_this),
            left: _left.bind(_this)
          }
    })
  }

  // Build the branch but no draw it in the dom
  // Needed to calculate the width of timeline
  Branch.prototype.buildIt = function(){
    var _this = this
    this.eventsReadyToBuild = []
    _.forEach(this.events, function(event, k){
      _this.eventsReadyToBuild.push(_this.buildEvent(event))
    })

    if (this.children){
      _.forEach(this.children, function(branch, k){
        _this.eventsReadyToBuild.push(branch.buildIt())
      })
    }


    return this.eventsReadyToBuild
  }

  Branch.prototype.updateMinX = function(x){
    if (this.parent)
      this.parent.updateMinX(x)
    else{
      if (!this.minX  || parseInt(x) < this.minX){ 
        this.minX = parseInt(x)
      }
    }
  }
 
  // Update the maximun Width of the branch
  Branch.prototype.updateMaxWidth = function(rightX, rightWidth){
    if (this.parent)
      this.parent.updateMaxWidth(rightX, rightWidth)
    else{
      var width = parseInt(rightX) + rightWidth
      if (!this.maxWidth || parseInt(width) > parseInt(this.maxWidth)){ 
        this.maxWidth = width
      }
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

  Branch.prototype.drawEvents = function(eventsToDraw, fromParent){
    var _this = this
    eventsToDraw = eventsToDraw || this.eventsReadyToBuild
    var svgElements = []
    if (!eventsToDraw || eventsToDraw.length == 0){
      return false 
    }
    if (Array.isArray(eventsToDraw)){
      _.forEach(eventsToDraw, function(event){
        _this.drawEvents(event)
      })
    }else{
      if (eventsToDraw.svgType){
        svgElement = SVG["create"+eventsToDraw.svgType](eventsToDraw.svgData)
        if (!fromParent){
          _this.svg_div.appendChild(svgElement.element)
          svgElement.triggerAfterInsertCallback()
          if (eventsToDraw.contain){
            this.drawEvents(eventsToDraw.contain, svgElement)
          }
        }else{
         //Insert element into this parent
         fromParent.element.appendChild(svgElement.element) 
         svgElement.triggerAfterInsertCallback()
        }
      }
    }
  }

  // Build the event in order to draw it in SVG
  // @return Array: [
  //                  {
  //                    svgType: "SVGElementType",
  //                    svgData : {
  //                      attributes: {SVGAttributes},
  //                      text: "Text" //Optionnal
  //                    },
  //                    contain: [
  //                        {
  //                          svgType: "SVGElementType",
  //                          attrbibutes: {}
  //                        }
  //                      ], //Optionnal
  //                    }
  //                ]
  Branch.prototype.buildEvent = function(event){
    var _this = this
    var index = this.events.indexOf(event)
    var elementToBuild = []
    //
    // Draw path from the previous
    // Draw the square when arrive on it
    if (index == 0){
      // Draw the square with the image
      elementToBuild.push(this.buildBeginning())
      var line_x1 = function(){
        if (typeof this.beginning_position.left == "function"){
          var left = this.beginning_position.left()
        }else{
          var left = this.beginning_position.left
        }
        return left + this.squareWidth/2
      }
      var line_y1 = function(){
        return this.beginning_position.top + this.beginningSquareWidth
      }
    }else{
      var line_x1 = function(){
        return this.events[index-1].position.left() + this.squareWidth/2
      }
      var line_y1 = function(){
        return this.events[index-1].position.top() + this.squareWidth
      }
    }
    var line_x2 = function(){
      return event.position.left() + this.squareWidth/2
    }
    var line_y2 = function(){
      return event.position.top()
    }
    
    // Create the transition line
    // between the master branch and the children branch
    if (index == 0 && this.parent){
      if (this.branchSide == "left"){
        //tx1 = this.beginning_position.left + this.spaceBetweenBranch + this.squareWidth / 2
        //ty1 = this.beginning_position.top + this.squareWidth + 50
        var tx1 = function(){
          if (typeof this.beginning_position.left == "function"){
            var left = this.beginning_position.left()
          }else{
            var left = this.beginning_position.left
          }
          return left + this.squareWidth / 2
        }
      }else{
        var tx1 = function(){
          if (typeof this.beginning_position.left == "function"){
            var left = this.beginning_position.left()
          }else{
            var left = this.beginning_position.left
          }
          return left - this.spaceBetweenBranch + this.squareWidth / 2
        }
      }

      var ty1 = function(){
        return this.beginning_position.top + this.beginningSquareWidth + this.squareWidth
      }

      // Transition line with gradient
      elementToBuild.push({
          svgType: 'Rect',
          svgData: {
            attributes: {
              x: tx1.bind(this),
              y: ty1.bind(this),
              width: this.spaceBetweenBranch,
              height: this.lineThickness,
              fill: function(){
                return "url(#"+this.getGradient().element.id+")"
              }.bind(this)
            },
            afterCreate: function(){
               // Check if the line is not on a square
               // If it's the case, we move it
              _.forEach(_this.parent.events, function(event){
                var actualY = parseInt(this.getAttribute("y"))
                if (actualY >= event.position.top() && actualY <= event.position.top() + _this.squareWidth){
                  this.setAttribute('y', event.position.top() + _this.squareWidth + _this.squareWidth / 2)
                }
              }.bind(this))
            }
          }
      })
    }
    
    // Draw Line From previous event to the next event
    elementToBuild.push({
        svgType: 'Line',
        svgData: {
          attributes: {
            x1: line_x1.bind(this),
            y1: line_y1.bind(this),
            x2: line_x2.bind(this),
            y2: line_y2.bind(this),
            stroke: this.color,
            "stroke-width": this.lineThickness
          }
        }
    })
    // Draw Square for the new event
    elementToBuild.push({
        svgType: 'Square',
        svgData: {
          attributes : {
            rx: this.curveSize,
            x: event.position.left,
            y: event.position.top,
            width: this.squareWidth,
            fill: "transparent",
            stroke: this.color,
            "stroke-width": this.lineThickness
          },
          afterCreate: function(){
            var y = parseInt(this.getAttribute("y"))
            var heightContent = this.offsetHeight
            _this.updateTotalHeight(y + heightContent)
          }
        }
    })
    //
    //
    // Draw Text for the new event
    if (typeof event.date == "string"){
      var d = new Date(event.parsedDate)
      eventText = d.toDateString()
      elementToBuild.push({
          svgType: 'Text',
          svgData: {
            text: eventText, 
            attributes : {
              width: this.squareWidth,
              fill: "transparent",
              stroke: this.text_color
            },
            afterCreate: function(){
              var x = event.position.left() - this.offsetWidth - 20
              var y = event.position.top() + (_this.squareWidth / 2) + (this.offsetHeight / 2) - _this.lineThickness
              this.setAttribute('x', x)
              this.setAttribute('y', y)
              _this.updateMinX(x)
            }
          }
      })
    }else{
      var start = new Date(event.parsedDate)
      var end = new Date(Date.parse(event.date.end))
      var spaceBetweenText = 10
      elementToBuild.push({
          svgType: 'Text',
          svgData: {
            text: start.toDateString(),
            attributes : {
              width: this.squareWidth,
              fill: "transparent",
              stroke: this.text_color
            },
            afterCreate: function(){
              var x = event.position.left() - this.offsetWidth - 10
              this.setAttribute('x', x)
              this.setAttribute("y", event.position.top() + _this.squareWidth / 2 - spaceBetweenText/2)
              _this.updateMinX(x)
            }
          }
      })
      elementToBuild.push({
          svgType: 'Text',
          svgData: {
            text: end.toDateString(),
            attributes : {
              width: this.squareWidth,
              fill: "transparent",
              stroke: this.text_color
            },
            afterCreate: function(){
              var x = event.position.left() - this.offsetWidth - 10
              this.setAttribute('x', x)
              var dateStartElement = this.previousSibling
              this.setAttribute("y", parseInt(dateStartElement.getAttribute("y")) + dateStartElement.offsetHeight + spaceBetweenText)
              _this.updateMinX(x)
            }
          }
      })
    }

    var xContentText = function(){
      if (typeof this.beginning_position.left == "function"){
        var left = this.beginning_position.left() 
      }else{
        var left = this.beginning_position.left
      }
      return left + this.squareWidth + 20
    }
    var widthContent = function(){
      return this.spaceBetweenBranch / 2 - (xContentText.bind(this)() - event.position.left())  
    }
    //contentTextElement.setAttribute("y", event.position.top + this.squareWidth / 2 - heightContent / 2)
    //var heightContent = contentTextElement.children[0].offsetHeight 
    elementToBuild.push({
        svgType: 'TextArea',
        svgData: {
          html: event.content,
          attributes : {
            x: xContentText.bind(this),
            width: widthContent.bind(this),
            fill: "transparent",
            stroke: this.text_color,
            height: 100
          },
          afterCreate: function(){
            var heightContent = this.children[0].offsetHeight 
            var y =  event.position.top() + _this.squareWidth / 2 - heightContent / 2
            this.setAttribute("y", y)
            _this.updateTotalHeight(y + heightContent)
            _this.updateMaxWidth(this.getAttribute("x"), this.offsetWidth)
         }
        }
    })

    return elementToBuild
  }


  return Branch
})(SVG)
