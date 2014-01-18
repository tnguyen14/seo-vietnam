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
			criteria = gradeCriteria();

		if (app) {
			user = Meteor.users.findOne(app.user);
			if (app.grades) {
				// get the grades that were submitted by this grader if exists
				// omit the property grader in the grade to display properly
				var appGrade = _.chain(app.grades).find(function(g) {
					return g.grader === graderId;
				}).omit('grader').value(),
					appCriteria = _.keys(appGrade);
				// add scores to be used in template
				_.each(criteria, function(c){
					if (_.contains(appCriteria, c.slug) && appGrade[c.slug]) {
						// if there are factors, dig deeper
						if (c.factors) {
							for (var f in c.factors) {
								if (c.factors.hasOwnProperty(f)) {
									c.factors[f].score = appGrade[c.slug][f];
								}
							}
						} else {
							c.score = appGrade[c.slug];
						}
					}
				});
			}
		}
		// add key to factors as Meteor handlebars does not supprt @key
		// convert object 'factors' to array as Meteor #each does not support iterating over object
		_.each(criteria, function(c) {
			if (c.factors) {
				var arrFactors = [];
				for (var f in c.factors) {
					if (c.factors.hasOwnProperty(f)) {
						c.factors[f].key = f;
						arrFactors.push(c.factors[f]);
					}
				}
				c.factors = arrFactors;
			}
		});
		return {
			app: app,
			user: user,
			criteria: criteria
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