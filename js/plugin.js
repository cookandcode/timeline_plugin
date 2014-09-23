(function(SVG, Timeline) {
  var div = document.querySelectorAll("[create-timeline]")[0]
  if (!div){
    alert('no div')
  }else{
    MyTimeline = new Timeline(window.branches, 50, div)
  }
}) (SVG, Timeline);
