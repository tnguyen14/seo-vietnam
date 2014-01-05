AdminController = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('allApps'),
			Meteor.subscribe('allUsers')
		];
	},
	data: function() {
		var totalApps = Applications.find().fetch(),
			submittedApps = _.filter(totalApps, function(app) {
				return app.status === 'completed';
			}),
			completedApps = _.filter(totalApps, function(app) {
				return appReady(app);
			});
		return {
			totalApps: totalApps.length,
			submittedApps: submittedApps.length,
			completedApps: completedApps.length,
			numUsers: Meteor.users.find().count()
		}
	}
});