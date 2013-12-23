Meteor.subscribe('app');

var getSectionByName = function (name, sections) {
	return _.find(sections, function (el) {
		return name === el.name;
	});
}
var getSectionByIndex = function (index, sections) {
	return _.find(sections, function (el) {
		return index === el.index;
	})
}

// Rendered
Template.apply.rendered = function() {
	this.sections = getInfo('apply-sections');
	var current = Session.get('current'),
		currentSection = getSectionByName(current, this.sections),
		$submitButton = $('#app-submit');
	this.data.currentSection = currentSection;
	Session.set('currentSection', currentSection);
	// add active class
	$(".pagination li")
		.removeClass('active')
		.each(function(){
			if ($(this).data('name') === current) {
				$(this).addClass('active');
			}
		});

	$submitButton.addClass('hidden');

	// essay counter
	$('.essay').each(function() {
		$(this).find('textarea').simplyCountable({
			counter: $('.counter', this),
			countType: 'words',
			maxCount: 500
		});
	});

	// selectively hide fragment controls for first and last fragments
	$(".fragment-control").removeClass('hidden');

	if (!currentSection) {
		return;
	}
	if (currentSection.index === 1) {
		$(".fragment-control.prev").addClass('hidden');
	}
	if (currentSection.index === this.sections.length) {
		$(".fragment-control.next").addClass('hidden');
		// show submit button
		$submitButton.removeClass('hidden');
	}
};

//Template Events
Template.apply.events = {
	'click .fragment-control.prev .glyphicon': function(e, t) {
		e.preventDefault();
		var current = Session.get('current'),
			currentSection = Session.get('currentSection'),
			prev = getSectionByIndex(currentSection.index - 1, t.sections).slug;
		saveInputs(function () {
			Meteor.Router.to('/apply/' + prev);
		});
	},
	'click .fragment-control.next .glyphicon': function(e, t) {
		e.preventDefault();
		var current = Session.get('current'),
			currentSection = Session.get('currentSection'),
			next = getSectionByIndex(currentSection.index + 1, t.sections).slug;

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}
		saveInputs(function () {
			Meteor.Router.to('/apply/' + next);
		});

	},
	'click .pagination li': function(e) {
		e.preventDefault();
		// `this` is the context of of these li's
		var current = Session.get('current'),
			to = this.slug;
		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}

		saveInputs(function () {
			Meteor.Router.to('/apply/' + to);
		});
	},
	'click #app-save': function(e) {
		e.preventDefault();
		var current = Session.get('current');

		if (!$('#' + current).valid()) {
			return;
		}

		saveInputs(function () {
			notify({
				message: 'The application is saved successfully.',
				context: 'success',
				auto: true
			});
		}, function(err) {
			console.log(err);
			notify({message: 'Failed to save your application.'});
		});
	},
	'click #app-submit': function(e) {
		var app = currentApp();
		e.preventDefault();
		// check app ready one more time
		if (appReady()) {
			if (app.status !== 'completed') {
				Applications.update(app._id, {$set: {
					status: 'completed',
					completedAt: new Date()
				}}, function() {
					Meteor.Router.to('/completed');
				});
			} else {
				Meteor.Router.to('/profile');
			}
		} else {
			notify({
				message: 'Your application is incomplete.',
				auto: true
			});
		}
	},
	'click #view-profile': function(e) {
		e.preventDefault();
		Meteor.Router.to('/profile');
	},
	// add own content
	'click .add-own-content .add': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-own-content').find('.add-content-wrap').toggleClass('hidden');
	}
};

// Template Variables

Template.apply.fragments = function() {
	return getInfo('apply-sections');
}

Template.apply.current = function() {
	return Session.get('current');
}

Template.apply.currentSection = function() {
	return Session.get('currentSection');
}

Template.apply.app = function() {
	return currentApp();
}