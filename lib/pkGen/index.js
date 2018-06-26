const { compose, replace, toLower, concat, trim } = require('ramda')

module.exports = (prefix, delimeter, pkValue) =>
  compose(
    replace(/ /g, delimeter),
    concat(prefix),
    trim,
    replace(/^a|^an|^the/g, ''),
    toLower
  )(pkValue)
