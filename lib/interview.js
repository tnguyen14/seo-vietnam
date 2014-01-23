interviewerAssignedApps = function (interviewerId) {
	var interviewer = Meteor.users.findOne(interviewerId);
	if (interviewer.interviewer && interviewer.interviewer.apps) {
		return _.pluck(interviewer.interviewer.apps, 'appId');
	} else {
		return [];
	}

}
interviewerAssignedUsers = function (interviewerId) {
	var interviewer = Meteor.users.findOne(interviewerId);
	if (interviewer.interviewer && interviewer.interviewer.apps) {
		return _.pluck(interviewer.interviewer.apps, 'applicantId');
	} else {
		return [];
	}
}