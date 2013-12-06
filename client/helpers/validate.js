$.validator.setDefaults({
	errorClass: 'error-label control-label',
	highlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-success').addClass('has-error');
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-error').addClass('has-success');
	}
});

// Validate a maximum number of words
$.validator.addMethod("maxWord", function(value, element, params) {
	return this.optional(element) || $.trim(value).split(/\s+/).length <= params;
}, 'Word limit exceeded.');

// Validate only digits (for phone number)
$.validator.addMethod("phone", function(value, element) {
	// remove white space, parenthesis and hyphens
	value = value.replace(/[\s()-]+/g, '');
	return this.optional(element) || value.match(/^\d+$/);
}, 'Please enter a valid phone number');