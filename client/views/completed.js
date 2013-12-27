Template.completed.events = {
	'click .review': function(e) {
		e.preventDefault();
		Router.go('profile');
	}
}