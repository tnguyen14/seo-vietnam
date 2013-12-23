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
		notify({message: e.message});
	}
}

currentApp = function() {
	var userId = Meteor.userId(),
		count = Applications.find({user: userId}).count();
	if (count === 0) {
		notify({
			message: 'No application found for this user.',
			auto: true
		});
	}
	return Applications.find({user:userId}).fetch()[0];
}

// Check whether application is ready for submit
appReady = function(){
	var required = [
			{
				'slug': 'college',
				'name': 'College',
				'url': '/apply/education'
			}, {
				'slug': 'graduation-date',
				'name': 'Graduation Date',
				'url': '/apply/education'
			}, {
				'slug': 'major',
				'name': 'Major',
				'url': '/apply/education'
			}, {
				'slug': 'essay.one',
				'name': 'Essay One',
				'url': '/apply/essay-one'
			}, {
				'slug': 'essay.two',
				'name': 'Essay Two',
				'url': '/apply/essay-two'
			}, {
				'slug': 'essay.three',
				'name': 'Essay Three',
				'url': '/apply/essay-three'
			}, {
				'slug': 'essay.four',
				'name': 'Essay Four',
				'url': '/apply/essay-four'
			}, {
				'slug': 'files.resume',
				'name': 'Resume',
				'url': '/apply/files'
			}
		],
		app = currentApp(),
		empty = [];
	_.each(required, function(field){
		// parse the dot notation
		var value = app,
			path = field.slug.split('.');
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

	if (empty.length > 0) {
		// build the list of missing fields to notify
		var message = 'Missing fields: <ul>';
		_.each(empty, function(field) {
			message += '<li><a href="' + field.url + '">' + field.name + '</a></li>';
		});
		message += '</ul>';
		notify({message: message});
		return false;
	} else {
		return true;
	}
};