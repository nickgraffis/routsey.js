(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/* Helper Functions */
/* Parse the mustache syntax to achieve the varibale in question*/
function parseMustache(html) {
  var splitAtFirstMustache = html.split('{{');
  var splitAtSecondMustache = splitAtFirstMustache[1].split('}}'); //These two lines get us just the item name
  var parameter = splitAtSecondMustache[0];

  return parameter;
}

/* 
* Create a Virtual DOM from text parsed from getFile function
* Add a '?v=' to the file in question to make sure the freshest file is loaded with the browser. 
* Maybe remove random versioning in production mode?
 */
function createVirtualDOM(template) {
  var parser = new DOMParser();
  var virtualDOM = parser.parseFromString(getFile(template + '?v=' + Math.random()), 'text/html');
  if (virtualDOM.getElementsByTagName('template').length === 1) {
    return virtualDOM;
  }
  else {
    throw 'You must have at least one template tag in your file! You cannot have two templates inside one file!';
  }
}

/* Get a file from directory and return it as a string*/
function getFile(file) {
  var x = new XMLHttpRequest();
  x.open('GET', file, false);
  x.send();
  return x.responseText;
}

/* Obtain the data from a data-include or data-for attribute*/
function attributeData(attribute) {
  if (attribute.includes('+')) {
    var attributeAndData = attribute.split('+');
    return attributeAndData[1];
  }
  else {
    return null;
  }
}

/* Obtain the template file or text from a data-include or dat-for attribute*/
function attributeTemplate(attribute) {
  if (attribute.includes('+')) {
    var attributeAndData = attribute.split('+');
    return attributeAndData[0];
  }
  else {
    return attribute;
  }
}

/* Obtain the template file or text from a data-include or dat-for attribute*/
function examineElements(elements, data) {
  var renderedTemplate = [];
  var parser = new DOMParser();
  var virtualDOM = parser.parseFromString(elements[2].innerHTML, 'text/html');
  var elements = virtualDOM.getElementsByTagName('*');
  var elementsArray = elements[0].innerHTML.split('\n');
  var data = data;

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].hasAttribute('data-include')) { //Check if it has data-include, then we need to include something
      var includedTemplate = attributeTemplate(elements[i].dataset.include);
      var includedData = eval("(" + attributeData(elements[i].dataset.include) + ")");
      elements[i].innerHTML += createFromTemplate(includedTemplate, includedData);
    }
    if (elements[i].hasAttribute('data-for')) {
      var forTemplate = attributeTemplate(elements[i].dataset.for);
      if (attributeData(elements[i].dataset.for).includes('script'))
      {
        var forScript = virtualDOM.body.getElementsByTagName('script-ommit')[0].innerHTML;
        var scriptKey = attributeData(elements[i].dataset.for).split(':');
        var forData = eval("(" + forScript.split(scriptKey[1] + ' = ')[1] + ")");
        var firstKey = Object.keys(forData)[0];
        for (var j = 0; j < eval('forData.' + firstKey).length; j++) {
          var createDataObject = {};
          for (var k = 0; k < Object.keys(forData).length; k++) {
            createDataObject[Object.keys(forData)[k]] = Object.values(forData)[k][j];
          }
          elements[i].innerHTML += createFromTemplate(forTemplate, createDataObject);
        }
      }
      else {
        var forData = eval("(" + attributeData(elements[i].dataset.for) + ")");
        var key = Object.keys(forData)[0];
        for (var j = 0; j < eval('forData.' + key).length; j++) {
          elements[i].innerHTML += createFromTemplate(forTemplate, eval("(" + "{" + key + ": forData." + key + "[" + j + "]}" + ")"));
        }
      }
    }
    if (elements[i].innerHTML.includes('{{')) {
      var parameter = parseMustache(elements[i].innerHTML);
      elements[i].innerHTML = elements[i].innerHTML.replace('{{' + parameter + '}}', eval('data.' + parameter));
    }
  } 
  if (virtualDOM.body.innerHTML.includes('<script-ommit>')) {
    var scriptOmmits = virtualDOM.body.getElementsByTagName('script-ommit');
    for (var s = 0; s < scriptOmmits.length; s++) {
      virtualDOM.body.innerHTML = virtualDOM.body.innerHTML.replace(virtualDOM.body.getElementsByTagName('script-ommit')[s].innerHTML, '');
    }
  }
  renderedTemplate.push(virtualDOM);
  return virtualDOM.body.innerHTML;
}

/* Create html element from a text string*/
function createFromText(text, data) {
  var parser = new DOMParser();
  var virtualDOM = parser.parseFromString(text, 'text/html');

  return examineElements(virtualDOM.all, data);
}

/* Create html element from a file*/
function createFromTemplate(template, data) {
  var virtualDOM = createVirtualDOM(template);

  return examineElements(virtualDOM.all, data);
}

/* Determine if there is text presented, or if there is a file and render html content inside application div*/
function render(template, data) { 
  var textOrFile = template.split('.');
  if (textOrFile.length === 2) {
    document.getElementById('application').innerHTML = createFromTemplate(template, data); 
  }
  else {
    document.getElementById('application').innerHTML = createFromText(template, data); 
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
};

class Router {
  constructor(options) {
    _defineProperty(this, "routes", []);

    _defineProperty(this, "root", "/");

    _defineProperty(this, "add", (path, cb) => {
      this.routes.push({
        path,
        cb
      });
      return this;
    });

    _defineProperty(this, "remove", (path) => {
      for (let i = 0; i < this.routes.length; i += 1) {
        if (this.routes[i].path === path) {
          this.routes.slice(i, 1);
          return this;
        }
      }

      return this;
    });

    _defineProperty(this, "flush", () => {
      this.routes = [];
      return this;
    });

    _defineProperty(this, "clearSlashes", (path) =>
      path.toString().replace(/\/$/, "").replace(/^\//, "")
    );

    _defineProperty(this, "getFragment", () => {
      let fragment = "";

      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : "";
      
      return this.clearSlashes(fragment);
    });

    _defineProperty(this, "navigate", (path = "") => {
      window.location.href = `${window.location.href.replace(
        /#(.*)$/,
        ""
      )}#${path}`;

      return this;
    });

    _defineProperty(this, "listen", () => {
      clearInterval(this.interval);
      this.interval = setInterval(this.interval, 50);
    });

    _defineProperty(this, "interval", () => {
      if (this.current === this.getFragment()) return;
      this.current = this.getFragment();
      this.routes.some((route) => {
        const match = this.current.match(route.path);
        if (match) {
          match.shift();
          route.cb.apply({}, match);
          return match;
        }
        return false;
      });
    });
    if (options.root) this.root = options.root;
    this.listen();
  }
}

const router = new Router({
  root: "/"
});

var about = function () { console.log('About Me!'); }

router.add('/about/', about);

},{}]},{},[1]);
