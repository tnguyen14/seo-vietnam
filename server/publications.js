Meteor.publish('information', function() {
	return Information.find({});
});

Meteor.publish('appData', function(userId) {
	if (!_.isString(userId)) {
		userId = this.userId;
	}
	return Applications.find({user: userId});
});

Meteor.publish('allApps', function() {
	if (isAdminById(this.userId)) {
		return Applications.find({});
	}
	return [];
})

Meteor.publish('userData', function(userId) {
	if (!_.isString(userId)) {
		userId = this.userId;
	}
	return Meteor.users.find({_id: userId},
	{
		fields: {
			'roles': 1,
			'profile': 1,
			'emails': 1,
			'_id': 1
		}
	});
});

Meteor.publish('allUsers', function() {
	if (isAdminById(this.userId)) {
		return Meteor.users.find({});
	}
	return [];
})