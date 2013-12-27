isSuperAdmin = function(user) {
	console.log(user);
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	console.log(Meteor.user());
	console.log(Meteor.users.findOne(Meteor.userId()));
	return hasRole('super-admin', user);
}

isAdmin = function(user) {
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return hasRole('admin', user);
}

isAdminById = function(userId) {
	if (userId) {
		var user = Meteor.users.findOne(userId);
		console.log(user);
		return hasRole('admin', user);
	} else {
		return false;
	}
}

hasRole = function(role, user) {
	return _.contains(user.roles, role);
}