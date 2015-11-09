'use strict'
var app = require('express')()

/*
 * pet by id endpoint w/valid responses
 */

app.get('/tags/invalidResponse', function (req, res) {
  res.send({invalid: 'tag'})
})

app.get('/tags/:tagId', function (req, res) {
  res.send([
    {id: 1, name: 'user'},
    {id: 2, name: 'store'}
  ])
})

/**
 * Primary export.
 */

module.exports = app
