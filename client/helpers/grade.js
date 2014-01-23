addAppToGrader = function(graderId, appId, applicantId) {
	return Q.fcall(function() {
		if (!graderId || !appId) {
			throw new Meteor.Error(400, 'No grader or app provided.');
		}
		if (!applicantId) {
			var app = Applications.findOne(appId);
			if (app) {
				applicantId = app.user;
			} else {
				throw new Meteor.Error(400, 'No application found for appId provided');
			}
		}
		var grader = Meteor.users.findOne(graderId),
			limit = grader.grader.limit,
			assignedApps = grader.grader.apps || [];
		if (Lazy(assignedApps).findWhere({appId: appId})) {
			throw new Meteor.Error(400, 'App ' + appId + 'has been assigned to this grader already');
		}
		if (!limit) {
			throw new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has no limit set.');
		}
		if (_.isArray(assignedApps)) {
			if (assignedApps.length >= limit) {
				throw new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has reached their limit.');
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
				return graderId;
			} else {
				throw err;
			}
		});
	});
};

addGraderToApp = function(appId, graderId) {
	return Q.fcall(function() {
		if (!graderId || !appId) {
			throw new Meteor.Error(400, 'No grader or app provided.');
		}
		var grader = Meteor.users.findOne(graderId),
			limit = grader.grader.limit,
			assignedApps = grader.grader.apps;
		if (!limit) {
			throw new Meteor.Error(400, 'Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has no limit set.');
		}
		if (_.isArray(assignedApps)) {
			if (assignedApps.length >= limit) {
				throw new Meteor.Error('Grader ' + grader.profile.name.first + ' ' + grader.profile.name.last + ' has reached their limit.2');
			}
		}
		Applications.update(appId, {
			$addToSet: {
				'graders': graderId
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

// remove an app from grader
// @return jQuery deferred Promise object
removeAppFromGrader = function(graderId, appId) {
	return Q.fcall(function() {
		if (!graderId || !appId) {
			throw new Meteor.Error(400, 'No grader or app provided.');
		}
		Meteor.users.update(graderId, {
			$pull: {
				'grader.apps': {appId: appId}
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
removeGraderFromApp = function(appId, graderId) {
	return Q.fcall(function() {
		if (!graderId || !appId) {
			throw new Meteor.Error(400, 'No grader or app provided.');
		}
		Applications.update(appId, {
			$pull: {
				'graders': graderId
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

// remove any grade by grader from an app
// @return jQuery deferred Promise object
removeGradeFromApp = function(appId, graderId) {
	return Q.fcall(function() {
		Applications.update(appId, {
			$pull: {
				'grades': {grader: graderId}
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

// parse app's grade, decorate it with criteria
// @param {object} grade object
// @return {object} the criteria object with scores
parseGrade = function(grade) {
	if (!grade) {
		return;
	}
	var criteria = gradeCriteria(),
	// keys of all the criteria in the grade
		gradeKeys = Lazy(grade).keys();

	Lazy(criteria).each(function(c) {
		// if the grade contains the criteria, and a grade was given for that criteria
		if (Lazy(gradeKeys).contains(c.slug) && grade[c.slug]) {
			if (!c.factors) {
				c.score = grade[c.slug];
			// if there are subfactors, dig deeper
			} else {
				Lazy(c.factors).each(function(factor, key) {
					factor.score = grade[c.slug][key];
				});
			}
		}
		// convert 'factors' to array as Meteor #each handlebars helper does not support iterating over object
		// also add key to factors as Meteor handlebars does not support @key
		if (c.factors) {
			var factorsArr = [];
			Lazy(c.factors).each(function(f, k) {
				f.key = k;
				factorsArr.push(f);
			});
			c.factors = factorsArr;
		}
	});
	return criteria;
}