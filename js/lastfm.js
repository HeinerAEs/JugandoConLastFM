var $input = $('.form-control');
var $btn = $('.btn');

$input.on('keyup', onKeyUp);
$btn.on('click', onSubmit);

function onKeyUp (data) {
	if(data.keyCode == 13) {
		onSubmit();
	}
}
function onSubmit () {
	getArtist($input.val(), fillArtistInfo);
	$
}