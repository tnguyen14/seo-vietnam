Template.leadership.rendered = function() {
	$('#leadership').validate({
		rules: {
			'essay-leadership': {
				maxWord: 500
			}
		}
	});
}