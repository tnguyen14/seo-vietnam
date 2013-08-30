FakeUsers = new Meteor.Collection("fake-users");

FakeUsers.allow({
	update: function(userId) {
		return true;
	}
});