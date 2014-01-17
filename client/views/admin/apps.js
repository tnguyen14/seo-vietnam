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
			// if there are graders
			if (a.graders) {
				if (a.graders.length > 0) {
					a.grade1 = 'assigned';
				}
				if (a.graders.length > 1) {
					a.grade2 = 'assigned';
				}
				if (a.graders.length > 2) {
					a.grade3 = 'assigned';
				}
				// if a grade has been received
				// NOTE: grades array will not match up to graders array in terms of grader ID
				if (a.grades) {
					if (a.grades.length > 0) {
						a.grade1 = 10;
					}
					if (a.grades.length > 1) {
						a.grade2 = 10;
					}
					if (a.grades.length > 2) {
						a.grade3 = 10;
					}
				}
			}
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
		searchClass: 'searchApps',
		// indexAsync: true,
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	var appList = new List('admin-apps', listOptions);
}
