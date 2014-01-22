AdminAppsController = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-apps',
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
			Meteor.subscribe('allApps')
		]
	},
	data: function() {
		var apps =  Applications.find().fetch();
		Lazy(apps).each(function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.emails = user.emails;
			}
			a.appURL = Router.routes['admin-app-single'].path({_id:a._id});
		});
		return {
			apps: apps
		}
	}
});

AdminAppsCompletedController = AdminAppsController.extend({
	data: function() {
		var apps =  Applications.find().fetch(),
			completedApps = Lazy(apps).filter(function(app) {
				return appComplete(app);
			});
		Lazy(completedApps).each(function(a) {
			var user = Meteor.users.findOne(a.user);
			if (user) {
				a.profile = user.profile;
				a.emails = user.emails;
			}
			a.appURL = Router.routes['admin-app-single'].path({_id: a._id});
			// if there are graders
			if (a.graders) {
				var grades = [];
				// limit to the first 3 graders
				for (var i = 0; i < 3; i++) {
					var grade = {};
					grade.class = 'grade' + (i + 1);
					if (a.graders[i]) {
						var graderId = a.graders[i],
							grader = Meteor.users.findOne(graderId);
						grade.status = 'assigned';
						grade.graderId = graderId;
						grade.grader = grader.emails[0].address;
					}
					grades.push(grade);
				}
				// if there are grades received
				if (a.grades) {
					for (var j = 0, numGrades = a.grades.length; j < numGrades; j++) {
						var grade = a.grades[j],
							g = _.findWhere(grades, {graderId: grade.grader});
						g.status = 'graded';
						g.score = calculateGrade(grade);
					}
				}
				a.displayGrades = grades;
			}
		});
		return {
			apps: completedApps.toArray()
		}
	}
});

Template['admin-apps'].rendered = function() {
	var listOptions = {
		valueNames: [
			'name',
			'email',
			'status',
			'date-created',
			'datecompleted',
			'grade1',
			'grade2',
			'grade3'
		],
		page: 20,
		searchClass: 'searchApps',
		// indexAsync: true,
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	var appList = new List('admin-apps', listOptions);
}
