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
	},
	isInterviewer: function() {
		if (!(Meteor.loggingIn() || hasRole('interviewer', Meteor.user()))) {
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
	});

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

	this.route('admin-users-grader', {
		path: '/admin/users/grader',
		controller: AdminGradersController
	});

	this.route('admin-user-single', {
		path: '/admin/users/:_id',
		layoutTemplate: 'admin-layout',
		controller: AdminUserSingle
	});

	this.route('admin-graders', {
		path: '/admin/graders',
		controller: AdminGradersController
	});

	this.route('admin-grader-single', {
		path: '/admin/graders/:_id',
		controller: GraderProfileController
	});

	// grade
	this.route('grader-register', {
		path: '/grader/register',
		template: 'grader-register'
	});
	this.route('grader-profile', {
		path: '/grader/profile',
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

	// interview
	this.route('interviewer-profile', {
		path: '/interviewer/profile',
		controller: InterviewerProfileController
	});
	this.route('admin-interviewers', {
		path: 'admin/interviewers/',
		controller: AdminInterviewersController
	});
	this.route('admin-interviewer-single', {
		path: 'admin/interviewers/:_id',
		controller: InterviewerProfileController
	});
	this.route('interview-apps', {
		path: '/interview/apps',
		controller: InterviewAppsController
	});
	this.route('interview-app-single', {
		path: '/interview/apps/:_id',
		controller: InterviewAppSingleController
	});
});

Router.before(filters.isLoggedIn, {except: [
	'login',
	'forgot-password',
	'reset-password',
	'grader-register'
]});
Router.before(filters.isAdmin, {only: [
	'admin',
	'admin-apps',
	'admin-app-single',
	'admin-users',
	'admin-users-grader',
	'admin-user-single',
	'admin-graders',
	'admin-grader-single'
]});
Router.before(filters.isGrader, {only: [
	'grader-profile',
	'grade-apps',
	'grade-app-single'
]});
Router.before(filters.isInterviewer, {only: [
	'interviewer-profile'
]});