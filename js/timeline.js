// Timeline Class
var Timeline = (function(Branch){
  var Timeline = function(branch_params, top, left, svg_div){
    var _this = this
    this.theMasterBranch = null
    this.svg_div = svg_div
    this.branches = []
    this.beginningDate = new Date(Date.parse(branch_params[0].dates[0].date))
    _.forEach(branch_params, function(branch){
      _top = top
      _left = left
      _branch = new Branch(branch, _top, _left, svg_div, _this.beginningDate)
      _this.branches.push(_branch)
      if (_branch.isMaster) _this.theMasterBranch = _branch

      _branch.draw_begining()
    })
    this.svg_div.setAttribute('height', this.getHeight())


    this.drawTimeline()
    return this
  }

  Timeline.prototype.drawTimeline = function(){
    // Bug with this in timeline
    console.log(this)
    var _this = this
    var _hereWeAre = 0
    //cloneBranch = _.clone(this.branches)
    // TO continue to create the Timeline 
    _.forEach(this.branches, function(branch, k){
      _.forEach(branch.dates, function(date, key){
        branch.drawDate(date, key)
      })
    })
  }

  // Get the height of the Timeline
  Timeline.prototype.getHeight = function(){
    _this = this
    if (!this.total_height){
      this.total_height = 0
      _.forEach(this.branches, function(branch){
        last_date = _.last(branch.dates)
        if (last_date.position.top > _this.total_height) _this.total_height = last_date.position.top
      })
    }
    return this.total_height+"px"
  }

  return Timeline
})(Branch)
