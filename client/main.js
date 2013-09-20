var isArray = Array.isArray;

Handlebars.registerHelper("isEqual", function(a, b, options){
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper("debug", function(stuff){
	console.log(stuff);
});

Handlebars.registerHelper("isEmpty", function(thing, options) {
	var isEmpty;
	if (!thing && thing !== 0) {
		isEmpty = true;
	} else if (isArray(thing) && thing.length === 0) {
		isEmpty = true;
	} else if (typeof thing === 'object') {
		for (var key in thing) {
			if (hasOwnProperty.call(thing, key)) {
				isEmpty = false;
			}
		}
		isEmpty = true;
	} else {
		isEmpty = false;
	}

	if (isEmpty) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

// Ink filepicker
// https://developers.inkfilepicker.com/docs/web/

filepicker.setKey('AgUpiTHwT3q7FAiauT4TQz');