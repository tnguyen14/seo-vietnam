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
				return appReady(app);
			});
		return {
			totalApps: totalApps.length,
			submittedApps: submittedApps.size(),
			completedApps: completedApps.size(),
			numUsers: Meteor.users.find().count()
		}
	}
});

function appReady(app) {
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