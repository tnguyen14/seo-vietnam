Meteor.publish('information', function(){
	return Information.find();
});

Meteor.publish('applications', function(){
	return Applications.find({});
});

Meteor.methods({
	'addInfo': function (category, doc) {
		_.extend(doc, {addedBy: this.userId});
		Information.update(
			{ category: category },
			{ $addToSet: { values: doc } }
		);
		return true;
	}
});