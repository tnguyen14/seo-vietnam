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
			'graduation-date',
			'major',
			'essay-community',
			'essay-leadership',
			'essay-passion',
			'files.resume'
		],
		app = currentApp(),
		empty = [];
	_.each(required, function(field){
		// parse the dot notation
		var value = app,
			path = field.split('.');
		while (path.length !== 0) {
			if (!value) {
				break;
			}
			value = value[path.shift()];
		}
		if (_.isEmpty(value)) {
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