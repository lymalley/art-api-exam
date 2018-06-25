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
  const limit = Number(pathOr(4, ['query', 'limit', 'filter'], req))
  const paginate = pathOr(null, ['query', 'startkey'], req)
  getAllPaintings(limit, paginate, function(err, paintings) {
    if (err) {
      next(new NodeHTTPError(err.status, err.message, err))
      return
    }
    res.status(200).send(paintings)
  })
})

/*
Step 5 - Add a filter
Create a filter query parameter on the GET /paintings endpoint to provide flexible search capability.

Provide the ability to filter paintings by name, movement, artist and year created.

The filter query parameter may be used in conjunction with limit but not with lastItem.

Paintings may not be filtered and paginated at the same time.

Consider using functional techniques within the dal to filter the documents after they are retrieved from the database.

Example

Filter by movement and limit to five paintings

GET /paintings?filter=movement:surrealism&limit=5
Sample Results

[
  {
      "_id": "painting_guernica",
      "_rev": "1-ccd60fb0ca42d879d048f083b95cfdcb",
      "name": "Guernica",
      "type": "painting",
      "movement": "surrealism",
      "artist": "Pablo Picasso",
      "yearCreated": 1937,
      "museum": {
          "name": "Museo Nacional Centro de Arte Reina Sofía",
          "location": "Madrid"
      }
  }
]
*/

/*
Step 6 - Add filter comparison operators
Enhance the existing filter query parameter on the GET /art/paintings endpoint by adding eq (equals), gt (greater than), gte (greater than equal to) ,lt (less than), lte (less than equal to) comparison operators within your filter.

The filter query parameter may be used in conjunction with limit but not with lastItem.

Paintings may not be filtered and paginated at the same time.

Examples

Filter paintings created after 1930. Limit results to 5 paintings

GET /paintings?filter=yearCreated:gt:1930&limit=5
Sample Results

[
  {
      "_id": "painting_guernica",
      "_rev": "1-ccd60fb0ca42d879d048f083b95cfdcb",
      "name": "Guernica",
      "type": "painting",
      "movement": "surrealism",
      "artist": "Pablo Picasso",
      "yearCreated": 1937,
      "museum": {
          "name": "Museo Nacional Centro de Arte Reina Sofía",
          "location": "Madrid"
      }
  }
]
Filter by artists greater or equal to Pablo Picasso.

GET /paintings?filter=artist:gte:Pablo Picasso
Sample Results

[
  {
      "_id": "painting_guernica",
      "_rev": "1-ccd60fb0ca42d879d048f083b95cfdcb",
      "name": "Guernica",
      "type": "painting",
      "movement": "surrealism",
      "artist": "Pablo Picasso",
      "yearCreated": 1937,
      "museum": {
          "name": "Museo Nacional Centro de Arte Reina Sofía",
          "location": "Madrid"
      }
  },
  {
    "_id": "painting_bal_du_moulin_de_la_galette",
    "name": "Bal du moulin de la Galette",
    "type": "painting",
    "movement": "impressionism",
    "artist": "Pierre-Auguste Renoires",
    "yearCreated": 1876,
    "museum": {"name": "Musée d’Orsay", "location": "Paris"}
  },
  {
    "_id": "painting_starry_night",
    "name": "The Starry Night",
    "type": "painting",
    "movement": "post-impressionism",
    "artist": "Vincent van Gogh",
    "yearCreated": 1889,
    "museum": {"name": "Museum of Modern Art", "location": "New York"}
  }
]
*/

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
