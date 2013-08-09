Meteor.subscribe('applications');

var userId, user, name, email;

function user() {
	var userId = Session.get('userId');
	console.log(userId);
	return Applications.findOne({user: userId});;
}


Template.profile.helpers({
	user: function(){
		return Applications.findOne({user: Session.get('userId')});
	},
	name: function() {
		return this.firstname + " " + this.lastname;
	}
});