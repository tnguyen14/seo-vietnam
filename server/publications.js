Meteor.publish('colleges', function(){
	return Colleges.find();
});

Meteor.publish('majors', function(){
	return Majors.find();
});

Meteor.publish('languages', function(){
	return Languages.find();
});

Meteor.publish('countries', function(){
	return Countries.find();
});

Meteor.publish('industries', function(){
	return Industries.find();
});

Meteor.publish('functions', function(){
	return Functions.find();
});


Meteor.publish('applications', function(){
	return Applications.find({});
});

Meteor.publish('fake-users', function(){
	return FakeUsers.find();
});