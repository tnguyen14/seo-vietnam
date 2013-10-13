Meteor.subscribe('colleges');
Meteor.subscribe('majors');

// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});

Template.education.events = {
	'click .add-own-content .add': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-own-content').find('.add-content-wrap').toggleClass('hidden');
	},
	'click .add-content-button': function(e) {
		e.preventDefault();
		var $wrap = $(e.target).closest('.add-content-wrap');
			$input = $('input', $wrap),
			value = $input.val(),
			slug = slugify(value);
		var college = Colleges.find({'slug': slug});
		if (college.count() > 0) {
			$wrap.append('<label class="error-label">This college already exists. Please try again.</label>');
		} else {
			$wrap.remove('.error-label');
			Colleges.insert({'name': html_entity_encode(value), 'slug': slug}, function(){
				$input.val('');
				$wrap.append('<label class="success">Added!</label>')
					.delay(1000)
					.fadeOut(500, function() {
					$(this).remove();
				});
			});
		}
	}
}

Template.education.majors = function() {
	return Majors.find();
};


Template.education.colleges = function() {
	return Colleges.find();
};