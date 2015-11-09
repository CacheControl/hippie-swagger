'use strict'

var data = {
  firstFoo: {
    id: 'cfad73a3-d8d1-46a6-97d2-169ae7561aa6',
    description: 'first foo',
    orderNumber: 1
  },
  secondFoo: {
    id: '3d1750e8-f8ef-4f6b-9c9b-b5c44be99d39',
    description: 'second foo',
    orderNumber: 2
  }
}
data.foos = [
  data.firstFoo,
  data.secondFoo
]

module.exports = data
