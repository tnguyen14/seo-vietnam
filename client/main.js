Handlebars.registerHelper("isEqual", function(a, b, options){
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper("debug", function(stuff){
	console.log(stuff);
});

// Ink filepicker
// https://developers.inkfilepicker.com/docs/web/

filepicker.setKey('AgUpiTHwT3q7FAiauT4TQz');