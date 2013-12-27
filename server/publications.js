Meteor.publish('information', function(){
	return Information.find({});
});

Meteor.publish('app', function(){
	return Applications.find({user: this.userId});
});

Meteor.publish("userData", function () {
	return Meteor.users.find({_id: this.userId},
	{
		fields: {
			'roles': 1
		}
	});
});