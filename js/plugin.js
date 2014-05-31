(function(SVG, Timeline) {
  var data = [{
    branch_name: "Ecole",
    banch_img: "url/to/img",
    master: true,
    dates: [{
      date: "2012-09-01", 
      content: "1ere année à Supinfo"
    },{
      date: "2013-09-01",
      content: "2eme année à Supinfo"
    },{
      date: "2014-09-01",
      content: "3eme année à Supinfo"
    }]
  },{
    branch_name: "Work",
    branch_from: "Ecole",
    branch_img: "url/to/img",
    side: 'right',
    dates: [{
      date: "2013-07-01", 
      content: "1ere année au Boulot"
    }]
  },{
    branch_name: "Le Male Saint",
    branch_from: "Ecole",
    side: 'left',
    branch_img: "url/to/img",
    dates: [{
      date: "2013-01-01", 
      content: "Lancement du Blog"
    }]
  }]
  
  var div = document.querySelectorAll("[create-timeline]")[0]
  if (!div){
    alert('no div')
  }else{
    svg_width = div.width.baseVal.value
    square_width = 100
    month_height = 200
    center = (svg_width - square_width)/ 2 //100 == width of carre

    MyTimeline = new Timeline(data, 50, center, div)
    //div.appendChild(SVG.createSquare({attributes : {x:center, y:50, width: square_width, fill: "transparent", stroke: "red"}}))
  }

  window.onscroll = function(e){
  }
     

}) (SVG, Timeline);
