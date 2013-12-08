Template.community.rendered = function() {
	$('#community').validate({
		rules: {
			'essay.community': {
				maxWord: 500
			}
		}
	});
}