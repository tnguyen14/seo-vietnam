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
			apps = Applications.find({'user': {$ne: Meteor.userId()}}).fetch();
		Lazy(apps).each(function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.emails = user.emails;
			}
			a.appURL = Router.routes['grade-app-single'].path({_id: a._id});
			a.graderStatus = Lazy(grader.grader.apps).findWhere({appId: a._id}).status;
		});

		return {
			apps: apps,
			isAdmin: hasRole('admin', Meteor.user())
		}
	}
});

Template['grade-apps'].events = {
	'click .assignedApp .drop': function(e) {
		e.preventDefault();
		if (!hasRole('admin', Meteor.user())) {
			notify({
				message: 'Only an admin can drop app',
				context: 'warning',
				dismissable: true
			});
			return;
		}

	}
}