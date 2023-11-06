# vidjot_node_express

Project from Brad Traversy Node Express Mongo course

### Install express

```sh
npm install --save express
```

### Install nodemon globally

It watches changes on files so that the server doesn't need to be restarted on every change.

```sh
npm install --g nodemon
```

### Start server

```sh
node app.js
```

or

```sh
node app
```

### Start server with nodemon

```sh
nodemon
```

### Install handlebars

Allows to render templates and pass variables to it.

```sh
npm install express-handlebars--save
```

### Bootstrap

Bootstrap installed by using the cdn scripts on the main.handlebars file.

### Install Mongoose

```sh
npm install --save mongoose
```

### Install Mongoose

Allow us to access req.body.

```sh
npm install body-parser
```

### MongoDB shell

```sh
mongosh # Opens the shell. it's the modern version of the 'mongo' original shell

show dbs

use vidjot-dev

show collections # it should return 'ideas'
```

#### CRUD Operations:

Query Documents in Collection:

```sh
db.ideas.find()

db.ideas.find({title: 'title1'}) # Queries for a document with a title equal to 'title1'
```

Insert Documents in Collection:

```sh
db.ideas.insertOne({title: 'title1', details: 'details1'})

db.ideas.insertMany([
    {title: 'title1', details: 'details1'},
    {title: 'title2', details: 'details2'}
])
```

Update Documents in Collection:

```sh
db.ideas.updateOne({title: 'title1'},
{
    $set: {
        details: 'These are the details updated of the document with title1'
    }
})
```

Delete Documents in Collection:

```sh
db.ideas.deleteOne({title: 'title1'}) # Deletes the first document with title1

db.ideas.deleteMany({title: 'title1'}) # Deletes all documents with title1

db.ideas.deleteMany({}) # Deletes all documents in ideas Collection
```
