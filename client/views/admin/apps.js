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
				a.email = user.emails[0].address;
			}
			a.appURL = Router.routes['admin-app-single'].path({_id:a._id});
		});
		return {
			apps: apps
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

AdminAppSingle = RouteController.extend({
	waitOn: function() {
		// since params returns appId, there's no way to
		// look up app from userId
		// subscribing to all for now
		return [
			Meteor.subscribe('allUsers'),
			Meteor.subscribe('appData', this.params._id)
		];
	},
	data: function() {
		var app = Applications.findOne(this.params._id),
			user, userId;
		if (app) {
			userId = app.user;
		}
		if (userId) {
			user = Meteor.users.findOne(userId);
		}
		return {
			app: app,
			user: user
		}
	}

});