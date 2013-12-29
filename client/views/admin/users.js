AdminUsersController = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-users',
	waitOn: function() {
		return [
			Meteor.subscribe('allApps'),
			Meteor.subscribe('allUsers')
		];
	},
	data: function() {
		var users = Meteor.users.find().fetch();
		return {
			users: users
		};
	}
});

Template['admin-users'].rendered = function() {
	var $table = $('#admin-users .admin-list-users');
	$table.dataTable();
}