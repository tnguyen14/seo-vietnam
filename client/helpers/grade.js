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
			dfd.resolve();
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
	Applications.update(appId, {
		$addToSet: {
			'graders': graderId
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

// remove an app from grader
// @return jQuery deferred Promise object
removeAppFromGrader = function(graderId, appId) {
	var dfd = new $.Deferred();
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