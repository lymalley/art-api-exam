require('dotenv').config()
const { merge, map, prop, pathOr } = require('ramda')
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
function getAllPaintings(limit, paginate, callback) {
  const options = paginate
    ? { include_docs: true, limit: limit, startkey: `${paginate}\ufff0` }
    : { include_docs: true, limit: limit }
  db.allDocs(options, function(err, paintings) {
    if (err) {
      callback(err)
      return
    }
    const allPaintings = map(row => row.doc, paintings.rows)
    callback(null, allPaintings)
  })
}
/*


*/
const listAllDocs = (id, callback) =>
  db.allDocs(id, function(err, paintings) {
    if (err) callback(err)
    callback(null, map(row => row.doc, paintings.rows))
  })

module.exports = {
  addArt,
  getAPainting,
  updatePainting,
  deletePainting,
  getAllPaintings
}
