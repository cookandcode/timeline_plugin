// Timeline Class
var Timeline = (function(Branch){
  var Timeline = function(branch_params, top, left, svg_div){
    var _this = this
    this.theMasterBranch = null
    this.svg_div = svg_div
    this.branches = []
    this.beginningDate = new Date(Date.parse(branch_params[0].events[0].date))
    _.forEach(branch_params, function(branch){
      _top = top
      _left = left
      _branch = new Branch(branch, _top, _left, svg_div, _this.beginningDate)
      _this.branches.push(_branch)
      if (_branch.isMaster) _this.theMasterBranch = _branch

    })

    this.drawTimeline()
    this.svg_div.setAttribute('height', this.getHeight())

    return this
  }

  Timeline.prototype.drawTimeline = function(){
    // Bug with this in timeline
    var _this = this
    var _hereWeAre = 0
    //cloneBranch = _.clone(this.branches)
    // TO continue to create the Timeline 
    _.forEach(this.branches, function(branch, k){
      branch.drawIt()
    })
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
