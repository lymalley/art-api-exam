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
/*

const addArt = (art, callback) => {
  const modifiedArt = merge(art, {
    type: 'painting',
    _id: pkGen('painting_', '-', prop('name', art))
  })
  db.put(modifiedArt, callback)
}
*/

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


const getAllPaintings = callback =>
  listAllDocs(
    { include_docs: true, startkey: 'painting_', endkey: 'painting_\ufff0' },
    callback
  )
*/
/*



const deleteBoard = (id, callback) => {
  db.get(id, function(err, board) {
    db.remove(board, callback)
  })
}
//this function is getting the required rev and id by providing only the sku
const getBoard = (id, callback) => db.get(id, callback)

const getAllBoards = callback =>
  listAllDocs(
    { include_docs: true, startkey: 'board_', endkey: 'board_\ufff0' },
    callback
  )


const getLimitBoards = callback =>
  limitDocs(
    { include_docs: true, startkey: 'board_', endkey: '?limit=${Number}' },
    callback
  )

const limitBoards = limit =>
  db
    .allDocs({ include_docs: true, limit })
    .then(response => map(prop('doc'), response.rows))


const listBoards = (limit, paginate) =>
  //paginate === null or boards_14232
  db
    .allDocs(
      paginate
        ? { include_docs: true, limit, start_key: `${paginate}${'\ufff0'}` }
        : { include_docs: true, limit }
    )
    .then(response => map(prop('doc'), response.rows))
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
