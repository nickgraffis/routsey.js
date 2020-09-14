# routsey.js
Simple JS router

## Useage
Step 1 - Initalize Router and include the root location: 
``` 
const router = new Router({
  root: "/"
});

```
Step 2 - Add routes and pass along the location of the route, and a function that the route will perform:

You can do this inline:
```
router.add('/about/', function () {
    alert('About Me!');
  })
```
You can also pass a function variable: 
```
var about = function () { console.log('About Me!'); }

.add('/about/', about)
```
You can also pass along URL parameters: 
```
.add(/products\/(.*)\/specification\/(.*)/, function (id, specification) {
    console.log(id);
  })
```
You can also tell it to render HTML:
```
var search = function () { render('templates/search.html'); }
  .add(/search/, search)
```
Or use text:
```
var search = function () { render(<div>This is the search page!</div>'); }
  .add(/search/, search)
  ```
## Templates and Rendering
Firstly the render function will only render what is found in the <div> with an id of "application" inside your root html file. 
When using the render function, you can pass two parameters.
1 - The file or text that you would like rendered
2 - Data to be passed through in the form of an {object}
  
If you are passing data, you can recreate the parameter with the mustache syntax WITHOUT spaces before or after.
```
render('<div><p>Hello, {{user}}</p></div>', {user: 'Nick'});
```
You can also use two options for rendering templates inside other templates:
The data-include attribute will accept two parameters seperated without spaces and a + sign:
```
<div class="hero" data-include="templates/greeting+{greeting: 'Hello World!'}"></div>
```
This will render templates/greeting.html inside of the div with a class of hero. It passes along to greetings.html the variable {{greeting}}.
The data-for will attribute will accept two parameters seperated without spaces and a + sign.
As this is a for function, it is expecting an array of data to be passed:
```
<div class="list" data-for="templates/list-item+{items: ['Wash clothes', 'Do dishes', 'Clean bathroom']}"></div>

/* Inside list-item.html */
<li>{{items}}</li>
```
This will result in:
```
<div class="list" data-for="tempaltes/list-item+{items: ['Wash clothes', 'Do dishes', 'Clean bathroom']}">
  <li>Wash clothes</li>
  <li>Do dishes</li>
  <li>Clean bathroom</li>
</div>
```
This might become cumbersome to pass along data inline like this. You can also pass data from the render function into the first template and then straigth through to the next. 
```
var about = function () { render('hadena.html', {data: {author: 'Nick Graffis'}}); }
<div class="hero-foot" data-include="templates/footer+{author: '{{data.author}}'}"></div>
<template>
	<div class="content has-text-centered"><p><strong>派手な HADENA</strong> by <a href="https://twitter.com/nickgraffistwit">{{author}}</a>. Learn about the project<a href="/code"> here</a>.</p></div>
</template>

```
You can also use `<script-ommit></script-ommit>` tag inside a template and then reference that in yoru data-includ or data-for:
```
```
