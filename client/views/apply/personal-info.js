Meteor.subscribe('information');

Template['personal-info'].rendered = function() {
	console.log(Information.find().fetch());
	$("#personal-info").validate({
		rules: {
			first: "required",
			last: "required"
		}
	});
};

Template['personal-info'].countries = function() {
	console.log(Information.find().fetch());
	return Information.find({category: 'country'}).fetch()[0].values;
}