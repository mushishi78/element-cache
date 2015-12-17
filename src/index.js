module.exports = function() {
  var elementCache = {};

  return function(id) {
    return elementCache[id] = elementCache[id] || createElement(id);
  };
};

function createElement(id) {
  var native = document.getElementById(id);
  var valueCache = {};

  return {
    get: function(key) {
      if(!(key in valueCache)) {
        valueCache[key] = native[key] || native.getAttribute(key);
      }
      return valueCache[key];
    },
    set: function(args) {
      for(var key in args) {
        if(valueCache[key] !== args[key]) {
          valueCache[key] = args[key];
          set(native, key, args[key]);
        }
      }
    }
  };
}

function set(element, k, v) {
  if(k === 'text')                       { setText(element, v);           }
  else if(k in element && k !== 'style') { element[k] = v;                }
  else if(v === undefined || v === null) { element.removeAttribute(k, v); }
  else                                   { element.setAttribute(k, v);    }
}

function setText(element, text) {
  element.innerHTML = '';
  element.appendChild(document.createTextNode(text));
}
