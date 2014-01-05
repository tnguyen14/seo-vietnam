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

function appReady(app) {
	var empty = [],
		required = ['essay.one', 'essay.two', 'essay.three', 'essay.four', 'files.resume'];
	_.each(required, function(field){
		// parse the dot notation
		var value = app,
			path = field.split('.');
		while (path.length !== 0) {
			if (!value) {
				break;
			}
			value = value[path.shift()];
		}
		if (_.isEmpty(value)) {
			empty.push(field);
		}
	});

	if (empty.length > 0) {
		return false;
	} else {
		return true;
	}
}