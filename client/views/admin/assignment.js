function assignAppRecursive(graders, app) {
	var $output = $('.assignment-output');
	return Q.fcall(function() {
		if (graders.length <= 0) {
			$output.append('<li class="failure">' + 'No more graders found for app ' + app._id + '</li>');
			throw new Meteor.Error(400, 'No more graders found for app ' + app._id);
		} else {
			var grader = graders[0],
				apps = grader.grader.apps || [],
				limit = parseInt(grader.grader.limit, 10);
			// assign app to grader only if grader has not been assigned this app before and grader still within limit
			return Q.all([
				addAppToGrader(grader._id, app._id, app.user),
				addGraderToApp(app._id, grader._id)
			]).then(function(value) {
				$output.append('<li class="success">Successfully assigned <a href="/admin/apps/' + app._id + '">app</a> to <a href="/admin/graders/"' + grader._id + '">grader</a></li>')
				return value;
			}, function(reason) {
				// Lazy shift() method returns a new ArrayLikeSequence with the same elements as this one, minus the first element.
				return assignAppRecursive(Lazy(graders).shift().toArray(), app);
			});
		}
	});
}

assignApps = function (location, profession) {
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
		}).toArray(),
		$output = $('.assignment-output');
		console.log(appsToAssign.length);
	var assignment = appsToAssign.reduce(function (appPromise, app) {
		return appPromise.then(function(value) {
			if (value === 0) {
				$output.append('<h3>Assigning apps for location <strong>' + location + '</strong> and profession <strong>' + profession + '</strong>');
			}
			return assignAppRecursive(graders, app);
		}, function(reason) {
		});
	}, Q(0));

	return assignment.then(function(value) {
		$output.append('<h3>Done for this section</h3>');
	}, function(reason) {
		console.log(reason);
	});
}