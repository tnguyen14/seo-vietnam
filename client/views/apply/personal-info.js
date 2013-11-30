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
	return getInfo('country');
}

Template['personal-info'].events = {
	'change #dialing-code': function(e) {
		var $this = $(e.target);
		if($this.val() === 'other') {
			console.log('other!');
			// $this.after('<input type="text" name="dialing-code" class="form-control"/>');
		}
	}
}