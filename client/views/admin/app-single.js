AdminAppSingle = RouteController.extend({
	waitOn: function() {
		// since params returns appId, there's no way to
		// look up app from userId
		// subscribing to all for now
		return [
			Meteor.subscribe('allUsers'),
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

		// get grader names
		if (_.isArray(gradersAssigned) && gradersAssigned.length > 0) {
			gradersAssigned = Lazy(gradersAssigned).map(function(gid) {
				var grader = Meteor.users.findOne(gid);
				if (grader) {
					return {
						_id: grader._id,
						name: grader.profile.name.first + ' ' + grader.profile.name.last,
						email: grader.emails[0].address
					}
				} else {
					return {};
				}
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
}

Template['admin-app-single'].helpers({
	editing: function() {
		return Session.get('editing');
	}
});

function saveGrader(graderId, appId, applicantId) {
	var dfd = new $.Deferred();
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

Template['admin-app-single'].events = {
	'click #edit': function(e) {
		e.preventDefault();
		// if session was in editing mode, save changes and switch to regular mode
		if (Session.get('editing')) {
			var $form = $('#admin-app-single'),
				appId = $form.data('id'),
				applicantId = $form.data('applicantid');
			if (!$form.valid()) {
				return;
			}
			var groups = getFormGroups($form),
				// use deferred to save apps and also save to grader profile if grader changes are invoked
				saveAppDfd = new $.Deferred(),
				saveGraderDfd = new $.Deferred();

			Lazy(groups).each(function (g) {
				// if there are changes to the graders
				if (g.graders) {
					if (_.isString(g.graders)) {
						g.graders = [g.graders];
					}
					// for each grader, save apps to grader's profile
					$.when.apply($, $.map(g.graders, function (graderId) {
						console.log('graderId ' + graderId );
						console.log('applicantId ' + applicantId);
						saveGrader(graderId, appId, applicantId);
					})).done(function () {
						saveGraderDfd.resolve();
					}).fail(function (err) {
						saveGraderDfd.reject(err);
					});
				} else {
					saveGraderDfd.resolve();
				}
			});

			// save any changes into the app itself
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

			// when saving into app and into grader's profile are done, notify
			$.when( saveGraderDfd.promise(), saveAppDfd.promise() ).done(function() {
				notify({
					message: 'Successfully saved app',
					context: 'success',
					auto: true
				});
				Session.set('editing', false);
			}).fail(function(err) {
				notify({
					message: err.reason,
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
		var $select = $(e.target).closest('.edit-grader').find('select');
		// Applications.update($('#admin-app-single').data('id'), {

		// })
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