apply = function(id) {
	Session.set('applySection', id);
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