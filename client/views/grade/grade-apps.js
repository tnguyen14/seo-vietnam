GradeAppsController = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('graderData'),
			Meteor.subscribe('graderApps'),
			Meteor.subscribe('graderUsers')
		]
	},
	data: function() {
		// does not include the grader's application, if they have any
		var grader = Meteor.user(),
			// apps that are assigned to this grader
			apps = Applications.find({'user': {$ne: Meteor.userId()}}).fetch();
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
			apps: apps
		}
	}
});

Template['grade-apps'].rendered = function() {
	var listOptions = {
		valueNames: [
			'id',
			'name',
			'email',
			'status',
			'app-status',
			'date-created',
			'date-completed',
			'grader-status'
		],
		page: 10,
		searchClass: 'searchApps',
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	this.appList = new List('grade-apps', listOptions);
}

Template['grade-apps'].events = {
	'click .assignedApp .drop a': function(e, template) {
		e.preventDefault();
		if (!hasRole('admin', Meteor.user())) {
			notify({
				message: 'Only an admin can drop app',
				context: 'warning',
				dismissable: true
			});
			return;
		}
		var graderId = $('#grade-apps').data('graderid'),
			$assignedApp = $(e.target).closest('.assignedApp'),
			appId = $assignedApp.data('id');
		$.when(removeAppFromGrader(graderId, appId), removeGraderFromApp(appId, graderId), removeGradeFromApp(appId, graderId)).done(function () {
			notify({
				message: 'Successfully removed grader',
				context: 'success',
				auto: true
			});
			template.appList.remove('id', appId);
		}).fail(function(err) {
			notify({
				message: err.reason,
				context: 'warning',
				dismissable: true
			});
		});
	}
}