GradeAppSingleController = RouteController.extend({
	template: 'grade-app-single',
	before: function() {

	},
	waitOn: function() {
		// @TODO logic to improve privary and only load assigned app
		return [
			Meteor.subscribe('graderApps'),
			Meteor.subscribe('graderUsers'),
			Meteor.subscribe('graderData', Meteor.userId())
		]
	},
	data: function() {
		var graderId = Meteor.userId(),
			user,
			app = Applications.findOne(this.params._id),
			appGrade,
			criteria;
		if (app) {
			user = Meteor.users.findOne(app.user);
			if (app.grades) {
				// get the grades that were submitted by this grader if exists
				appGrade = Lazy(app.grades).findWhere({grader: graderId});
			}
		}
		criteria = parseGrade(appGrade);
		return {
			app: app,
			user: user,
			criteria: criteria,
			// expose grade as well, for comments
			grade: appGrade
		}
	}
});

Template['grade'].rendered = function() {
	$('.tooltip-trigger').tooltip({
		html: true,
		placement: 'auto',
		trigger: 'hover click'
	});
	var $form = $('#grade-app');
	$form.validate({
	});
	$form.find('input[type="number"]').each(function() {
		$(this).rules("add", {
			range: [0, 10]
		});
	});

}

Template['grade'].events = {
	'click .grade-icon': function(e) {
		$('.main-container').toggleClass('grade-active');
		$('.grade-wrap').toggleClass('grade-active');
		$(e.target).toggleClass('active');
	},
	'click #grade-save': function(e) {
		e.preventDefault();
		var g = {},
			appId = this.app._id,
			applicantId = this.app.user,
			graderId = Meteor.userId(),
			// grades is an array
			// [{"criterion": "score"}, {"criterion2": "score2"}]
			grades = getFormGroups($(e.target).closest('.criteria')),
			saveGradeDfd = Q.defer(),
			saveGraderStatusDfd = Q.defer(),
			$form = $('#grade-app');
		if (!$form.valid()) {
			return;
		}
		// combine all the grades together into a single object
		_.each(grades, function (grade) {
			_.each(grade, function (score, slug) {
				g[slug] = score;
			});
		});
		// add grader id
		g.grader = graderId;
		console.log(g);
		// add g to the grades array
		Applications.update(appId, {
			// pull out any grade from this grader previously
			$pull: {
				grades: {grader: graderId}
			}
		}, function(err) {
			// if pulling success, save the new grade
			if (!err) {
				Applications.update(appId, {
					$push: {grades: g}
				}, function(err) {
					if (!err) {
						saveGradeDfd.resolve();
					} else {
						saveGradeDfd.reject(err);
					}
				});
			} else {
				saveGradeDfd.reject(err);
			}
		});
		Meteor.users.update(graderId, {
			$pull: {
				'grader.apps': {appId: appId}
			}
		}, function(err) {
			if (!err) {
				Meteor.users.update(graderId, {
					$push: {
						'grader.apps': {
							appId: appId,
							applicantId: applicantId,
							status: 'graded'
						}
					}
				}, function(err) {
					if (!err) {
						saveGraderStatusDfd.resolve();
					} else {
						saveGraderStatusDfd.reject(err);
					}
				})
			} else {
				saveGraderStatusDfd.reject(err);
			}
		});
		Q.all([saveGradeDfd.promise, saveGraderStatusDfd.promise])
		.then(function() {
			notify({
				message: "Grades saved",
				context: "success",
				auto: true
			});
		},function(err) {
			console.log(err);
			notify({
				message: err.reason,
				context: "danger",
				dismissable: true
			});
		}).done();
	}
}