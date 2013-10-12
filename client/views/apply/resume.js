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
			filepicker.store(fileInput, {
				location: 'S3'
			},function(InkBlob){
				// successful response
				// {"url":"https://www.filepicker.io/api/file/5TEGc0A4RPWNcvTtxyYs","filename":"ac2af834-a599-4dbd-b4c0-a925b981f206.png","mimetype":"image/png","size":134347,"key":"7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png","isWriteable":false}
				// aws url: http://s3.amazonaws.com/seo-vietnam/7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png
				console.log('Store successful:', JSON.stringify(InkBlob));
				$(fileInput).data('url', InkBlob.url).data('awskey', InkBlob.key);
				saveInputs(function(){
					$submit.removeClass('btn-default btn-primary btn-danger').addClass('btn-success').html("Success!");
					$label.html('Thank you for uploading your resume!');
				});
			}, function(FPError) {
				console.log(FPError.toString());
				$submit.removeClass('btn-default btn-primary btn-success').addClass('btn-danger').html("Failed!");
				$label.html('There has been an error uploading your file (' +  FPError.toString() + '). Please try again.');
			}, function(progress) {
				console.log('Loading: ' + progress + '%');
				$submit.removeClass('btn-default btn-success btn-danger').addClass('btn-primary').html(progress + "%");
				$label.html('Uploading...');
			});
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