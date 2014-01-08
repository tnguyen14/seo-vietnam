Meteor.publish('information', function() {
	return Information.find({});
});

Meteor.publish('appData', function(appId) {
	if (!_.isString(appId)) {
		userId = this.userId;
		return Applications.find({user: userId})
	}
	return Applications.find(appId);
});

Meteor.publish('allApps', function() {
	if (isAdminById(this.userId)) {
		return Applications.find({},
		{
			fields: {
				'status': 1,
				'createdAt': 1,
				'completedAt': 1,
				'user': 1
			}
		});
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
			'_id': 1,
			'createdAt': 1
		}
	});
});

Meteor.publish('allUsers', function() {
	if (isAdminById(this.userId)) {
		return Meteor.users.find({},
		{
			fields: {
				'roles': 1,
				'profile': 1,
				'emails': 1,
				'_id': 1,
				'createdAt': 1
			}
		});
	}
	return [];
})