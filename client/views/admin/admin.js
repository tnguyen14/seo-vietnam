AdminController = RouteController.extend({
	layoutTemplate: 'admin-layout',
	waitOn: function() {
		return [
			Meteor.subscribe('allApps'),
			Meteor.subscribe('allUsers')
		];
	},
	data: function() {
		return {
			totalApps: Applications.find().count(),
			submittedApps: Applications.find({status: 'completed'}).count(),
			numUsers: Meteor.users.find().count()
		}
	}
});