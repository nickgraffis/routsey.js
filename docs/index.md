## Templating
### The ``` render() ``` funciton
The render function expects one parameter; an html template to render. It also accepts an optional data parameter in the form of an object. 

## Inside your index.html file
Your index.html file should have a ``` <div id="application"> ``` tag. Inside of this tag is where all files will be rendered.

## Inside your template html files
Every html file that you want rendered needs to be surrounded by a ``` <template> ``` tag. 
Once inside of your template file you have the option to perform a few templating tasks:
* You can use the mustache 👨🏻 syntax to include the data you passed into your template like so, ```{{data.user.name}}```
  * Do this without spaces between the curly braces. 
  * It is okay to include data in the format you would expect in any javascript file. Weather that be bracket or dot notation.
* You can include other templates with the attribute ``` data-include="templates/navigationbar"```
  * You don't need to include .html here, but your file must be a .html file
  * The template will be rendered inside of the element that the data-include attribute is a part of.
  * You may also pass data along to this template in the form of an object like so, ```data-include="templates/navigatonbar+{brand: 'Routsey.js'}" ```
* You can include several other templates with the attribute ```data-for="components/link+{links: ['hello', 'goodbye']}"```
  * You don't need to include .html here, but, again, your file must be of type .html.
  * The template with render inside of the element that the data-for attribute is a part of. And the next iteration of the template will occur directly below.
  * You must include data in this attribute to tell routsey how many times you would like an itteration. It will create an element for each key of data inside your object. If those keys include objects or arrays, you can then use the data inside the key's object or array in your next template. You can also use another data-for element inside of your next template.
  * With data-for it is concievable that there will be larger amounts of data being passed through. For example:
  ```
  <nav class="navbar"></navbar>
  ```
  * We want to include several links inside this navbar and load not only the title of the link, but the color and href of the link. For this we may want to pull the data out of our attribute and into a script below the template, that will not be rendered.
  ``` 
  <nav class="navbar" data-for="components/links+script:links"></navbar>
  <script-ommit>
    var links = {
      linksData: [{
        name: 'about',
        href: '/about',
        color: 'purple'
      }, {
        name: 'products',
        href: '/products',
        color: 'red'
      }, {
        name: 'contact',
        href: '/contact',
        color: 'green'
      }]
    }
  </script-ommit>
  ```
  * This allows you to clean up what would be a very complicated inline piece of data. In this example the following template would be used in components/links.html:
  ```
  <template>
    <a class="navbar-item is-{{color}}" href={{href}}>{{name}}</a>
  </template>
  ```
