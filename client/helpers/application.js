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

currentApp = function() {
	var userId = Meteor.userId(),
	 	appCursor = Applications.find({"user": userId});
	if (appCursor.count() === 0) {
		console.log('no application found');
		throw new Error(400, 'No Application Found');
		return ;
	} else if (appCursor.count() > 1){
		console.log('apps found: ' + appCursor.count());
		return Applications.findOne({"_id": appId});
		// @TODO: handle when there are duplicate applications for a user
	} else {
		// cursor fetch returns an array
		return appCursor.fetch()[0];
	}
}