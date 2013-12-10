apply = function(section, part) {
	if (!section) {
		section = 'personal-info';
	}
	Session.set('current', section);
	return 'apply';
};

Meteor.Router.add({
	'/': 'login',
	'/login': 'login',
	'/apply': apply,
	'/apply/:section': apply,
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