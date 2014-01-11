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
getInfoName = function(category, value) {
	if (Information.find({category: category}).count() === 0) {
		return;
	}
	return getName(Information.find({category: category}).fetch()[0].values, value);
}
getAppValue = function(app, field, category) {
	var html = '',
	// default category to field name
	category = _.isString(category) ? category : field,
	value;
	if (!app) {
		return;
	}
	value = app[field];

	if (_.isArray(value)) {
		html += '<span class="list-group">';
		_.each(value, function(val) {
			html+= '<span class="list-item">' + getInfoName(category, val) + '</span>';
		});
		html += '</span>'
	} else {
		html = getInfoName(category, value);
	}
	return html;
}

Handlebars.registerHelper('getName', function(collection, value) {
	return getName(collection, value);
});

Handlebars.registerHelper('getInfoName', function(category, value) {
	return getInfoName(category, value);
});

// Assume user object as context
Handlebars.registerHelper('displayname', function() {
	if (this.profile && this.profile.name) {
		return this.profile.name.first + ' ' + this.profile.name.last;
	}
});

Handlebars.registerHelper('email', function() {
	return this.emails[0].address;
});

// Assume app object as context
Handlebars.registerHelper('getAppValue', function(field, category) {
	return getAppValue(this, field, category);
})
