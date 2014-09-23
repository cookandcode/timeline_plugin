window.branches = [{
  name: "School",
  img: "url/to/img",
  color: "#fff1c2",
  textColor: "white",
  textBackground: "rgba(0, 0, 0, 0.5)",
  events: [{
    date: "2009-09-01", 
    content: "First year at Supinfo"
  },{
    date: "2010-09-01", 
    content: "Second year at Supinfo"
  },{
    date: "2011-09-01",
    content: "Third year at Supinfo"
  },{
    date: "2012-07-01",
    content: "4th year at Supinfo"
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
        content: "Intership"
      },{
        date: "2011-07-01",
        content: "Intership (again)"
      }]
    },{
      name: "Le Male Saint",
      side: 'left',
      img: "img/logo-lemalesaint.png",
      color: "#6ce5c7",
      text_color: "white",
      events: [{
        date: "2012-01-01", 
        content: "Blog Launching"
      }]
    }]
}]
