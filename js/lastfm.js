//GLobals
var LAST_FM_API_KEY = '42f75f939105d2110d6a0daf27db431c';
var LAST_FM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

var $artistInput = $('#artistInput');
var $button = $('#boton');
var $resultOut1 = $('#container1');
var $discos = $('#discos');
var $tracks = $('#tracks');

$artistInput.on('keyup', onKEYUP);
$button.on('click', onSUBMIT);

//AJAX
function getArtistInfo (name, callback) 
{
	$.ajax({
		data: {
			artist: name,
			api_key: LAST_FM_API_KEY,
			format: 'json',
			method: 'artist.getinfo'
		},
		url: LAST_FM_API_URL
	})
	.done(callback);
}
function getArtistAlbums (name, callback) 
{
	$.ajax({
		data: {
			artist: name,
			api_key: LAST_FM_API_KEY,
			format: 'json',
			method: 'artist.gettopalbums'
		},
		url: LAST_FM_API_URL
	})
	.done(callback);
}
function getAlbumTracks (artist, album, callback) 
{
	$.ajax({
		data: {
			artist: artist,
			album: album,
			api_key: LAST_FM_API_KEY,
			format: 'json',
			method: 'album.getinfo'
		},
		url: LAST_FM_API_URL
	})
	.done(callback);
}

//Template
function artistInfoTemplate (artist) 
{
	var html = '';

	html += '<div class="row">' +
				'<div class="col-lg-6">' +
					'<h1 class="bg-danger">Biografía de ' +artist.name+ '</h1>' +
					'<p>' +artist.bio.content+ '</p>' +
					'<div class="col-lg-12 text-right"><button class="btn btn-info" id="getAlbums">Discos</button></div>' +
				'</div>' +
				'<div class="col-lg-6 text-center">' +
					'<figure><img class="img-thumbnail img-responsive" src="' +artist.image[artist.image.length - 1]['#text']+ '" alt="' +artist.name+ '" /></figure>' +
				'</div>';
	html += '</div>';

	return html;
}

function artistListTemplate (albums) 
{
	var html = '';
	var albumLength = albums.topalbums.album.length;

	html += '<div class="row">';
	html += '<h3 class="bg-warning">' +albumLength+ ' Albums de ' +albums.topalbums.album[0].artist.name+ '</h3>';

	for (var i = 0; i < albums.topalbums.album.length; i++) {
		html += '<div class="col-lg-4X">';

		var album = albums.topalbums.album[i];
		html += albumTemplate(album, albumLength);

		html += '</div>';
	};

	html += '</div>';

	return html;
}

function albumTemplate (album, albumLength) 
{
	var html = '';

	
	html += '<figure class="album album-onload" data-album="' +album.name+ '" data-artist="' +album.artist.name+ '">' +
				'<img class="img-rounded img-responsive" src="' +album.image[album.image.length - 1]['#text']+ '" alt="' +album.name+ '">' +
				'<figcaption class="text-danger">' +album.name+ '</figcaption>' +
			'</figure>';			

	return html;
}

function fillArtistInfo (jsonData) 
{
	if(jsonData.error)
	{
		onERROR();
	}
	var html = artistInfoTemplate(jsonData.artist);
	$resultOut1.html(html);

	$('#getAlbums').on('click', function(){
		getArtistAlbums(jsonData.artist.name, fillArtistAlbums);
	});
}

function fillArtistAlbums (jsonData) 
{
	if(jsonData.error)
	{
		onERROR();
	}
	var html = artistListTemplate(jsonData);
	$discos.html(html);

	$('.album').on('click', function(){
		var album = $(this).data('album');
		var artist = $(this).data('artist');
		getAlbumTracks(artist, album, fillAlbumTracks);
	});
}
function fillAlbumTracks (jsonData) 
{
	if(jsonData.error)
	{
		onERROR();
	}
	var html = albumDetailTemplate(jsonData.name);
	$tracks.html = html;
}

function onKEYUP(evt) 
{
  if(evt.keyCode == 13) 
  { // Enter
    onSUBMIT();
  };
}

function onSUBMIT() 
{
  getArtistInfo($artistInput.val(), fillArtistInfo);
  $resultOut1.html( '<p class="loading">cargando...</p>' );
}

function onERROR () 
{
	$resultOut1.html('<p class="loading">ERROR...</p>');
}


