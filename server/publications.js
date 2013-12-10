Meteor.publish('information', function(){
	return Information.find({});
});

Meteor.publish('applications', function(){
	return Applications.find({});
});