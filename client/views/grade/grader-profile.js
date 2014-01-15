GraderProfileController = RouteController.extend({
	template: 'grader-profile',
	waitOn: function() {
		return [
			Meteor.subscribe('graderData', this.params._id),
			Meteor.subscribe('graderApps', this.params._id),
			Meteor.subscribe('graderUsers', this.params._id)
		];
	},
	data: function() {
		var graderId = (this.params._id) ? this.params._id : Meteor.userId(),
			grader = Meteor.users.findOne(graderId),
			apps = apps = Applications.find({'user': {$nin: [graderId, Meteor.userId()]}}).fetch();
		Lazy(apps).each(function(a) {
			// applicant whom the app belongs to
			var applicant = Meteor.users.findOne(a.user);
			if (applicant) {
				a.profile = applicant.profile;
				a.emails = applicant.emails;
			}
			a.appURL = Router.routes['grade-app-single'].path({_id: a._id});

			// find app data from the grader profile
			var graderApp = Lazy(grader.grader.apps).findWhere({appId: a._id});
			if (graderApp) a.graderStatus = graderApp.status;
		});
		return {
			graderId: graderId,
			profile: grader.profile,
			grader: grader.grader,
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
			],
			exlevels: [
				{
					"slug": "none",
					"name": "No"
				}, {
					"slug": "grading",
					"name": "Grading"
				}, {
					"slug": "full-time",
					"name": "6+ months full-time"
				}, {
					"slug": "either",
					"name": "Either"
				}, {
					"slug": "both",
					"name": "Both"
				}
			]
		}
	}
});

Template['grader-profile'].created = function() {
	Session.set('editing', false);
};

Template['grader-profile'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

Template['grader-profile'].rendered = function() {
	// form validation
}

Template['grader-profile'].events = {
	'click #edit': function(e) {
		e.preventDefault();
		// if currently editing, save the profile
		if (Session.get('editing')) {
			var $form = $('#grader-profile'),
				graderId = $form.data('graderid');
			console.log(graderId);

			if ($form.valid()) {
				saveUser({
					groups: getFormGroups($form),
					id: graderId,
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
			}
		} else {
			Session.set('editing', true);
		}
	}
}