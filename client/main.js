Handlebars.registerHelper("isEqual", function(a, b, options){
	console.log(options);
	console.log(a);
	console.log(b);
	if (a === b) {
		return options.fn(this);
	}
	return options.inverse(this);
});

Handlebars.registerHelper("debug", function(stuff){
	console.log(stuff);
})