Create developer on-boarding instructions by creating a README.md file. Include the following sections:

# LAURENS ART API

This section, intended for software developers using CouchDB, provides instructions for running my api to manage paintings, lauren-api-exam.

## Getting Started

First, you will need to fork my repo:

```
https://github.com/lymalley/art-api-exam.git
```

Next, you will want to clone the forked repo locally, move into the repo and install the dependencies. This can be done with the following steps:

```
$: git clone https://github.com/lymalley/art-api-exam.git
$: cd art-api-exam
$: npm install
$: atom .
```

## Establishing Environment Variables

You'll need to create a local **.env** file to store secret information about the application. You will want to Create a `PORT` environmental variable and set it to a value of an unused port number on your machine. The secret .env file and PORT can be created with:

```
$ echo "PORT=5000" > .env
```

Then within the .env file you will want to create a host environmental variables, COUCH_HOSTNAME and the COUCH_DBNAME. You are going to want to assign the COUCH_HOSTNAME value with your own CouchDB information and project information. For example:

```
COUCH_HOSTNAME=https://<CouchDB User Name>:<password>@your base URL/
COUCH_DBNAME=<yourname>art
```

## Load Data

To load data to your CouchDB, run the following command:

```
$: node load-data.js
```

## Start the API

Now that you have completed all the necessary steps, you can now give the command to start the API:

```
$: npm start
```

## ENDPOINTS

POST,

## Create A Painting

POST /paintings

Add a painting to the collection by providing a new painting resource in the request body.

The painting being created must have a request body that contains a JSON object that includes the name, movement, artist, yearCreated, and museum fields.

Use the name field in the creation of the \_id value.

Example POST Body

```
{
"name": "The Persistence of Memory",
"movement": "surrealism",
"artist": "Salvador Dali",
"yearCreated": 1931,
"museum": {"name": "Musuem of Modern Art", "location": "New York"}
}
```

Example Response:

```
{
"ok": true,
"id": "painting_persistence_of_memory",
"rev": "1-c617189487fbe325d01cb7fc74acf45b"
}
```

## Retrieve A Painting

GET /paintings/:paintingID

Retrieve a single painting, identified by the :paintingID parameter, from the collection of paintings

Example Request

```
/paintings/painting_bal_du_moulin_de_la_galette
```

Example Response

```
{
"\_id": "painting_bal_du_moulin_de_la_galette",
"\_rev": "1-c617189487fbe325d01cb7fc74acf45b",
"name": "Bal du moulin de la Galette",
"type": "painting",
"movement": "impressionism",
"artist": "Pierre-Auguste Renoires",
"yearCreated": 1876,
"museum": {"name": "Musée d’Orsay", "location": "Paris"}
}
```

## Update A Painting

PUT /paintings/:paintingID

Update the entire painting resource identified by the specific paint. The request body must include the \_id, \_rev, name, movement, artist, yearCreated, and museum fields.

409 - conflict error for not using the most up to date rev

Example Request

```
/paintings/painting_bal_du_moulin_de_la_galette
```

Example Request Body

```
{
"\_id": "painting_bal_du_moulin_de_la_galette",
"\_rev": "1-c617189487fbe325d01cb7fc74acf45b",
"name": "Bal du moulin de la Galette",
"type": "painting",
"movement": "impressionism",
"artist": "Pierre-Auguste Renoires",
"yearCreated": 1877,
"museum": {"name": "Musée d’Orsay", "location": "Paris"}
}
```

Example Response

```
{
"ok": true,
"id": "painting_bal_du_moulin_de_la_galette",
"rev": "2-7e9b8cac710e70bfe0bef2de7bb3cfdb"
}
```

##Delete a painting
DELETE /paintings/:paintingID
Delete a specific painting that is identified by the :paintingID parameter.

Example Request

```
DELETE /paintings/painting_bal_du_moulin_de_la_galette
```

Example Response

```
{
"ok": true,
"id": "painting_bal_du_moulin_de_la_galette",
"rev": "3-fdd7fcbc62477372240862772d91c88f"
}
```

##List paintings with pagination
GET /paintings

Returns a collection of paintings sorted by name. An optional limit query parameter provides a limit on the number of objects returned.
