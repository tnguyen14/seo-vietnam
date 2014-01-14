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

Template['admin-app-single'].events = {
	'click #edit': function(e) {
		e.preventDefault();
		if (Session.get('editing')) {
			var $form = $('#admin-app-single');
			if ($form.valid()) {
				var groups = getFormGroups($form);
				Lazy(groups).each(function(g) {
					if (g.graders) {
						if (_.isString(g.graders)) {
							g.graders = [g.graders];
						}
					}
				});
				saveApp({
					groups: groups,
					id: $form.data('id'),
					success: function() {
						notify({
							message: 'Successfully saved app',
							context: 'success',
							auto: true
						});
						Session.set('editing', false);
					},
					error: function(err) {
						notify({
							message: err.reason,
							context: 'danger',
							dismissable: true,
							clearPrev: true
						})
					}
				});
			}
		} else {
			Session.set('editing', true);
		}
	},
	'click #add-grader': function(e) {
		e.preventDefault();
		var $graderSelects = $('#graders select[name="graders"]');
		console.log($graderSelects.length);
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