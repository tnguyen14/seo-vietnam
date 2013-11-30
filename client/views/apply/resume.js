Template.resume.events = {
	'click #remove-file': function(e) {
		e.preventDefault();
		Applications.update(currentApp()._id, {$set: {
			'file-resume': {}
		}});
	},
	'click #reupload': function(e) {
		var resumeUpload = Meteor.render(function(){
			return Template['resume-upload']();
		});
		$('.resume-uploaded').append(resumeUpload);
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