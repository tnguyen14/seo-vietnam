// Save inputs

collectInputs = function(ctx) {
	var field = {};

	$(['input[type="text"]',
		'input[type="number"]',
		'input[type="email"]',
		'input[type="tel"]',
		'textarea',
		'select',
		'input[type="radio"]:checked'
	].join(', '), ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val().trim();
		value = html_entity_encode(value);
		// convert to array if name already exists
		if (field[name]) {
			if (! _.isArray(field[name])){
				field[name] = [field[name]];
			}
			field[name].push(value);
		} else {
			field[name] = value;
		}
	});

	// checkboxes are saved as array of values
	$('input[type="checkbox"]:checked', ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val();
		value = html_entity_encode(value);
		field[name] = field[name] || [];
		field[name].push(value);
	});
	return field;
};

// save inputs in the current section by groups
// use jQuery Deferred success and failure callback styles
saveInputs = function (doneCb, failCb) {
	// save personal information to the user collection
	var current = Session.get('current'),
		$ctx = $('#' + current),
		inputGroups = [],
		docId = (current === 'personal-info') ? Meteor.userId() : currentApp()._id,
		collection = (current === 'personal-info') ? Meteor.users : Applications;

	// collect inputs in groups and save them to array
	$('.form-group', $ctx).each(function () {
		var group = {},
			field = collectInputs(this),
			name = $(this).attr('name');
		if (name) {
			group[name] = field;
		} else {
			group = field;
		}
		inputGroups.push(group);
	});

	// map inputGroups elements to function to save them to collection
	// use jQuery promise to apply doneCb when all groups have been saved
	$.when.apply($, $.map(inputGroups, function(group) {
		var dfd = new jQuery.Deferred();
		collection.update(docId, {$set: group}, function(err, res) {
			// if there's no error, result is the number of documents affected
			if (err) {
				dfd.reject(err);
			} else {
				dfd.resolve();
			}
		});
		return dfd.promise();
	})).done(function() {
		if (doneCb) doneCb();
	}).fail(function(err) {
		if (failCb) failCb(err);
	});

}