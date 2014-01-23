addAppToInterviewer = function(interviewerId, appId, applicantId) {
	return Q.fcall(function() {
		if (!interviewerId || !appId) {
			throw new Meteor.Error(400, 'No interviewer or app provided.');
		}
		if (!applicantId) {
			var app = Applications.findOne(appId);
			if (app) {
				applicantId = app.user;
			} else {
				throw new Meteor.Error(400, 'No application found for appId provided');
			}
		}
		var interviewer = Meteor.users.findOne(interviewerId),
			limit = interviewer.interviewer.limit,
			assignedApps = interviewer.interviewer.apps || [];
		if (Lazy(assignedApps).findWhere({appId: appId})) {
			throw new Meteor.Error(400, 'App ' + appId + 'has been assigned to this interviewer already');
		}
		if (!limit) {
			throw new Meteor.Error(400, 'Interviewer ' + interviewer.profile.name.first + ' ' + interviewer.profile.name.last + ' has no limit set.');
		}
		if (_.isArray(assignedApps)) {
			if (assignedApps.length >= limit) {
				throw new Meteor.Error(400, 'Interviewer ' + interviewer.profile.name.first + ' ' + interviewer.profile.name.last + ' has reached their limit.');
			}
		}
		Meteor.users.update(interviewerId, {
			$addToSet: {
				'interviewer.apps': {
					appId: appId,
					applicantId: applicantId,
					status: 'assigned'
				}
			}
		}, function(err, res) {
			if (!err) {
				return interviewerId;
			} else {
				throw err;
			}
		});
	});
};

addInterviewerToApp = function(appId, interviewerId) {
	return Q.fcall(function() {
		if (!interviewerId || !appId) {
			throw new Meteor.Error(400, 'No interviewer or app provided.');
		}
		var interviewer = Meteor.users.findOne(interviewerId),
			limit = interviewer.interviewer.limit,
			assignedApps = interviewer.interviewer.apps;
		if (!limit) {
			throw new Meteor.Error(400, 'Interviewer ' + interviewer.profile.name.first + ' ' + interviewer.profile.name.last + ' has no limit set.');
		}
		if (_.isArray(assignedApps)) {
			if (assignedApps.length >= limit) {
				throw new Meteor.Error('Interviewer ' + interviewer.profile.name.first + ' ' + interviewer.profile.name.last + ' has reached their limit.2');
			}
		}
		Applications.update(appId, {
			$addToSet: {
				'interviewers': interviewerId
			}
		}, function(err) {
			if (!err) {
				return appId;
			} else {
				throw err;
			}
		});
	});
}

// remove an app from interviewer
// @return {promise}
removeAppFromInterviewer = function(interviewerId, appId) {
	return Q.fcall(function() {
		if (!interviewerId || !appId) {
			throw new Meteor.Error(400, 'No interviewer or app provided.');
		}
		Meteor.users.update(interviewerId, {
			$pull: {
				'interviewer.apps': {appId: appId}
			}
		}, function(err) {
			if (!err) {
				return;
			} else {
				throw err;
			}
		})
	});
};

// remove a grader from an app
// @return {promise}
removeInterviewerFromApp = function(appId, interviewerId) {
	return Q.fcall(function() {
		if (!interviewerId || !appId) {
			throw new Meteor.Error(400, 'No interviewer or app provided.');
		}
		Applications.update(appId, {
			$pull: {
				'interviewers': interviewerId
			}
		}, function(err) {
			if (!err) {
				return;
			} else {
				throw err;
			}
		});
	});
};

// remove any interview by interviewer from an app
// @return {promise}
removeInterviewFromApp = function(appId, interviewerId) {
	return Q.fcall(function() {
		Applications.update(appId, {
			$pull: {
				'interviews': {interviewer: interviewerId}
			}
		}, function(err) {
			if (!err) {
				return;
			} else {
				throw err;
			}
		})
	});
}