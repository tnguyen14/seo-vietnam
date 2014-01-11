GradeAppSingleController = RouteController.extend({
	template: 'grade-app-single',
	before: function() {

	},
	waitOn: function() {
		// @TODO logic to improve privary and only load assigned app
		return [
			Meteor.subscribe('graderApps'),
			Meteor.subscribe('graderUsers')
		]
	},
	data: function() {
		var graderId = Meteor.userId(),
			user,
			app = Applications.findOne(this.params._id),
			criteria = [
				{
					"slug": "academic",
					"title": "Academic Achievement",
					"weight": 30
				}, {
					"slug": "leadership",
					"title": "Demonstrate leadership potentials",
					"weight": 30
				}, {
					"slug": "community",
					"title": "Demonstrate passion for community service",
					"weight": 30
				}, {
					"slug": "vietnam",
					"title": "Interest in Vietnam",
					"weight": 10
				}
			];
		if (app) {
			user = Meteor.users.findOne(app.user);
			if (app.grades) {
				// get the grades that were submitted by this grader if exists
				// filter returns an array
				var currentGrade = _.chain(app.grades).find(function(grade) {
					return grade.grader === graderId;
				}).omit('grader').value(),
					currentKeys = _.keys(currentGrade);
				// add current grade to criteria
				_.each(criteria, function(c){
					if (_.contains(currentKeys, c.slug) && currentGrade[c.slug]) {
						c.score = currentGrade[c.slug];
					}
				});
			}
		}
		return {
			app: app,
			user: user,
			criteria: criteria
		}
	}
});

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
			graderId = Meteor.userId(),
			// grades is an array
			// [{"criterion": "score"}, {"criterion2": "score2"}]
			grades= getFormGroups($(e.target).closest('.criteria'));
		// combine all the grades together into a single object
		_.each(grades, function(grade) {
			_.each(grade, function(score,slug) {
				score = parseInt(score, 10);
				g[slug] = score;
			});
		});
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
						notify({
							message: "Grades saved",
							context: "success",
							auto: true
						});
					}
				});
			}
		});
	}
}