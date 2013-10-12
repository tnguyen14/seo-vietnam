// application stuff

newApplication = function () {
	if (!Meteor.userId()) {
		throw new Meteor.Error(401, 'User is not logged in');
	}
	var appId = Applications.insert({
		user: Meteor.userId(),
		status: 'started'
	});
	return appId;
}