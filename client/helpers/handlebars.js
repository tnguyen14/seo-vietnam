// check if two parameters a and b are equivalent
// this helper can be used with the block helper if
// {{#if equal a b}}
// {{/if}}
Handlebars.registerHelper('equal', function(a, b) {
	if (a === b) {
		return true;
	}
	return false;
});

Handlebars.registerHelper('debug', function(stuff) {
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
	} else if (_.isArray(thing) && thing.length === 0) {
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

Handlebars.registerHelper('date', function(d, f) {
	if (d && d !== '') {
		var format = (_.isString(f)) ? f : 'ddd, MMM Do YYYY, h:mm a';
		return moment(d).zone('+0700').format(format);
	}
});

getName = function(collection, value) {
	var doc = Lazy(collection).find(function(d){
		return d.slug === value;
	});
	if (doc) {
		return doc.name;
	}
}
Handlebars.registerHelper('getName', function(collection, value) {
	return getName(collection, value);
})