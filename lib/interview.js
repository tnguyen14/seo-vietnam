interviewerAssignedApps = function (graderId) {
	var grader = Meteor.users.findOne(graderId);
	if (grader.grader && grader.grader.apps) {
		return _.pluck(grader.grader.apps, 'appId');
	} else {
		return [];
	}

}
interviewerAssignedUsers = function (graderId) {
	var grader = Meteor.users.findOne(graderId);
	if (grader.grader && grader.grader.apps) {
		return _.pluck(grader.grader.apps, 'applicantId');
	} else {
		return [];
	}
}