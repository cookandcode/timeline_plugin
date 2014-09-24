// Timeline Class
var Timeline = (function(Branch){
  var Timeline = function(branch_params){
    var _this = this
    var top = 50
    var svg_div = document.querySelectorAll("[create-timeline]")[0]
    if (!svg_div){
      alert('no div with "create-timeline" attribute')
      return
    }
    this.theMasterBranch = null
    this.svg_div = svg_div
    this.branches = []
    this.beginningDate = new Date(Date.parse(branch_params[0].events[0].date))
    _.forEach(branch_params, function(branch){
      _top = top
      _branch = new Branch(branch, _top, svg_div)
      _this.branches.push(_branch)
      if (_branch.isMaster) _this.theMasterBranch = _branch

    })

    this.buildIt()
    this.drawIt()
    this.svg_div.setAttribute('height', this.getHeight())
    this.svg_div.setAttribute('width', this.getWidth())

    return this
  }

  Timeline.prototype.buildIt = function(){
    var _this = this
    var _hereWeAre = 0
    _.forEach(this.branches, function(branch, k){
      branch.buildIt()
    })
  }

  Timeline.prototype.drawIt = function(){
    _.forEach(this.branches, function(branch, k){
      branch.drawEvents()
      if (branch.minX < 0){
        branch.beginning_position.left += -branch.minX + 10
        branch.clearSVG()
        branch.drawEvents()
        
      }
    })
  }

  Timeline.prototype.getWidth = function(){
    var maxWidth = 0
    _.forEach(this.branches, function(branch){
      if (branch.maxWidth > maxWidth) maxWidth = branch.maxWidth
    })

    return maxWidth
  }

  // Get the height of the Timeline
  Timeline.prototype.getHeight = function(){
    var totalHeight = 0
    _.forEach(this.branches, function(branch){
      if (branch.totalHeight > totalHeight) totalHeight = branch.totalHeight + 10
    })
    return totalHeight+"px"
  }

  return Timeline
})(Branch)
