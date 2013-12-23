Meteor.publish('information', function(){
	return Information.find({});
});

Meteor.publish('app', function(){
	return Applications.find({user: this.userId});
});