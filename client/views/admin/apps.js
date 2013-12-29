AdminAppsController = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-apps',
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
			Meteor.subscribe('allApps')
		]
	},
	data: function() {
		 var apps =  Applications.find().fetch();
		_.each(apps, function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.email = user.emails[0].address;
			}
		});
		return {
			apps: apps
		}
	}
});

Template['admin-apps'].rendered = function() {
	var $table = $('#admin-apps .admin-list-apps');
	$table.dataTable();
}