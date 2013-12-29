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
		return Meteor.subscribe('app')
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

	this.route('apply', {
		path: '/apply/:section?',
		controller: ApplyController
	});

	this.route('completed', {
		path: '/completed'
	});

	this.route('profile', {
		path: '/profile',
	});

	this.route('admin', {
		path: '/admin',
		before: filters.isAdmin,
		controller: AdminController,
	});

	this.route('admin-apps', {
		path: '/admin/apps',
		before: filters.isAdmin,
		controller: AdminAppController
	})
});

Router.before(filters.isLoggedIn, {except: 'login'});