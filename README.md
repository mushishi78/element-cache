Element Cache
=============

DOM element cache with cached setters and simple dirty checking.

## Installation

```
npm install --save element-cache
```

## Usage

``` JavaScript
var ec = require('element-cache')();

// Set the class and text of the element with id "flash"
ec('flash').set({ class: 'warning', text: 'File missing!' });

// Get the current value, 'warning', without making any DOM requests.
ec('flash').get('class');

// Only sets values that have changed, i.e. only makes single DOM request
// to change the text
ec('flash').set({ class: 'warning', text: 'Username not recognized!' });
```