// SVG Class
SVG = function(element){
  return document.createElementNS("http://www.w3.org/2000/svg", element);
}

SVG.createLine = function(params){
  element = new SVG('line')
  if (params.attributes){
    _.forEach(params.attributes, function(value, key){
      element.setAttribute(key, value)
    })
  }
  return element
}

SVG.createRect = function(params){

  element = new SVG('rect')
  if (params.attributes){
    _.forEach(params.attributes, function(value, key){
      element.setAttribute(key, value)
    })
  }
  return element
}

SVG.createSquare = function(params){
  params.attributes.height = params.attributes.width
  return SVG.createRect(params)
}


SVG.createPath = function(params){
  element = new SVG('path')
  if (params.attributes){
    _.forEach(params.attributes, function(value, key){
      element.setAttribute(key, value)
    })
  }

  return element
}

SVG.createText = function(params){
  element = new SVG('text')
  if (params.attributes){
    _.forEach(params.attributes, function(value, key){
      element.setAttribute(key, value)
    })
  }

  element.innerHTML = params.text

  return element
}
