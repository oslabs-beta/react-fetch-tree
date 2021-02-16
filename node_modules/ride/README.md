
ride
====

Monkey-patch stuff at will!

```javascript
var ride = require('ride')
var fs = require('fs')

ride(fs, 'readFile').before(function(filename) {
    console.log('You are reading ' + filename + ', huh?')
})
```

