var _addInfo = function (category, doc, userId) {
	var currentCursor = Information.find({category: category});
	if ( currentCursor.count() > 0 ) {
		var currentValues = currentCursor.fetch()[0].values;
		// This is a slow way to do it
		_.each(currentValues, function(value) {
			if (doc.slug === value.slug || doc.name === value.name) {
				throw new Meteor.Error(400, 'This document already exists.');
				return false;
			}
		});
	}

	_.extend(doc, {addedBy: userId});
	Information.update(
		{ category: category },
		{ $addToSet: { values: doc } },
		{ upsert: true }
	);
	return true;
}

var _loadDefault = function(category) {
	var data = JSON.parse(Assets.getText(category + '.json')).values;
	_.each(data, function(d) {
		if (!d.slug) {
			d.slug = slugify(d.name);
		}
		try {
			_addInfo(category, d, 0);
		} catch (e) {
			// console.log(e);
		}
	});
}

Meteor.methods({
	'addInfo': _addInfo
});

Meteor.startup(function () {
	// load default information
	[
		'college',
		'major',
		'profession',
		'industry',
		'language',
		'country'
	].map(_loadDefault);

});