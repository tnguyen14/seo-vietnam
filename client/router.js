ApplyController = RouteController.extend({
	before: function() {
		var section = this.params.section || 'personal-info';
		Session.set('current', section);
		this.render(section, {to: 'section'});
	}
});

var filters = {
	isLoggedIn: function() {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			this.render('login');
			this.stop();
		}
	}
}

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('login', {
		path: '/'
	});

	this.route('login', {
		path: '/login'
	});

	this.route('apply', {
		path: '/apply/:section?',
		controller: ApplyController
	});

	this.route('completed', {
		path: '/completed'
	});

	this.route('/profile', {
		path: '/profile'
	})
});

Router.before(filters.isLoggedIn, {except: 'login'});