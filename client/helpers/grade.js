// add a new app to grader
// @return jQuery deferred Promise object
addAppToGrader = function(graderId, appId, applicantId) {
	var dfd = new $.Deferred();
	if (!graderId || !appId) {
		dfd.reject(new Meteor.Error(400, 'No grader or app provided.'));
		return dfd.promise();
	}
	if (!applicantId) {
		var app = Applications.findOne(appId);
		if (app) {
			applicantId = app.user;
		} else {
			dfd.reject(new Meteor.Error(400, 'No application found for appId provided'));
			return dfd.promise();
		}
	}
	var grader = Meteor.users.findOne(graderId),
		limit = grader.grader.limit,
		assignedApps = grader.grader.apps;
	if (!limit) {
		dfd.reject(new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has no limit set.'));
			return dfd.promise();
	}
	if (_.isArray(assignedApps)) {
		if (assignedApps.length >= limit) {
			dfd.reject(new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has reached their limit.'));
			return dfd.promise();
		}
	}
	Meteor.users.update(graderId, {
		$addToSet: {
			'grader.apps': {
				appId: appId,
				applicantId: applicantId,
				status: 'assigned'
			}
		}
	}, function(err, res) {
		if (!err) {
			dfd.resolve(graderId);
		} else {
			dfd.reject(err);
		}
	});
	return dfd.promise();
};

// add a new grader to app
// @return jQuery deferred Promise object
addGraderToApp = function(appId, graderId) {
	var dfd = new $.Deferred();
	if (!graderId || !appId) {
		dfd.reject(new Meteor.Error(400, 'No grader or app provided.'));
		return dfd.promise();
	}
	var grader = Meteor.users.findOne(graderId),
		limit = grader.grader.limit,
		assignedApps = grader.grader.apps;
	if (!limit) {
		dfd.reject(new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has no limit set.'));
			return dfd.promise();
	}
	if (_.isArray(assignedApps)) {
		if (assignedApps.length >= limit) {
			dfd.reject(new Meteor.Error('Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has reached their limit.2'));
			return dfd.promise();
		}
	}
	Applications.update(appId, {
		$addToSet: {
			'graders': graderId
		}
	}, function(err) {
		if (!err) {
			dfd.resolve(appId);
		} else {
			dfd.reject(err);
		}
	})
	return dfd.promise();
}

// remove an app from grader
// @return jQuery deferred Promise object
removeAppFromGrader = function(graderId, appId) {
	var dfd = new $.Deferred();
	if (!graderId || !appId) {
		dfd.reject(new Meteor.Error(400, 'No grader or app provided.'));
		return dfd.promise();
	}
	Meteor.users.update(graderId, {
		$pull: {
			'grader.apps': {appId: appId}
		}
	}, function(err) {
		if (!err) {
			dfd.resolve();
		} else {
			dfd.reject(err);
		}
	})
	return dfd.promise();
};

// remove a grader from an app
// @return jQuery deferred Promise object
removeGraderFromApp = function(appId, graderId) {
	var dfd = new $.Deferred();
	if (!graderId || !appId) {
		dfd.reject(new Meteor.Error(400, 'No grader or app provided.'));
		return dfd.promise();
	}
	Applications.update(appId, {
		$pull: {
			'graders': graderId
		}
	}, function(err) {
		if (!err) {
			dfd.resolve();
		} else {
			dfd.reject(err);
		}
	});
	return dfd.promise();
};

// remove any grade by grader from an app
// @return jQuery deferred Promise object
removeGradeFromApp = function(appId, graderId) {
	var dfd = new $.Deferred();
	Applications.update(appId, {
		$pull: {
			'grades': {grader: graderId}
		}
	}, function(err) {
		if (!err) {
			dfd.resolve();
		} else {
			dfd.reject(err);
		}
	})
	return dfd.promise();
}