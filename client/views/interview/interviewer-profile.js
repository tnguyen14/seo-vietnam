InterviewerProfileController = RouteController.extend({
	template: 'interviewer-profile',
	waitOn: function() {
		return [
			Meteor.subscribe('interviewerData', this.params._id),
			Meteor.subscribe('interviewerApps', this.params._id),
			Meteor.subscribe('interviewerUsers', this.params._id)
		];
	},
	data: function() {
		var interviewerId = (this.params._id) ? this.params._id : Meteor.userId(),
			interviewer = Meteor.users.findOne(interviewerId),
			assginedApps = interviewerAssignedApps(interviewerId),
			apps = apps = Applications.find({_id: {$in: assginedApps}}).fetch();
		if (!interviewer.interviewer) {
			interviewer.interviewer = {};
		}
		Lazy(apps).each(function(a) {
			// applicant whom the app belongs to
			var applicant = Meteor.users.findOne(a.user);
			if (applicant) {
				a.profile = applicant.profile;
				a.emails = applicant.emails;
			}
			a.appURL = Router.routes['interview-app-single'].path({_id: a._id});

			// find app data from the interviewer profile
			var interviewerApp = Lazy(interviewer.interviewer.apps).findWhere({appId: a._id});
			if (interviewerApp) a.interviewStatus = interviewerApp.status;
		});

		// borrow grader location and profession if there is no exists
		if (interviewer.grader) {
			if (!interviewer.interviewer.location && interviewer.grader.location) {
				interviewer.interviewer.location = interviewer.grader.location;
			}
			if (!interviewer.interviewer.profession && interviewer.grader.profession) {
				interviewer.interviewer.profession = interviewer.grader.profession;
			}
		}

		return {
			interviewerId: interviewerId,
			profile: interviewer.profile,
			interviewer: interviewer.interviewer,
			apps: apps,
			locations: [
				{
					"slug": "overseas",
					"name": "Overseas"
				}, {
					"slug": "local",
					"name": "Local"
				}
			],
			profs: [
				{
					"slug": "business",
					"name": "Business"
				}, {
					"slug": "non-business",
					"name": "Non-Business"
				}
			]
		}
	}
});

Template['interviewer-profile'].created = function() {
	Session.set('editing', false);
};

Template['interviewer-profile'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

Template['interviewer-profile'].rendered = function() {
	// form validation
}

Template['interviewer-profile'].events = {
	'click #edit': function(e) {
		e.preventDefault();
		// if currently editing, save the profile
		if (Session.get('editing')) {
			var $form = $('#interviewer-profile'),
				interviewerId = $form.data('interviewerid');
			if (!$form.valid()) {
				return;
			}
			saveUser({
				groups: getFormGroups($form),
				id: interviewerId,
				success: function() {
					Session.set('editing', false);
					notify({
						message: 'Successfully saved profile',
						context: 'success',
						auto: true,
						clearPrev: true
					});
				},
				error: function(err) {
					notify({
						message: err.reason,
						context: 'danger',
						dismissable: true,
						clearPrev: true
					})
				}
			});
		} else {
			Session.set('editing', true);
		}
	}
}