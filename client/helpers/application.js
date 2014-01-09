// application stuff

newApplication = function (userId, cb) {
	// if only 1 argument is passed in, and that is a function, use it as callback
	if (_.isFunction(userId)) {
		cb = userId;
	}
	if (!userId || !_.isString(userId)) {
		userId = Meteor.userId();
	}
	// If still don't know what the userId is at this point, quit!
	if (!userId) {
		console.log('User is not logged in');
		return;
	}
	Meteor.call('createApp', userId, function(err, res) {
		if (err) {
			if (cb) {
				cb(err);
			} else {
				console.log(err);
			}
		} else {
			if (cb) {
				cb(null, res);
			} else {
				console.log('successfully created new app ' + res);
			}
		}
	});
}

currentApp = function() {
	var userId = Meteor.userId(),
		count = Applications.find({user: userId}).count();
	if (count === 0) {
		notify({
			message: 'No application found for this user.',
			auto: true
		});
		return {};
	}
	return Applications.find({user:userId}).fetch()[0];
}

// Check whether application is ready for submit
appReady = function(app){
	var empty = [],
		required = [
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
		];
	if (!app) {
		app = currentApp();
	}
	Lazy(required).each(function(field){
		// parse the dot notation
		var value = app,
			path = field.slug.split('.');
		while (path.length !== 0) {
			if (!value) {
				break;
			}
			value = value[path.shift()];
		}
		if (Lazy(value).isEmpty()) {
			empty.push(field);
		}
	});

	if (empty.length > 0) {
		// build the list of missing fields to notify
		var message = 'Missing fields: <ul>';
		Lazy(empty).each(function(field) {
			message += '<li><a href="' + field.url + '">' + field.name + '</a></li>';
		});
		message += '</ul>';
		notify({message: message});
		return false;
	} else {
		return true;
	}
};