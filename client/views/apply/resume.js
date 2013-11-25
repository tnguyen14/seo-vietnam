Template.resume.events = {
	'click #resume-submit': function(e) {
		e.preventDefault();
		var $form = $("#resume");
			fileInput = document.getElementById("file-resume"),
			$submit = $("#resume-submit"),
			$label = $submit.siblings(".control-label");

		$form.validate({
			rules: {
				'file-resume': {
					required: true
				}
			}
		});

		if ($form.valid()) {
			readFile(fileInput.files[0]);
		}
	},
	'click #app-submit': function(e) {
		// check app ready one more time
		if (appReady()) {
			Meteor.Router.to('/completed');
		} else {
			console.log("Unable to submit application. Your application is still incomplete");
		}
	}
}