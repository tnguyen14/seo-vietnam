AdminGradersController = RouteController.extend({
	template: 'admin-graders',
	waitOn: function() {
		return Meteor.subscribe('allGraders');
	},
	data: function() {
		var graders = Meteor.users.find({roles: 'grader'}).fetch();
		Lazy(graders).each(function(u) {
			u.profileURL = Router.routes['admin-grader-single'].path({_id: u._id});
		});
		return {
			graders: graders
		}
	}
});

Template['admin-graders'].rendered = function() {
	var listOptions = {
		valueNames: [
			'name',
			'email',
			'location',
			'profession',
			'limit',
			'apps-assigned'
		],
		page: 20,
		searchClass: 'searchGraders',
		plugins: [
			ListPagination({
				outerWindows: 2
			})
		]
	};
	var graderList = new List('admin-graders', listOptions);
}