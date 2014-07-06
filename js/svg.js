// SVG Class
SVG = function(element, params,  cb, branch){
  var _this = this
  this.element = document.createElementNS("http://www.w3.org/2000/svg", element);
  if (params.attributes){
    _.forEach(params.attributes, function(value, key){
      if (typeof value == "function"){
        var attrValue = value.call(_this.element)
      }else{
        var attrValue = value
      }
      if (cb){
        cb(attrValue, key, _this.element)
      }else{
        _this.element.setAttribute(key, attrValue)
      }
    })
  }

  this.triggerAfterInsertCallback = function(){}
  if (params.afterCreate){
    this.triggerAfterInsertCallback = function(){
      params.afterCreate.call(this.element)
    }
  }

  return this
}

SVG.createLine = function(params){
  var newSVG = new SVG('line', params)
  return newSVG
}

SVG.createRect = function(params){
  var newSVG = new SVG('rect', params)
  return newSVG
}

SVG.createSquare = function(params){
  params.attributes.height = params.attributes.width
  return SVG.createRect(params)
}


SVG.createPath = function(params){
  var newSVG = new SVG('path', params)
  return newSVG
}

SVG.createText = function(params, branch){
  var newSVG = new SVG('text', params)
  newSVG.element.innerHTML = params.text

  return newSVG
}

SVG.createTextArea = function(params){
  var newSVG = new SVG('foreignObject', params)
  var div = document.createElement("div");
  var style = [] 
  if (params.attributes && params.attributes.width){
    if (typeof params.attributes.width == "function"){
      var divWidth = params.attributes.width()
    }else{
      var divWidth = params.attributes.width
    }
    style.push("width:"+(divWidth - 50))
  }

  if (params.attributes && params.attributes.stroke){
    style.push("color:"+params.attributes.stroke)
  }
  div.setAttribute("style", style.join(";"))
  div.innerHTML = params.html
  newSVG.element.appendChild(div)

  return newSVG
}

SVG.createImage = function(params){
  var newSVG = new SVG('image', params, function(value, key, element){
      if (key == "xlink:href"){
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value)
      }else{
        element.setAttribute(key, value)
      }
  })

  return newSVG
}

SVG.createDefs = function(params){
  var newSVG = new SVG('defs', params)
  return newSVG
}

SVG.createPattern = function(params){
  var newSVG = new SVG('pattern', params)
  return newSVG
}

SVG.createGradient = function(params){
  var newSVG = new SVG('linearGradient', params)
  return newSVG
}


SVG.createStop = function(params){
  var newSVG = new SVG('stop', params)
  return newSVG
}
