apply = function(id) {
	if (!id) {
		id = 'personal-info';
	}
	Session.set('currentSection', id);
	return 'apply';
};

Meteor.Router.add({
	'/': 'login',
	'/login': 'login',
	'/apply': apply,
	'/apply/:id': apply,
	'/completed': 'completed',
	'/profile': 'profile'
});

Meteor.Router.filters({
	'checkLoggedIn': function(page) {
		if (Meteor.loggingIn()) {
			return 'loading';
		} else if (Meteor.user()) {
			return page;
		} else {
			return 'login';
		}
	}
});

Meteor.Router.filter('checkLoggedIn', {except: 'login'});