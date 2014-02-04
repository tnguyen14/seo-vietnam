AdminInterviewersController = RouteController.extend({
	template: 'admin-interviewers',
	waitOn: function() {
		return Meteor.subscribe('allInterviewers');
	},
	data: function() {
		var interviewers = Meteor.users.find({roles: 'interviewer'}).fetch();
		Lazy(interviewers).each(function(u) {
			u.profileURL = Router.routes['admin-interviewer-single'].path({_id: u._id});
			if (!u.interviewer) {
				return;
			}
			if (u.interviewer.apps && u.interviewer.apps.length > 0) {
				Lazy(u.interviewer.apps).each(function(a) {
					a.appURL = Router.routes['admin-app-single'].path({_id: a.appId});
				});
			}
		});
		return {
			interviewers: interviewers
		}
	}
});

Template['admin-interviewers'].rendered = function() {
	var listOptions = {
		valueNames: [
			'name',
			'email',
			'location',
			'profession',
			'app-assigned'
		],
		page: 20,
		searchClass: 'searchInterviewers',
		plugins: [
			ListPagination({
				outerWindows: 2
			})
		]
	};
	var graderList = new List('admin-interviewers', listOptions);
}