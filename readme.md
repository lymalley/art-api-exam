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

## Endpoints

###Create a painting

POST /paintings
Add a painting to the collection by providing a new painting resource in the request body.

Creates a painting. The request body must contain a JSON object that represents the painting being created. The request body must include the name, movement, artist, yearCreated, and museum fields.

Use the name field in the creation of the \_id value. DO NOT ALLOW the articles "a" or "the" in the beginning of the name for the primary key value.

DO NOT ALLOW the articles "a" or "the" in the beginning of the name for the primary key value. In the example below the name of the painting to create is "The Persistence of Memory". When created the painting should have a primary key value of \_id: "painting_persistence_of_memory"

Sample Request

POST /paintings
Sample Request Body JSON Data

{
"name": "The Persistence of Memory",
"movement": "surrealism",
"artist": "Salvador Dali",
"yearCreated": 1931,
"museum": {"name": "Musuem of Modern Art", "location": "New York"}
}
Sample Response

{
"ok": true,
"id": "painting_persistence_of_memory",
"rev": "1-c617189487fbe325d01cb7fc74acf45b"
}

###Retrieve a painting

GET /paintings/:paintingID
Retrieve a single painting, itendified by the :paintingID parameter, from the collection of paintings

Sample Request

GET /paintings/painting_bal_du_moulin_de_la_galette
Sample Response

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

##Update a painting

PUT /paintings/:id
Update the entire painting resource.

409 - conflict error for not using the most up to date rev

Updates a specific painting as identified by the :id path parameter. The request body must contain a JSON object that represents the painting being updated. The request body must include the \_id, \_rev, name, movement, artist, yearCreated, and museum fields. The museum key value must contain an object that includes the museum's name and location. Not providing the most recent \_rev value will cause an 409 - conflict error to occur.

Sample Request

PUT /paintings/painting_bal_du_moulin_de_la_galette
Sample Request Body JSON Data

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
Sample Response

{
"ok": true,
"id": "painting_bal_du_moulin_de_la_galette",
"rev": "2-7e9b8cac710e70bfe0bef2de7bb3cfdb"
}

##Delete a painting

DELETE /paintings/:paintingID
Delete a specific painting that is identified by the :paintingID parameter.

Sample Request

DELETE /paintings/painting_bal_du_moulin_de_la_galette
Sample Response

{
"ok": true,
"id": "painting_bal_du_moulin_de_la_galette",
"rev": "3-fdd7fcbc62477372240862772d91c88f"
}

##List paintings with pagination

GET /paintings

Returns a collection of paintings sorted by name. An optional limit query parameter provides a limit on the number of objects returned. Default limit value is 5. When used in conjunction with limit, an optional lastItem query parameter provides the ability to return the next page of paintings.

Examples

GET /paintings?limit=2 returns an JSON array of 2 paintings.

Sample Response

[
{
"_id": "painting_bal_du_moulin_de_la_galette",
"_rev": "5-2bac91fbd33b6612e4ea7da0552c91ca",
"name": "Bal du moulin de la Galette",
"type": "painting",
"movement": "impressionism",
"artist": "Pierre-Auguste Renoires",
"yearCreated": 1876,
"museum": {
"name": "Musée d’Orsay",
"location": "Paris"
}
},
{
"_id": "painting_guernica",
"_rev": "5-a8b803395d7cb6154f63c627571a5575",
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
GET /paintings?limit=2&lastItem=painting_guernica to get the next page of results:

Sample Response

[
{
"_id": "painting_last_supper",
"_rev": "3-418af3c02f63725a2bd7941afe0cc3c6",
"name": "The Last Supper",
"type": "painting",
"movement": "Renaissance",
"artist": "Leonardo da Vinci",
"yearCreated": 1495,
"museum": {
"name": "Santa Maria delle Grazie",
"location": "Milan"
}
},
{
"_id": "painting_starry_night",
"_rev": "3-5e8b713e1644779ebbb29c539166bd81",
"name": "The Starry Night",
"type": "painting",
"movement": "post-impressionism",
"artist": "Vincent van Gogh",
"yearCreated": 1889,
"museum": {
"name": "Museum of Modern Art",
"location": "New York"
}
}
]
