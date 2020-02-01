const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

let databaseFile = path.join(__dirname, '/db/db.json');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', function (req, res) {
    res.json(db);
});

app.post('/api/notes', function (req, res) {
    let newNote = req.body;
    let id = 99;

    for (let i = 0; i < db.length; i++) {
        let note = db[i];

        if (note.id > id) {
            id = note.id;
        }
    }

    newNote.id = id + 1;
    db.push(newNote)
    fs.writeFile(databaseFile, JSON.stringify(db), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Note Saved");
    });
    res.json(newNote);

});

app.delete('/api/notes/:id', function (req, res) {
    let databaseFile = path.join(__dirname, '/db/db.json')
    for (let i = 0; i < db.length; i++) {

        if (db[i].id == req.params.id) {
            db.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(databaseFile, JSON.stringify(db), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Note deleted");
        }
    });
    res.json(db);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});