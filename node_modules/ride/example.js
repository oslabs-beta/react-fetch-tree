
var ride = require('./')
var fs = require('fs')

ride(fs, 'readFile').before(function(filename) {
  console.log('You are reading ' + filename + ', huh?')
})

fs.readFile('/usr/share/dict/words', 'utf-8', function(err) {
  if (err) {
    console.log('Read error!')
  } else {
    console.log('File read!')
  }
})
