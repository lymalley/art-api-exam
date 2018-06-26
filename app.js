require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const {
  addArt,
  getAPainting,
  updatePainting,
  deletePainting,
  getAllPaintings
} = require('./dal')
const NodeHTTPError = require('node-http-error')
const { propOr, not, isEmpty, join, compose, pathOr } = require('ramda')
//const pkGen = require('./lib/pkGen')
const requiredFieldChecker = require('./lib/required-field-checker')
// {   propEq }
//const createMissingFieldsMsg = require('./lib/create-missing-fields-msg')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

/*
POST /paintings


Use the name field in the creation of the _id value. DO NOT ALLOW the articles "a" or "the" in the beginning of
the name for the primary key value.

DO NOT ALLOW the articles "a" or "the" in the beginning of the name for the primary key value. In the example
below the name of the painting to create is "The Persistence of Memory". When created the painting should have a primary
key value of _id: "painting_persistence_of_memory"

}*/

//POST - Create Painting
app.post('/paintings', (req, res, next) => {
  const newArt = propOr({}, 'body', req)

  if (isEmpty(newArt)) {
    next(new NodeHTTPError(400, 'Painting body is empty!'))
  }

  const missingFields = requiredFieldChecker(
    ['name', 'movement', 'artist', 'yearCreated', 'museum'],
    newArt
  )

  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)

  if (sendMissingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `You didn't pass all the required fields: ${join(', ', missingFields)}`
      )
    )
  }

  addArt(newArt, function(err, result) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
    }
    res.status(201).send(result)
  })
})

/*


	const requiredFields = ['name', 'movement', 'artist', 'yearCreated', 'museum']

	const missingFields = reqFieldChecker(requiredFields, newArt)

	const sendMissingFieldError = compose(
		not,
		isEmpty
	)(missingFields)

	if (sendMissingFieldError) {
		next(
			new NodeHTTPError(
				400,
				`Missing the following required fields: ${join(', ', missingFields)}`
			)
		)
	}

	addPainting(newArt)
		.then(result => res.status(201).send(result))
		.catch(err => next(new NodeHTTPError(err.status, err.message, err)))
})

*/

//GET - Retrieve Painting
app.get('/paintings/:paintingID', function(req, res, next) {
  const paintingID = req.params.paintingID
  getAPainting(paintingID, function(err, painting) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(painting)
  })
})
/*
 The museum key value must contain an object that includes the museum's name and location. Not providing
the most recent _rev value will cause an 409 - conflict error to occur.

*/
//PUT - Update Painting
app.put('/paintings/:paintingID', function(req, res, next) {
  const updatedPainting = propOr({}, 'body', req)
  const paintingID = req.params.paintingID
  if (isEmpty(updatedPainting)) {
    next(new NodeHTTPError(400, `Add Painting to request body!`))
    return
  }
  const missingFields = requiredFieldChecker(
    [
      '_id',
      '_rev',
      'name',
      'movement',
      'artist',
      'yearCreated',
      'type',
      'museum'
    ],
    updatedPainting
  )

  const sendMissingFieldError = compose(
    not,
    isEmpty
  )(missingFields)
  if (sendMissingFieldError) {
    next(
      new NodeHTTPError(
        400,
        `You didn't pass all the required fields: ${join(', ', missingFields)}`
      )
    )
  }
  updatePainting(updatedPainting, function(err, painting) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(painting)
  })
})

//Delete Painting

app.delete('/paintings/:paintingID', function(req, res, next) {
  const paintingID = req.params.paintingID
  deletePainting(paintingID, function(err, painting) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(painting)
  })
})
//List Paintings with Pagination

app.get('/paintings', function(req, res, next) {
  const limit = Number(pathOr(4, ['query', 'limit'], req))
  const paginate = pathOr(null, ['query', 'startkey'], req)
  //const lastItem = pathOr(null, ['query', 'lastItem'], req)
  //  const filterArt = pathOr(null, ['query', 'filter'], req)
  getAllPaintings(limit, paginate, function(err, paintings) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(paintings)
  })
})

app.use((err, req, res, next) => {
  console.log(
    `UH OH! \n\nMETHOD ${req.method} \nPATH ${req.path}\n${JSON.stringify(
      err,
      null,
      2
    )}`
  )
  res.status(err.status || 500).send(err)
})

app.listen(port, () => console.log(`Lauren's Art API Exam!`, port))
