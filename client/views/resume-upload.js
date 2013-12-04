Template['resume-upload'].events = {
	'click #resume-submit': function(e) {
		e.preventDefault();
		var $form = $("#resume");
			fileInput = document.getElementById("file-resume"),
			$submit = $("#resume-submit"),
			$label = $submit.siblings(".control-label"),
			ladda = Ladda.create(e.target);

		$form.validate({
			rules: {
				'file-resume': {
					required: true
				}
			}
		});

		if ($form.valid()) {
			ladda.start();
			readFile(fileInput.files[0]);
		}
	}
}