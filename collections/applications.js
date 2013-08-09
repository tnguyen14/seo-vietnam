Applications = new Meteor.Collection("applications");

Applications.allow({
	insert: function(userId) {
		return true;
	},
	update: function(userId) {
		return true;
	}
})