Template['personal-info'].rendered = function() {
	$("#personal-info").validate({
		rules: {
			first: "required",
			last: "required",
			'profile.phone': "phone"
		}
	});
};

Template['personal-info'].countries = function() {
	return getInfo('country');
}

Template['personal-info'].events = {
}