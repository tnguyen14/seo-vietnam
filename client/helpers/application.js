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
		app;
	try {
		Meteor.call('currentApp', userId, function(err, app) {
			if (!err) {
				Session.set('currentApp', app);
			}
		});
	} catch(e) {
		nofify(e.message, 'warning', true);
	}

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
		app = Session.get('currentApp'),
		empty = [];
	_.each(required, function(field){
		if (!app[field]) {
			empty.push(field);
		}
	});

	if (empty.length) {
		console.log('app is incomplete');
		console.log(empty);
		return false;
	} else {
		console.log('app is complete');
		return true;
	}
};