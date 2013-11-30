Template['add-own-content'].events = {
	'click .add-content-button': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $wrap = $(e.target).closest('.add-content-wrap');
			$input = $('input', $wrap),
			value = $input.val().trim(),
			category = $input.data('category'),
			newInfo = {
				name: html_entity_encode(value),
				slug: slugify(value),
				addedBy: Meteor.userId(),
				verified: false
			};

		// quit if nothing is entered
		if (value === '') {
			return;
		}

		Meteor.call('addInfo', category, newInfo, function(err, added) {
			if (err) {
				notify(err.reason, 'danger', true);
			} else {
				if (added) {
					$input.val('');
					clearNotifications('danger');
					notify('Successfully added your option.', 'success', true);
				}
			}
		});
	}
}