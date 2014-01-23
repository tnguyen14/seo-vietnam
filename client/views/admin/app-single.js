AdminAppSingle = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('allGraders'),
			Meteor.subscribe('allInterviewers'),
			// get applicant data based on app
			Meteor.subscribe('userData', {app: this.params._id}),
			Meteor.subscribe('appData', this.params._id)
		];
	},
	data: function() {
		var app = Applications.findOne(this.params._id),
			graders = Meteor.users.find({roles: 'grader'}).fetch(),
			interviewers = Meteor.users.find({roles: 'interviewer'}).fetch(),
			user, userId, gradersAssigned;
		if (app) {
			userId = app.user;
			gradersAssigned = app.graders;
			interviewersAssigned = app.interviewers;
		}
		// get user info
		if (userId) {
			user = Meteor.users.findOne(userId);
		}

		// get grader profiles
		if (_.isArray(gradersAssigned) && gradersAssigned.length > 0) {
			gradersAssigned = parseAssessors(gradersAssigned, app, 'grader');
		}

		// get interviewes
		if (_.isArray(interviewersAssigned) && interviewersAssigned.length > 0) {
			interviewersAssigned = parseAssessors(interviewersAssigned, app, 'interviewer');
		}
		return {
			app: app,
			user: user,
			statuses: [
				{
					"slug": "started",
					"name": "started"
				}, {
					"slug": "completed",
					"name": "completed"
				}
			],
			gradersAssigned: gradersAssigned,
			interviewersAssigned: interviewersAssigned,
			graders: graders,
			interviewers: interviewers
		}
	}
});

Template['admin-app-single'].created = function() {
	Session.set('editing', false);
	Session.set('hasChange', false);
	Session.set('hasGraderChange', false);
	Session.set('hasInterviewerChange', false);
}

Template['admin-app-single'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

// assign app to all graders
function saveAppToGraders(graders, appId, applicantId) {
	return Q.all(_.map(graders, function(graderId) {
		return addAppToGrader(graderId, appId, applicantId);
	})).then(function(value) {
		return value;
	}, function(reason) {
		throw reason;
	});
}

function saveGradersToApp(graders, appId) {
	return Q.all(_.map(graders, function(graderId) {
		return addGraderToApp(appId, graderId);
	})).then(function(value) {
		return value;
	}, function(reason) {
		throw reason;
	});
}

// assign app to all interviewers
function saveAppToInterviewers(interviewers, appId, applicantId) {
	return Q.all(_.map(interviewers, function(interviewerId) {
		return addAppToInterviewer(interviewerId, appId, applicantId);
	})).then(function(value) {
		return value;
	}, function(reason) {
		throw reason;
	});
}

function saveInterviewersToApp(interviewers, appId) {
	return Q.all(_.map(interviewers, function(interviewerId) {
		return addInterviewerToApp(appId, interviewerId);
	})).then(function(value) {
		return value;
	}, function(reason) {
		throw reason;
	});
}

Template['admin-app-single'].events = {
	'change select#status': function(e) {
		e.preventDefault;
		Session.set('hasChange', true);
	},
	'change select.graders': function(e) {
		e.preventDefault();
		Session.set('hasGraderChange', true);
	},
	'change select.interviewers': function(e) {
		e.preventDefault();
		Session.set('hasInterviewerChange', true);
	},
	'click #edit': function(e, t) {
		e.preventDefault();
		// if session was in editing mode, save changes and switch to regular mode
		if (Session.get('editing')) {
			var $form = $('#admin-app-single'),
				appId = $form.data('id'),
				app = Applications.findOne(appId),
				applicantId = $form.data('applicantid'),
				groups = getFormGroups($form),
				gradersGroup,
				graders,
				interviewersGroup,
				interviewers;

				// use deferred to save apps and also save to grader profile if grader changes are invoked
			var saveAppDfd = Q.defer(),
				saveAppToGradersDfd = Q.defer(),
				saveGradersToAppDfd = Q.defer(),
				saveAppToInterviewersDfd = Q.defer(),
				saveInterviewersToAppDfd = Q.defer();

			gradersGroup = Lazy(groups).find(function(g) {
				return g.graders !== undefined;
			});
			if (gradersGroup && Session.get('hasGraderChange')) {
				// if only one grader is assigned, convert it to an array of 1
				if (_.isString(gradersGroup.graders)) {
					gradersGroup.graders = [gradersGroup.graders];
				}
				// only save the changes
				graders = _.difference(gradersGroup.graders, app.graders);

				// save app to all graders selected
				saveAppToGraders(graders, appId, applicantId).then(function(value) {
					saveAppToGradersDfd.resolve(value);
				}, function(reason) {
					saveAppToGradersDfd.reject(reason);
				}).done();

				saveGradersToApp(graders, appId).then(function(value) {
					saveGradersToAppDfd.resolve(value);
				}, function(reason) {
					saveGradersToAppDfd.reject(reason);
				}).done();
			} else {
				saveAppToGradersDfd.resolve();
				saveGradersToAppDfd.resolve();
			}

			interviewersGroup = Lazy(groups).find(function(g) {
				return g.interviewers !== undefined;
			});

			if (interviewersGroup && Session.get('hasInterviewerChange')) {
				// if only one grader is assigned, convert it to an array of 1
				if (_.isString(interviewersGroup.interviewers)) {
					interviewersGroup.interviewers = [interviewersGroup.interviewers];
				}
				// only save the changes
				interviewers = _.difference(interviewersGroup.interviewers, app.interviewers);

				// save app to all graders selected
				saveAppToInterviewers(interviewers, appId, applicantId).then(function(value) {
					saveAppToInterviewersDfd.resolve(value);
				}, function(reason) {
					saveAppToInterviewersDfd.reject(reason);
				}).done();

				saveInterviewersToApp(interviewers, appId).then(function(value) {
					saveInterviewersToAppDfd.resolve(value);
				}, function(reason) {
					saveInterviewersToAppDfd.reject(reason);
				}).done();
			} else {
				saveAppToInterviewersDfd.resolve();
				saveInterviewersToAppDfd.resolve();
			}
			// omit graders and interviewers in the rest of the form groups
			groups = Lazy(groups).map(function(g) {
				if (!_.has(g, 'graders') && !_.has(g, 'interviewers')) {
					return g;
				}
			}).compact().toArray();
			// save any changes into the app itself
			if (Session.get('hasChange')) {
				saveApp({
					groups: groups,
					id: appId,
					success: function() {
						saveAppDfd.resolve();
					},
					error: function(err) {
						saveAppDfd.reject(err);
					}
				});
			} else {
				saveAppDfd.resolve();
			}

			Q.all([
				saveAppDfd.promise,
				saveAppToGradersDfd.promise,
				saveGradersToAppDfd.promise,
				saveAppToInterviewersDfd,
				saveInterviewersToAppDfd
			]).done(function(value) {
				if (Session.get('hasChange') || Session.get('hasGraderChange') || Session.get('hasInterviewerChange')) {
					notify({
						message: 'Successfully saved app',
						context: 'success',
						auto: true
					});
				}
				Session.set('editing', false);
			}, function(reason) {
				notify({
					message: reason.reason,
					context: 'danger',
					dismissable: true,
					clearPrev: true
				});
			});
		// if session was not in editing mode, turn editing on
		} else {
			Session.set('editing', true);
		}
	},
	'click #add-grader': function(e) {
		e.preventDefault();
		var $graderSelects = $('#graders select[name="graders"]');
		if ($graderSelects.length < 3) {
			$('#graders .editing').append(Meteor.render(Template['add-grader']));
		}
	},
	'click #add-interviewer': function(e) {
		e.preventDefault();
		var $interviewerSelects = $('#interviewers select[name="interviewers"]');
		if ($interviewerSelects.length < 1) {
			$('#interviewers .editing').append(Meteor.render(Template['add-interviewer']));
		}
	},
	'click .edit-grader .remove': function(e) {
		e.preventDefault();
		var $form = $('#admin-app-single'),
			appId = $form.data('id'),
			$editGrader = $(e.target).closest('.edit-grader'),
			graderId = $editGrader.find('select').val();

		Q.all([
			removeAppFromGrader(graderId, appId),
			removeGraderFromApp(appId, graderId),
			removeGradeFromApp(appId, graderId)
		]).then(function () {
			notify({
				message: 'Successfully removed grader',
				context: 'success',
				auto: true
			});
			$editGrader.remove();
		}, function(err) {
			notify({
				message: err.reason,
				context: 'warning',
				dismissable: true
			});
		}).done();
	},
	'click .edit-interviewer .remove': function(e) {
		e.preventDefault();
		var $form = $('#admin-app-single'),
			appId = $form.data('id'),
			$editInterviewer = $(e.target).closest('.edit-interviewer'),
			interviewerId = $editInterviewer.find('select').val();

		Q.all([
			removeAppFromInterviewer(interviewerId, appId),
			removeInterviewerFromApp(appId, interviewerId),
			removeInterviewFromApp(appId, interviewerId)
		]).then(function () {
			notify({
				message: 'Successfully removed interviewer',
				context: 'success',
				auto: true
			});
			$editInterviewer.remove();
		}, function(err) {
			notify({
				message: err.reason,
				context: 'warning',
				dismissable: true
			});
		}).done();
	}
}

Template['add-grader'].graders = function() {
	return Meteor.users.find({roles: 'grader'}).fetch();
}

Template['add-grader'].events = {
	'click .remove': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-grader').remove();
	}
}

Template['add-interviewer'].interviewers = function() {
	return Meteor.users.find({roles: 'interviewer'}).fetch();
}

Template['add-grader'].events = {
	'click .remove': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-interviewer').remove();
	}
}