Handlebars.registerHelper("isEqual", function(a, b, options){
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper("debug", function(stuff){
	console.log(stuff);
});

Session.set("userId", 1);