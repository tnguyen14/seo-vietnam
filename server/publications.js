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
	return _.pluck(grader.grader.apps, 'appId');
}
function graderAssignedUsers(graderId) {
	var grader = Meteor.users.findOne(graderId);
	return _.pluck(grader.grader.apps, 'applicantId');
}

Meteor.publish('graderApps', function(graderId) {
	if (!_.isString(graderId)) {
		graderId = this.userId;
	}
	if (!hasRole('grader', graderId)) {
		return [];
	}
	var assignedApps = graderAssignedApps(graderId);
	return Applications.find({_id: {
		$in: assignedApps
	}});
});

Meteor.publish('graderUsers', function(graderId) {
	if (!_.isString(graderId)) {
		graderId = this.userId;
	}
	if (!hasRole('grader', graderId)) {
		return [];
	}
	var assignedUsers = graderAssignedUsers(graderId);
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
			'createdAt': 1,
			'grader': 1
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
});

Meteor.publish('allGraders', function() {
	if (!hasRole('grader', this.userId)) {
		return [];
	}
	return Meteor.users.find({roles: 'grader'});
})

Meteor.publish('userData', function(userId) {
	// find user based on app
	if (_.isObject(userId)) {
		if (userId.app) {
			// find app first
			var app = Applications.findOne(userId.app);
			return Meteor.users.find(app.user);
		}
	}

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