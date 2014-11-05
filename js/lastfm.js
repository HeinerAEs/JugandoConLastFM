//GLobals
var LAST_FM_API_KEY = '42f75f939105d2110d6a0daf27db431c';
var LAST_FM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

var $artistInput = $('#artistInput');
var $button = $('#boton');
var $resultOut1 = $('#container1');
var $discos = $('#discos');

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
function getSimilarArtist (name, callback) 
{
	$.ajax({
		data: {
			artist: name,
			api_key: LAST_FM_API_KEY,
			format: 'json',
			method: 'artist.getSimilar'
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
	console.log(artist);
	html += '<div class="row">';
	html += 	'<div class="col-sm-6">';
	html += 		'<h2 class="bg-danger">' +artist.name+ '</h2>';
	html += 		'<p>' +artist.bio.content+ '</p>';
	html += 		'<p><span class="label label-default">Tags:</span> &nbsp;';
					for (var i = 0; i < artist.tags.tag.length; i++) {
	html += 			'<span class="label label-warning"><a class="tags" href="' +artist.tags.tag[i].url+ '" target="_blank">' +artist.tags.tag[i].name+ '</a></span> ';
					};
	html += 		'</p>';
	html += 		'<div class="col-sm-12 text-right">';
	html +=				'<button class="btn btn-info" id="getAlbums">Discos</button> <button class="btn btn-info" id="getSimilarArtist">Artistas Similares</button>';
	html +=			'</div>';
	html += 	'</div>';
	html += 	'<div class="col-sm-6 text-center">';
	html += 		'<figure><img class="img-thumbnail img-responsive" src="' +artist.image[artist.image.length - 1]['#text']+ '" alt="' +artist.name+ '" /></figure>';
	html += 	'</div>';
	html += '</div>';

	return html;
}

function artistListTemplate (albums) 
{
	var html = '';
	var albumLength = albums.topalbums.album.length;

	html += '<div class="row">';
	html += '<h3 class="bg-warning"><span class="label label-default">' +albumLength+ '</span> Albums de <span class="label label-warning">' +albums.topalbums.album[0].artist.name+ '</span></h3>';

	for (var i = 0; i < albums.topalbums.album.length; i++) {
		html += '<div class="col-xs-6 col-sm-3">';

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

	html += '<figure class="album" data-album="' +album.name+ '" data-artist="' +album.artist.name+ '">' +
				'<img class="img-rounded img-responsive" src="' +album.image[album.image.length - 1]['#text']+ '" alt="' +album.name+ '">' +
				'<figcaption class="text-danger">' +album.name+ '</figcaption>' +
			'</figure>';			

	return html;
}
function artistListSimilars (artist) 
{
	var html = '';
	var similarLength = artist.similarartists.artist.length;

	html += '<div class="row">';
	html += '<h3 class="bg-warning"><span class="label label-default foco">' +similarLength+ '</span> artistas <span class="label label-warning">Similares</span></h3>';

	for (var i = 0; i < artist.similarartists.artist.length; i++) {
		html += '<div class="col-xs-6 col-sm-3">';

		var listArtist = artist.similarartists.artist[i];
		html += artistListSimilarTemplate(listArtist);

		html += '</div>';
	};

	html += '</div>';

	return html;
}
function artistListSimilarTemplate (artist) 
{
	var html = '';
	html += '<figure class="similarArtists" data-artist="' +artist.name+ '">' +
				'<img class="img-rounded img-responsive img-similars" src="' +artist.image[artist.image.length - 1]['#text']+ '" alt="' +artist.name+ '">' +
				'<figcaption class="text-danger">' +artist.name+ '</figcaption>' +
			'</figure>';
	
	return html;
}
function albumTracksTemplate (album) 
{
	var html = '';

	html += '<div class="row">' +
				'<h3 class="bg-warning text-left"><small class="label label-default">Nombre del Disco:</small> <span class="label label-warning">' +album.name+ '<span></h3>' +
				'<div class="col-sm-6">' +
					'<figure><img class="img-thumbnail img-responsive" src="' +album.image[album.image.length - 1]['#text']+ '" alt=""></figure>' +
				'</div>' +
				'<div class="col-sm-6">' +
					'<ol class="list-group">';

	for (var i = 0; i < album.tracks.track.length; i++) {
		var track = album.tracks.track[i];
		html += albumTrackTemplate(track);
	};

	html += '<ol></div>' +
			'</div>';

	return html;
}
function albumTrackTemplate (track) 
{
	var html = '';

	html += '<li>';
	html += '<a href="http://www.youtube.com/results?search_query=' +track.artist.name+ ' ' +track.name+ '" target="_blank">' +track.name+ '</a>';
	html += '</li>';

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

	$('#getSimilarArtist').on('click', function(){
		getSimilarArtist(jsonData.artist.name, fillArtistSimilars);
	})
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
function fillArtistSimilars (jsonData) 
{
	if(jsonData.error)
	{
		onERROR();
	}
	var html = artistListSimilars(jsonData);
	$discos.html(html);

	$('.similarArtists').on('click', function() {
		var artist = $(this).data('artist');
		getArtistInfo(artist, fillArtistInfo);
		$('.foco').focus();
		$discos.html('');
	});
}
function fillAlbumTracks (jsonData) 
{
	if(jsonData.error)
	{
		onERROR();
	}
	var html = albumTracksTemplate(jsonData.album);
	$discos.html(html);
}

function onKEYUP(evt) 
{
	if(evt.keyCode == 13) // Enter
	{ 
		onSUBMIT();
	};
}

function onSUBMIT() 
{
	getArtistInfo($artistInput.val(), fillArtistInfo);
	$discos.html("");
	$resultOut1.html( '<p class="loading">cargando...</p>' );

}

function onERROR () 
{
	$resultOut1.html('<p class="loading">ERROR...</p>');
}


