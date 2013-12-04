Template.resume.events = {
	'click #remove-file': function(e) {
		var app = currentApp();
		if (!app) {
			return;
		}
		e.preventDefault();
		Applications.update(app._id, {$set: {
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