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
		var app = Applications.findOne(this.params._id),
			user;
		if (app) {
			user = Meteor.users.findOne(app.user);
		}
		return {
			app: app,
			user: user,
			criteria: [
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
			]
		}
	}
});

Template['grade'].events = {
	'click .grade-icon': function(e) {
		$('.main-container').toggleClass('grade-active');
		$('.grade-wrap').toggleClass('grade-active');
		$(e.target).toggleClass('active');
	}
}