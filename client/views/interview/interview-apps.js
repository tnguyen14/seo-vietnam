InterviewAppsController = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('interviewerData'),
			Meteor.subscribe('interviewerApps'),
			Meteor.subscribe('interviewerUsers')
		];
	},
	data: function() {
		// does not include the grader's application, if they have any
		var interviewer = Meteor.user(),
			assignedApps = interviewerAssignedApps(interviewer._id);
			// apps that are assigned to this grader
			apps = Applications.find({_id: {$in: assignedApps}}).fetch();
		Lazy(apps).each(function(a) {
			// applicant whom the app belongs to
			var applicant = Meteor.users.findOne(a.user);
			if (applicant) {
				a.profile = applicant.profile;
				a.emails = applicant.emails;
			}
			a.appURL = Router.routes['interview-app-single'].path({_id: a._id});

			// find app status from the interviewer profile
			var interviewerApp = Lazy(interviewer.interviewer.apps).findWhere({appId: a._id});
			if (interviewerApp) a.interviewerStatus = interviewerApp.status;
		});
		return {
			apps: apps
		}
	}
});

Template['interview-apps'].rendered = function() {
	var listOptions = {
		valueNames: [
			'id',
			'name',
			'email',
			'status',
			'app-status',
			'date-created',
			'date-completed',
			'interviewer-status'
		],
		page: 10,
		searchClass: 'searchApps',
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	this.appList = new List('interview-apps', listOptions);
}

Template['interview-apps'].events = {
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
		var interviewerId = $('#grade-apps').data('graderid'),
			$assignedApp = $(e.target).closest('.assignedApp'),
			appId = $assignedApp.data('id');
		Q.all([
			removeAppFromInterviewer(interviewerId, appId),
			removeInterviewerFromApp(appId, interviewerId),
			removeInterviewFromApp(appId, interviewerId)
		]).then(function () {
			notify({
				message: 'Successfully removed grader',
				context: 'success',
				auto: true
			});
			template.appList.remove('id', appId);
		}, function(err) {
			notify({
				message: err.reason,
				context: 'warning',
				dismissable: true
			});
		}).done();
	}
}