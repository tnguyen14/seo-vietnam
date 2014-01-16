AdminController = RouteController.extend({
	waitOn: function() {
		return [
			Meteor.subscribe('allApps'),
			Meteor.subscribe('allUsers')
		];
	},
	data: function() {
		var totalApps = Applications.find().fetch(),
			submittedApps = Lazy(totalApps).filter(function(app) {
				return app.status === 'completed';
			}),
			completedApps = Lazy(totalApps).filter(function(app) {
				return appComplete(app);
			});
		return {
			totalApps: totalApps.length,
			submittedApps: submittedApps.size(),
			completedApps: completedApps.size(),
			numUsers: Meteor.users.find().count()
		}
	}
});

appComplete = function (app) {
	var empty = [],
		required = ['essay.one', 'essay.two', 'essay.three', 'essay.four', 'files.resume'];
	Lazy(required).each(function(field){
		// parse the dot notation
		var value = app,
			path = field.split('.');
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
		return false;
	} else {
		return true;
	}
}

function assignAppRecursive(graders, app) {
	var dfd = Q.defer();
	if (graders.length <= 0) {
		dfd.reject(new Meteor.Error('No more graders found for app ' + app._id));
	} else {
		var grader = graders.shift(),
			apps = grader.grader.apps || [],
			limit = parseInt(grader.grader.limit, 10);
		// assign app to grader only if grader has not been assigned this app before and grader still within limit
		if (!Lazy(apps).findWhere({appId: app._id}) && apps.length < limit) {
			return Q.all([
				addAppToGrader(grader._id, app._id, app.user),
				addGraderToApp(app._id, grader._id)
			]).then(function(value) {
				return value;
			}, function(reason) {
				assignAppRecursive(graders, app);
			});
		} else {
			assignAppRecursive(graders, app);
		}
	}
	return dfd.promise;
}
// insert app to any graders in the array, starting with the first one
function assignApp(app, graders) {
	graders = graders.slice();
	return assignAppRecursive(graders, app);
}

function assignAppsRecursive (apps, graders) {
	var dfd = Q.defer(),
		$output = $('.assignment-output'),
		app;
	if (apps.length <= 0) {
		dfd.reject('No more apps!');
	} else {
		app = apps.shift();
		assignApp(app, graders).then(function(value) {
			if (value)
				$output.append('<li class="success">Assigned app ' + value[1] + ' to grader ' + value[0] + '</li>');
			else
				$output.append('<li class="success">Assigned app, but returned undefined</li>');
			return assignAppsRecursive(apps, graders);
		}, function(reason) {
			$output.append('<li class="failure">' + reason.error + '</li>');
		});
	}
	return dfd.promise;
}

function startAssigning (location, profession) {
	var graders = Meteor.users.find({roles: 'grader', 'grader.location': location, 'grader.profession': profession}).fetch(),
		completedApps = Applications.find({
			status: 'completed',
			location: location,
			$or: [
				{'profession_type': profession},
				{'profession_type': 'both'}
			]
			}).fetch(),
		// only assign graders to apps with 0 or 1 graders
		appsToAssign = Lazy(completedApps).filter(function(a) {
			return (!a.graders || a.graders.length < 2);
		}).toArray();
	assignAppsRecursive(appsToAssign, graders).then(function(value){
		console.log(value);
	}, function(reason) {
		console.log(reason);
	}).fin(function() {
			notify({
				message: 'Done assigning apps',
				context: 'success'
			})
		}).done();
}

Template['admin-stats'].events = {
	'click #assign-apps': function() {
		startAssigning('local', 'business');
	}
};

Template['admin-menu'].events = {
	'click .nav-icon': function() {
		if ($('.main-container').hasClass('menu-active')) {
			$('.overlay').unbind().remove();
		} else {
			setTimeout(function(){
				$('<div class="overlay"></div>').prependTo('.main-container');
			}, 200);
		}
		$('.main-container').toggleClass('menu-active');
		$('.nav-icon').toggleClass('active');
	}
}