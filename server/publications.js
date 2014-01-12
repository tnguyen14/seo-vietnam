Meteor.publish('information', function() {
	return Information.find({});
});

// appId can be a oID string or a query object
// for eg: appId = {user: 'userId'}
Meteor.publish('appData', function(appId) {
	if (_.isObject(appId)) {
		if (appId.user) {
			return Applications.find({user: appId.user});
		}
	} else if (_.isString(appId)) {
		return Applications.find(appId);
	} else {
		userId = this.userId;
		return Applications.find({user: userId})
	}
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
});

function graderAssignedApps(graderId) {
	var grader = Meteor.users.findOne(graderId);
	return _.pluck(grader.grader.apps, 'id');
}
function graderAssignedUsers(graderId) {
	var grader = Meteor.users.findOne(graderId);
	return _.pluck(grader.grader.apps, 'userId');
}

Meteor.publish('graderApps', function() {
	if (!hasRole('grader', this.userId)) {
		return [];
	}
	var assignedApps = graderAssignedApps(this.userId);
	return Applications.find({_id: {
		$in: assignedApps
	}});
});

Meteor.publish('graderUsers', function() {
	if (!hasRole('grader', this.userId)) {
		return [];
	}
	var assignedUsers = graderAssignedUsers(this.userId);
	return Meteor.users.find({_id: {
		$in: assignedUsers
	}})
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