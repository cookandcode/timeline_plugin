(function(SVG, Timeline) {
  var branches = [{
    name: "Ecole",
    img: "url/to/img",
    color: "#fff1c2",
    text_color: "white",
    events: [{
      date: "2009-09-01", 
      content: "1ere année à Supinfo"
    },{
      date: "2010-09-01",
      content: "2eme année à Supinfo"
    },{
      date: "2011-09-01",
      content: "3eme année à Supinfo"
    },{
      date: "2012-07-01",
      content: "3ème année à EFFICOM"
    },{
      date: "2012-09-01",
      content: "3ème année à EFFICOM"
    },{
      date: "2012-11-01",
      content: "3ème année à EFFICOM"
    },{
      date: "2013-01-01",
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
        text_color: "white",
        img: "url/to/img",
        side: 'right',
        events: [{
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
        img: "img/logo-lemalesaint.png",
        color: "#6ce5c7",
        text_color: "white",
        events: [{
          date: "2013-01-01", 
          content: "Lancement du Blog"
        }]
      }]
  }]
  
  var div = document.querySelectorAll("[create-timeline]")[0]
  if (!div){
    alert('no div')
  }else{
    MyTimeline = new Timeline(branches, 50, div)
  }

  window.onscroll = function(e){
  }
     

}) (SVG, Timeline);
