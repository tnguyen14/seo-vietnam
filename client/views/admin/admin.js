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

function assignAppToGrader(graderId, callback) {
	setTimeout(function() {
		return callback();
	}, 20);
}
Template['admin-stats'].events = {
	'click #assign-apps': function() {
		// get all graders and completed apps
		var graders = Meteor.users.find({roles: 'grader'}).fetch(),
			completedApps = Applications.find({status: 'completed'}).fetch(),
			// only assign graders to apps with 0 or 1 graders
			appsToAssign = Lazy(completedApps).filter(function(a) {
				return (!a.graders || a.graders.length < 2);
			}).toArray(),
			appIndex = 0;
		Lazy(graders).each(function(g) {
			var graderId = g._id,
				// number of apps already assigned to grader
				currentAssignedApps = g.grader.apps || [],
				limit = parseInt(g.grader.limit, 10) || 0,
				i;
			for (i = currentAssignedApps.length; i <= limit; i++) {
				var app = appsToAssign[appIndex];
				console.log(appIndex);
				assignAppToGrader(graderId, function() {
					appIndex++;
					console.log(appIndex);
				});
			}
		});
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