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
	},
	isGrader: function() {
		if (!(Meteor.loggingIn() || hasRole('grader', Meteor.user()))) {
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
		controller: AdminAppsController
	});
	this.route('admin-apps-completed', {
		path: '/admin/apps/completed',
		controller: AdminAppsCompletedController
	});

	this.route('admin-app-single', {
		path: '/admin/apps/:_id',
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

	this.route('admin-grader', {
		path: '/admin/graders',
		template: 'admin-users',
		waitOn: function() {
			return Meteor.subscribe('allUsers', 'grader');
		},
		// @TODO: filter roles
		data: function() {
			var graders = Meteor.users.find({roles: 'grader'}).fetch();
			Lazy(graders).each(function(u) {
				u.profileURL = Router.routes['admin-grader-profile'].path({_id: u._id});
			});
			return {
				users: graders
			}
		}
	});

	this.route('admin-grader-profile', {
		path: '/admin/graders/:_id',
		controller: GraderProfileController
	})

	// grade
	this.route('grade-register', {
		path: '/grade/register',
		template: 'grade-register'
	});
	this.route('grade-temp', {
		path: 'grade/temp'
	});
	this.route('grader-profile', {
		path: '/grade/profile',
		controller: GraderProfileController
	});
	this.route('grade-apps', {
		path: '/grade/apps',
		controller: GradeAppsController
	});
	this.route('grade-app-single', {
		path: '/grade/apps/:_id',
		controller: GradeAppSingleController
	});
});

Router.before(filters.isLoggedIn, {except: [
	'login',
	'forgot-password',
	'reset-password',
	'grade-register'
]});
Router.before(filters.isAdmin, {only: [
	'admin',
	'admin-apps',
	'admin-app-single',
	'admin-users',
	'admin-user-single',
	'admin-grader',
	'admin-grader-profile'
]});
Router.before(filters.isGrader, {only: [
	'grade-temp',
	'grade-profile',
	'grade-apps',
	'grade-app-single'
]});