(function(SVG, Timeline) {
  var branches = [{
    name: "Ecole",
    img: "url/to/img",
    color: "#fff1c2",
    dates: [{
      date: "2009-09-01", 
      content: "1ere année à Supinfo"
    },{
      date: "2010-09-01",
      content: "2eme année à Supinfo"
    },{
      date: "2011-09-01",
      content: "3eme année à Supinfo"
    },{
      date: "2012-09-01",
      content: "3ème année à EFFICOM"
    },{
      date: "2013-09-01",
      content: "4eme année à EFFICOM"
    },{
      date: "2014-09-01",
      content: "5eme année à EFFICOM"
    }],
    children: [
      {
        name: "Work",
        color: "#addef8",
        img: "url/to/img",
        side: 'right',
        dates: [{
          date: { 
            start: "2010-07-01",
            end: "2010-09-01"
          },
          content: "Stagiaire a la DSI"
        },{
          date: "2011-07-01",
          content: "Stagiaire à la DSI (again)"
        },{
          date: "2012-07-01",
          content: "Stagiaire à ISA (Developpeur C#)"
        },{
          date: "2013-10-01",
          content: "Assistant Chef de projet chez Ma santé Facile"
        }]
      },{
        name: "Le Male Saint",
        side: 'left',
        img: "url/to/img",
        color: "#6ce5c7",
        dates: [{
          date: "2013-01-01", 
          content: "Lancement du Blog"
        }]
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

    MyTimeline = new Timeline(branches, 50, center, div)
    //div.appendChild(SVG.createSquare({attributes : {x:center, y:50, width: square_width, fill: "transparent", stroke: "red"}}))
  }

  window.onscroll = function(e){
  }
     

}) (SVG, Timeline);
