Meteor.startup(function () {
	// start with some dummy colleges
	Colleges.remove({});
	Majors.remove({});
	if (Colleges.find().count() === 0) {
		Colleges.insert({
			name: "Wheaton College",
			slug: "wheatonma"
		});
		Colleges.insert({
			name: "New York University",
			slug: "wheatonma"
		});
		Colleges.insert({
			name: "Stonehill College",
			slug: "stonehill"
		});
	}
	// and some majors too
	if (Majors.find().count() === 0) {
		Majors.insert({
			name: "Computer Science",
			slug: "cs"
		});
		Majors.insert({
			name: "Philosophy",
			slug: "philosophy"
		});
		Majors.insert({
			name: "Psychology",
			slug: "psychology"
		});
	}
	if (Languages.find().count() === 0) {
		Languages.insert({
			name: "Vietnamese",
			slug: "vietnamese"
		});
		Languages.insert({
			name: "English",
			slug: "english"
		});
	}
	if (Countries.find().count() === 0) {
		Countries.insert({
			name: "Vietnam",
			slug: "vietnam"
		});
		Countries.insert({
			name: "United States",
			slug: "us"
		});
	}
	if (Meteor.users.find().count() === 0) {
		FakeUsers.remove({});
		FakeUsers.insert({
			_id: "1",
			name: "Tri Nguyen"
		});
	}
});

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

Meteor.publish('applications', function(){
	return Applications.find({});
});

Meteor.publish('fake-users', function(){
	return FakeUsers.find();
});