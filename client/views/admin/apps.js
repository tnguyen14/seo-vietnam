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
		Lazy(apps).each(function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.emails = user.emails;
			}
			a.appURL = Router.routes['admin-app-single'].path({_id:a._id});
		});
		return {
			apps: apps
		}
	}
});

AdminAppsCompletedController = AdminAppsController.extend({
	data: function() {
		var apps =  Applications.find().fetch(),
			completedApps = Lazy(apps).filter(function(app) {
				return appComplete(app);
			});
		Lazy(completedApps).each(function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.emails = user.emails;
			}
			a.appURL = Router.routes['admin-app-single'].path({_id: a._id});
		});
		return {
			apps: completedApps.toArray()
		}
	}
});

Template['admin-apps'].rendered = function() {
	// var $table = $('#admin-apps .admin-list-apps');
	// $table.dataTable();
	var listOptions = {
		valueNames: [
			'name',
			'email',
			'status',
			'date-created',
			'datecompleted',
			'grade1',
			'grade2',
			'grade3'
		],
		page: 20,
		// indexAsync: true,
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	var appList = new List('admin-apps', listOptions);
}
