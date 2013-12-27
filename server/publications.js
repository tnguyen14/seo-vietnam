Meteor.publish('information', function() {
	return Information.find({});
});

Meteor.publish('app', function() {
	return Applications.find({user: this.userId});
});

Meteor.publish('allApps', function() {
	if (isAdminById(this.userId)) {
		return Applications.find({});
	}
	return [];
})

Meteor.publish('userData', function() {
	return Meteor.users.find({_id: this.userId},
	{
		fields: {
			'roles': 1
		}
	});
});

Meteor.publish('allUsers', function() {
	if (isAdminById(this.userId)) {
		return Meteor.users.find({});
	}
	return [];
})