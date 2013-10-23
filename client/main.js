var isArray = Array.isArray;

Handlebars.registerHelper('isEqual', function(a, b, options){
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper('debug', function(stuff){
	console.log(stuff);
});

Handlebars.registerHelper('text', function(string) {
	if (!string) {
		return;
	}
	return nl2br(html_entity_decode(string));
})
// checkbox checked
Handlebars.registerHelper('checked', function (slug, values) {
	if (_.contains(values, slug)) {
		return 'checked';
	}
});
Handlebars.registerHelper('selected', function(slug, value) {
	if (slug === value) {
		return 'selected';
	}
});

Handlebars.registerHelper('isEmpty', function(thing, options) {
	var empty;
	if (!thing && thing !== 0) {
		empty = true;
	} else if (isArray(thing) && thing.length === 0) {
		empty = true;
	} else if (typeof thing === 'object') {
		empty = true;
		for (var key in thing) {
			if (hasOwnProperty.call(thing, key)) {
				empty = false;
			}
		}

	} else {
		empty = false;
	}

	if (empty) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

// Ink filepicker
// https://developers.inkfilepicker.com/docs/web/

filepicker.setKey('AgUpiTHwT3q7FAiauT4TQz');