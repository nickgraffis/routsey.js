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
