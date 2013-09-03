Meteor.subscribe('fake-users');

Template.login.events = {
	'click #login, click #start': function(e) {
		e.preventDefault();
		var target = e.target,
			userId = Session.get("userId");
		if (Applications.find({'user': userId}).count() === 0 ){
			console.log('creating new application');
			Applications.insert({'user': userId});
		}
		var context = $(target).closest('form');
		// save email for now
		saveFormGroups(context, FakeUsers, userId);
		Meteor.Router.to('/apply');
	}
}