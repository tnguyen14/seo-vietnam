ApplyController = RouteController.extend({
	before: function() {
		var section = this.params.section || 'personal-info';
		Session.set('current', section);
	},
	action: function() {
		var section = Session.get('current');
		this.render();
		this.render(section, {
			to: 'section'
		});
	},
	data: function() {
		return {
			app: Applications.findOne({user: Meteor.userId()})
		}
	}
});

var filters = {
	isLoggedIn: function() {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			this.render('login');
			this.stop();
		}
	},
	isAdmin: function() {
		if (!Meteor.loggingIn() && !isAdmin()) {
			this.render('oops');
			this.stop();
		}
	}
}

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() {
		return Meteor.subscribe('appData')
	}
});

Router.map(function(){
	this.route('login', {
		path: '/',
		waitOn: null
	});

	this.route('login', {
		path: '/login',
		waitOn: null
	});

	this.route('forgot-password');
	this.route('reset-password', {
		path: '/reset-password/:token',
		data: function() {
			return {
				token: this.params.token
			}
		}
	})

	this.route('apply', {
		path: '/apply/:section?',
		controller: ApplyController
	});

	this.route('completed', {
		path: '/completed'
	});

	this.route('profile', {
		data: function() {
			return {
				app: Applications.findOne({user: Meteor.userId()}),
				user: Meteor.user()
			}
		}
	});

	this.route('admin', {
		layoutTemplate: 'admin-layout',
		path: '/admin',
		controller: AdminController,
	});

	this.route('admin-apps', {
		path: '/admin/apps',
		layoutTemplate: 'admin-layout',
		controller: AdminAppsController
	});

	this.route('admin-app-single', {
		path: '/admin/apps/:_appId',
		layoutTemplate: 'admin-layout',
		controller: AdminAppSingle
	});

	this.route('admin-users', {
		path: '/admin/users',
		layoutTemplate: 'admin-layout',
		controller: AdminUsersController
	});

	this.route('admin-user-single', {
		path: '/admin/users/:_id',
		layoutTemplate: 'admin-layout',
		controller: AdminUserSingle
	});
});

Router.before(filters.isLoggedIn, {except: ['login', 'forgot-password', 'reset-password']});
Router.before(filters.isAdmin, {only: ['admin', 'admin-apps', 'admin-app-single', 'admin-users', 'admin-user-single']});