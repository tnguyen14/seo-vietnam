Template.completed.events = {
	'click .review': function(e) {
		e.preventDefault();
		Meteor.Router.to('/profile');
	}
}