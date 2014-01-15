AdminGradersController = RouteController.extend({
	template: 'admin-users',
	waitOn: function() {
		return Meteor.subscribe('allGraders');
	},
	data: function() {
		var graders = Meteor.users.find({roles: 'grader'}).fetch();
		Lazy(graders).each(function(u) {
			u.profileURL = Router.routes['admin-grader-single'].path({_id: u._id});
		});
		return {
			users: graders
		}
	}
});