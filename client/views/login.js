Template.login.events = {
	'click #login, click #start': function(e) {
		e.preventDefault();
		Meteor.Router.to('/apply');
	}
}