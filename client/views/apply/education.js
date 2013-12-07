Template.education.rendered = function() {
	var currentYear = new Date().getFullYear(),
		maxYear = currentYear + 8;
	$("#education").validate({
		rules: {
			'graduation-date': {
				range: [currentYear, maxYear]
			}
		},
		messages: {
			'graduation-date': {
				range: 'Please enter a valid graduation year'
			}
		}
	});
}

Template.education.majors = function() {
	return getInfo('major');
};

Template.education.colleges = function() {
	return getInfo('college');
};