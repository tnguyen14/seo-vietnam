isSuperAdmin = function(user) {
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return hasRole('super-admin', user);
}

isAdmin = function(user) {
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return hasRole('admin', user);
}

isAdminById = function(userId) {
	if (userId) {
		var user = Meteor.users.findOne(userId);
		return hasRole('admin', user);
	} else {
		return false;
	}
}

hasRole = function(role, user) {
	if (!role) {
		return;
	}
	if (!user) {
		if (Meteor.isServer) {
			user = Meteor.users.findOne(this.userId);
		} else {
			user = Meteor.user();
		}
	} else if (_.isString(user)) {
		user = Meteor.users.findOne(user);
	}
	if (user) {
		return _.contains(user.roles, role);
	}
}

getRoles = function() {
	return [
		'applicant',
		'admin',
		'grader',
		'interviewer'
	];
}