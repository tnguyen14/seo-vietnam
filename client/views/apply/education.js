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
			};
		$wrap.remove('.error-label');
		Meteor.call('addInfo', category, newInfo, Meteor.userId(), function(err, added) {
			if (err) {
				$wrap.append('<label class="error-label">' + err.reason + ' </label>');
			} else {
				if (added) {
					$wrap.remove('.error-label')
					$input.val('');
					$wrap.append('<label class="success-label">Added!</label>');
					// @TODO: this doesn't matter, as when the data changes, the template is refreshed.
					// Find another way to notify changes
					setTimeout(function() {
						$('.success-label').fadeOut(1000).remove();
					}, 3000);
				}
			}
		});
	}
}

Template.education.majors = function() {
	return Information.find({category: 'major'}).fetch()[0].values;
};


Template.education.colleges = function() {
	return Information.find({category: 'college'}).fetch()[0].values;
};