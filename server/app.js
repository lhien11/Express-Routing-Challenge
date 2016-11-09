// node/express application
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// puts post request body data and store it on req.body
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);

// Our song data
var songs = [
  {
    artist: "Bruce Springsteen",
    title: "Born in the U.S.A.",
    date: "2016-11-08T22:56:25.050"
  }
];

// Routes
app.post('/songs', function(req, res) {
  // req.body is supplied by bodyParser above
  console.log("REQ body: ", req.body);
  var newSong = req.body;

  // created new resource
  if (inputValidator(newSong)){
    newSong.date = new Date().toISOString();
    songs.push(newSong);
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

function inputValidator (song) {
  if (song.artist === '' || song.title === '') {
    console.log('Entry fields are blank.');
    return false;
  } else {
    for (var i = 0; i < songs.length; i++) {

      var newSongTitle = song.title.replace(/\s+/g, '').toLowerCase();
      var newSongArtist = song.artist.replace(/\s+/g, '').toLowerCase();
      var currentSongTitle = songs[i].title.replace(/\s+/g, '').toLowerCase();
      var currentSongArtist = songs[i].artist.replace(/\s+/g, '').toLowerCase();

      if (newSongTitle === currentSongTitle && newSongArtist === currentSongArtist) {
        console.log('That song is already in the database.');
        return false;
      }
    }
  }
  return true;
}

app.get('/songs', function(req, res) {
  console.log('handling get request for songs');
  res.send(songs);
});

// static file routing
app.get('/*', function(req, res) {
  var file = req.params[0] || '/views/index.html';
  console.log(file);

  res.sendFile(path.join(__dirname, './public/', file));
  // /public/views/index.html
});

app.listen(app.get('port'), function() {
  console.log('Server is listening on port ' + app.get('port'));
});
