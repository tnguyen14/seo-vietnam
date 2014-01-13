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
			user: user,
			statuses: [
				{
					"slug": "started",
					"name": "started"
				}, {
					"slug": "completed",
					"name": "completed"
				}
			]
		}
	}
});

Template['admin-app-single'].created = function() {
	Session.set('editing', false);
}

Template['admin-app-single'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

Template['admin-app-single'].events = {
	'click #edit': function(e) {
		e.preventDefault();
		if (Session.get('editing')) {
			var $form = $('#admin-app-single');
			if ($form.valid()) {
				saveApp({
					groups: getFormGroups($form),
					id: $form.data('id'),
					success: function() {
						notify({
							message: 'Successfully saved app',
							context: 'success',
							auto: true
						});
						Session.set('editing', false);
					},
					error: function(err) {
						notify({
							message: err.reason,
							context: 'danger',
							dismissable: true,
							clearPrev: true
						})
					}
				})
			}
		} else {
			Session.set('editing', true);
		}
	}
}