require('dotenv').config()
const { merge, map, prop, pathOr, startsWith, split, pop } = require('ramda')
const PouchDB = require('pouchdb-core')
const pkGen = require('./lib/pkGen')

PouchDB.plugin(require('pouchdb-adapter-http'))

const db = new PouchDB(
  `${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)
const addArt = (art, callback) => {
  const modifiedArt = merge(art, {
    type: 'painting',
    _id: pkGen('painting_', '-', prop('name', art))
  })
  db.put(modifiedArt, callback)
}

const getAPainting = (id, callback) => db.get(id, callback)
const updatePainting = (painting, callback) => db.put(painting, callback)
const deletePainting = (id, callback) => {
  db.get(id, function(err, painting) {
    db.remove(painting, callback)
  })
}
/*
function getAllPaintings(artFilter, limit, paginate, callback)  {
  let query = {}
  if (artFilter) {
    const filter = split(':', artFilter)
    const filterField = head(filter)
    const filterValue = last(filter)
    selectorValue[filterField] = Number(filterValue) ? Number(filterValue): filterValue
    query={selector: selectorValue, limit}
  } else if (paginate) {
  const options = paginate
    ? { include_docs: true, limit: limit, startkey: `${paginate}\ufff0` }
    : { include_docs: true, limit: limit }
  db.allDocs(options, function(err, paintings) {
    if (err) {
      callback(err)
      return
    }
    const mappedArt = map(row => row.doc, paintings.rows)
    callback(null, mappedArt)
  })
}
*/

function getAllPaintings(limit, paginate, callback) {
  const options = paginate
    ? { include_docs: true, limit: limit, startkey: `${paginate}\ufff0` }
    : { include_docs: true, limit: limit }
  db.allDocs(options, function(err, paintings) {
    if (err) {
      callback(err)
      return
    }
    callback(null, map(row => row.doc, paintings.rows))
  })
}

module.exports = {
  addArt,
  getAPainting,
  updatePainting,
  deletePainting,
  getAllPaintings
}
