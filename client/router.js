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
		// wait for user logged in before proceed
		if (Meteor.loggingIn()) {
			this.render('admin-loading');
			this.stop();
		}
		if (!Meteor.loggingIn() && !isAdmin()) {
			this.render('oops');
			this.stop();
		}
	}
}

Router.configure({
	layoutTemplate: 'layout',
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

	this.route('profile');

	this.route('admin', {
		layoutTemplate: 'admin-layout',
		path: '/admin',
		before: filters.isAdmin,
		controller: AdminController,
	});

	this.route('admin-apps', {
		path: '/admin/apps',
		layoutTemplate: 'admin-layout',
		before: filters.isAdmin,
		controller: AdminAppsController
	});

	this.route('admin-users', {
		path: '/admin/users',
		layoutTemplate: 'admin-layout',
		before: filters.isAdmin,
		controller: AdminUsersController
	});

	this.route('admin-user-single', {
		path: '/admin/users/:_id',
		layoutTemplate: 'admin-layout',
		before: filters.isAdmin,
		controller: AdminUserSingle
	});
});

Router.before(filters.isLoggedIn, {except: ['login', 'forgot-password', 'reset-password']});