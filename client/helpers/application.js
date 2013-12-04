// application stuff

newApplication = function (cb) {
	var userId = Meteor.userId(),
		appId;
	if (!userId) {
		console.log('User is not logged in');
		return;
	}
	try {
		Meteor.call('createApp', Meteor.userId(), function() {
			cb(appId);
		});
	} catch(e) {
		notify(e.message, 'warning', true);
	}
}

currentApp = function() {
	var userId = Meteor.userId(),
		count = Applications.find({user: userId}).count();
	if (count === 0) {
		notify('No application found for this user.', 'warning', true, true);
	}
	return Applications.find({user:userId}).fetch()[0];
}

// Check whether application is ready for submit
appReady = function(){
	var required = [
			'college',
			'major',
			'essay-community',
			'essay-leadership',
			'essay-passion'
		],
		app = currentApp(),
		empty = [];
	_.each(required, function(field){
		if (!app[field]) {
			empty.push(field);
		}
	});

	if (empty.length) {
		console.log(empty);
		return false;
	} else {
		return true;
	}
};