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
			'_id': 1,
			'createdAt': 1
		}
	});
});

Meteor.publish('graderData', function(graderId) {
	if (!_.isString(graderId)) {
		graderId = this.userId;
	}
	return Meteor.users.find({_id: graderId}, {
		fields: {
			'roles': 1,
			'profile': 1,
			'emails': 1,
			'grader': 1
		}
	});
})

Meteor.publish('allUsers', function(role) {
	if (isAdminById(this.userId)) {
		var roles = [],
			fields = {
			'roles': 1,
			'profile': 1,
			'emails': 1,
			'_id': 1,
			'createdAt': 1
		};
		// default to all users
		if (!role) {
			return Meteor.users.find({},
			{
				fields: fields
			});
		} else {
			if (_.isString(role) && role !== '') {
				roles.push(role);
			} else if (_.isArray(role)) {
				roles = role;
			}
			if (roles.length > 0) {
				return Meteor.users.find({roles: {$in: roles}}, {
					fields: fields
				});
			}
		}
	}
	return [];
})