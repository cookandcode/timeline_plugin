# Dependencies

You only need to include [Lodash](http://lodash.com/) library

# Installation

Include the timeline script + the timeline css
```html
  <link href="path/to/timeline.css" media="all" rel="stylesheet">
  <script src="path/to/timeline.min.js"> </script>

```

# How it work

Add the "create-timeline" attribute on the 'svg' element where the timeline will be build

```html
    <svg create-timeline width="100%" height="100%">
    </svg>
```

Define the timeline branches:

```js
  new Timeline([{
    name: "Branch name",
    color: "#FFF", //branch color
    textColor: "#FFF", //color for date text + event content text
    textBackground: "rgba(0, 0, 0, .3)", // event content background
    events: [{
      date: "2014-09-01", 
      content: "Event content"
    },{
      date: "2015-09-01", 
      content: "Event content 2"
    }]
  }])
```

Branch can have children branch :

```js
  new Timeline( [{
    name: "Branch name",
    color: "#FFF", //branch color
    textColor: "#FFF", //color for the date  + the event content 
    textBackground: "rgba(0, 0, 0, .3)", // event content background
    events: [{
      date: "2014-09-01", 
      content: "Event content"
    },{
      date: "2015-09-01", 
      content: "Event content 2"
    }],
    children: [
      {
        name: "Children branch name",
        color: "#000",
        textColor: "#000",
        textBackground: "rgba(255, 255, 255, 0.3)",
        side: 'right', // build this branch at the right of the parent branch
        events: [{
          date: { 
            start: "2014-07-01", // show the start date + the end date
            end: "2014-09-01"
          },
          content: "Event content 3" 
    }] )
```

# OPTIONS

## name (String)

Define the branch name

## color (String)

Define the branch color

## textColor (String)

Define the color for the date and the event content

## textBackground (String)

Define the background color for the event content

## events (Array of Object)

Contain all the events for the branch.
An event contain this options:

- date (String or Object)

If the date is a string, it only define the start date (the end date is the date of the next event)
If the date is an object, it looks like this:

```js
date: {
  start: "2014-12-01",
  end: "2015-12-01"
}
```

- content (String)

Define the content of the event to show on the timeline. ( It's possible to write HTML too )

## side (String => 'left' or 'right')

Only useful in a children branch.
Define on which side build the children branch related to the parent branch

## children (Array of branch object)

Contain the children branch.





# TODO

- See how reload the timeline when the screen is too small (for the moment, the timeline is re-generated)
- Refacto the code
- Add show date on scroll
- Add the possibility to personalize the timeline easily ! (Attribute in html for example)


# DONE

- Add begin/end possibility on the date (if no end, script suppose the event is during up to the next event)
- Show the image (see pattern svg to set a background in rect element)
- When timeline is generating on small screen, we can't see all the branch
