InterviewAppSingleController = RouteController.extend({
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