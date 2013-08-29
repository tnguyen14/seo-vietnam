Meteor.subscribe('applications');

var userId, user, name, email;

function user() {
	var userId = Session.get('userId');
	return Applications.findOne({user: userId});;
}


Template.profile.helpers({
	user: function(){
		return Applications.findOne({user: Session.get('userId')});
	},
	name: function() {
		return this.firstname + " " + this.lastname;
	},
	college: function() {
		return Colleges.findOne({slug: this.college}).name;
	}
});

Template.profile.colleges = function() {
	return Colleges.find();
}