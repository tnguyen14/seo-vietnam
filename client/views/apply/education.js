Meteor.subscribe('information');

// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});

Template.education.rendered = function() {

}

Template.education.events = {
	'click .add-own-content .add': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-own-content').find('.add-content-wrap').toggleClass('hidden');
	},
	'click .add-content-button': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $wrap = $(e.target).closest('.add-content-wrap');
			$input = $('input', $wrap),
			value = $input.val(),
			slug = slugify(value),
			category = $input.data('category'),
			newInfo = {
				name: html_entity_encode(value),
				slug: slug
			},
			colleges = Information.find({category: 'college'}).fetch()[0].values,
			exists = false;

		for (var i = 0, len = colleges.length; i < len; i++) {
			if (colleges[i].slug === slug) {
				exists = true;
				break;
			}
		}
		if (exists) {
			$wrap.append('<label class="error-label">This college already exists. Please try again.</label>');
		} else {
			$wrap.remove('.error-label');
			Meteor.call('addInfo', category, newInfo, function(err, added) {
				if (added) {
					$input.val('');
					$wrap.append('<label class="success">Added!</label>');
					setTimeout(function() {
						$('.success').fadeOut(500).remove();
					}, 3000);
				}

			});
		}
	}
}

Template.education.majors = function() {
	return Information.find({category: 'major'}).fetch()[0].values;
};


Template.education.colleges = function() {
	return Information.find({category: 'college'}).fetch()[0].values;
};