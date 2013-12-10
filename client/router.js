apply = function(section, part) {
	if (!section) {
		section = 'personal-info';
	}
	if (part) {
		Session.set('sectionPart', part);
		section = section + '-' + part;
	}
	Session.set('currentSection', section);
	return 'apply';
};

Meteor.Router.add({
	'/': 'login',
	'/login': 'login',
	'/apply': apply,
	'/apply/:section': apply,
	'/apply/:section/:part': apply,
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