Template.passion.rendered = function() {
	$('#passion').validate({
		rules: {
			'essay.passion': {
				maxWord: 500
			}
		}
	});
}