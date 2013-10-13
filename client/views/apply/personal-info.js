Meteor.subscribe('information');

Template['personal-info'].rendered = function() {
	$("#personal-info").validate({
		rules: {
			first: "required",
			last: "required"
		}
	});
};

Template['personal-info'].countries = function() {
	return Information.find({category: 'country'}).fetch()[0].values;
}