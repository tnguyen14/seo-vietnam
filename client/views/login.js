Template.login.events = {
	'click #login, click #start': function(e) {
		e.preventDefault();
		var userId = Session.get("userId");
		if (Applications.find({'user': userId}).count() === 0 ){
			console.log('creating new application');
			Applications.insert({'user': userId});
		}
		Meteor.Router.to('/apply');
	}
}