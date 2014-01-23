AdminAppSingle = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('allGraders'),
			// get applicant data based on app
			Meteor.subscribe('userData', {app: this.params._id}),
			Meteor.subscribe('appData', this.params._id)
		];
	},
	data: function() {
		var app = Applications.findOne(this.params._id),
			graders = Meteor.users.find({roles: 'grader'}).fetch(),
			user, userId, gradersAssigned;
		if (app) {
			userId = app.user;
			gradersAssigned = app.graders;
		}
		// get user info
		if (userId) {
			user = Meteor.users.findOne(userId);
		}

		// get grader profiles
		if (_.isArray(gradersAssigned) && gradersAssigned.length > 0) {
			gradersAssigned = Lazy(gradersAssigned).map(function(gid) {
				var grader = Meteor.users.findOne(gid),
					grade = Lazy(app.grades).findWhere({grader: gid}),
					criteria = parseGrade(grade),
					g = {};
				if (grader) {
					g._id = grader._id,
					g.name = grader.profile.name.first + ' ' + grader.profile.name.last,
					g.email = grader.emails[0].address
				} else {
					g._id = gid,
					g.noGraderFound = true
				}
				if (grade) {
					g.grade = grade;
				}
				g.criteria = criteria;
				g.total = calculateGrade(grade);
				return g;
			}).toArray();
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
			graders: graders
		}
	}
});

Template['admin-app-single'].created = function() {
	Session.set('editing', false);
	Session.set('hasChange', false);
	Session.set('hasGraderChange', false);
}

Template['admin-app-single'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

// assign app to all graders
function saveAppToGraders(graders, appId, applicantId) {
	// var dfd = new $.Deferred();
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

Template['admin-app-single'].events = {
	'change select#status': function(e, t) {
		e.preventDefault;
		Session.set('hasChange', true);
	},
	'change select.graders': function(e, t) {
		e.preventDefault();
		Session.set('hasGraderChange', true);
	},
	'click #edit': function(e, t) {
		e.preventDefault();
		// if session was in editing mode, save changes and switch to regular mode
		if (Session.get('editing')) {
			var $form = $('#admin-app-single'),
				appId = $form.data('id'),
				app = Applications.findOne(appId),
				applicantId = $form.data('applicantid'),
				groups,
				gradersGroup,
				graders;

			groups = getFormGroups($form),
				// use deferred to save apps and also save to grader profile if grader changes are invoked
				saveAppDfd = Q.defer(),
				saveAppToGradersDfd = Q.defer(),
				saveGradersToAppDfd = Q.defer();

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

				// omit graders in the rest of the form groups
				groups = Lazy(groups).map(function(g) {
					return Lazy(g).omit('graders');
				}).toArray();
			} else {
				saveAppToGradersDfd.resolve();
				saveGradersToAppDfd.resolve();
			}

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

			Q.all([saveAppDfd.promise, saveAppToGradersDfd.promise, saveGradersToAppDfd.promise]).done(function(value) {
				if (Session.get('hasChange') || Session.get('hasGraderChange')) {
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
	'click .edit-grader .remove': function(e) {
		e.preventDefault();
		var $form = $('#admin-app-single'),
			appId = $form.data('id'),
			$editGrader = $(e.target).closest('.edit-grader'),
			graderId = $editGrader.find('select').val();

		$.when(removeAppFromGrader(graderId, appId), removeGraderFromApp(appId, graderId), removeGradeFromApp(appId, graderId)).done(function () {
			notify({
				message: 'Successfully removed grader',
				context: 'success',
				auto: true
			});
			$editGrader.remove();
		}).fail(function(err) {
			notify({
				message: err.reason,
				context: 'warning',
				dismissable: true
			});
		});
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