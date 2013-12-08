var createApp = function (userId) {
	var appId,
		count = Applications.find({user: userId}).count();
	if (count === 0) {
		appId = Applications.insert({
			user: userId,
			status: 'started',
			createdAt: new Date()
		});
	} else {
		throw new Error(400, 'Application already exists for this user');
	}
	return appId;
}

var currentApp = function (userId) {
	var count = Applications.find({user: userId}).count();
	if (count === 0) {
		throw new Error(400, 'Application not found');
	}
	return Applications.find({user: userId}).fetch()[0];
}

Meteor.methods({
	'createApp': createApp,
	'currentApp': currentApp
})