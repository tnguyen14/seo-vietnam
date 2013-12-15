Template.education.rendered = function() {
	var currentYear = new Date().getFullYear(),
		minYear = currentYear - 2,
		maxYear = currentYear + 8;
	$("#education").validate({
		rules: {
			'graduation-date': {
				range: [minYear, maxYear]
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