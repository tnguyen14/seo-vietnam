Meteor.subscribe('applications');

var applySections = [
	{
		index: 1,
		name: 'personal-info'
	}, {
		index: 2,
		name: 'education'
	}, {
		index: 3,
		name: 'qualifications'
	}, {
		index: 4,
		name: 'professional'
	}, {
		index: 5,
		name: 'passion'
	}, {
		index: 6,
		name: 'community'
	}, {
		index: 7,
		name: 'leadership'
	}, {
		index: 8,
		name: 'resume'
	}
];

$.validator.setDefaults({
	errorClass: 'error-label control-label',
	highlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-success').addClass('has-error');
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-error').addClass('has-success');
	}
});

Template.apply.fragments = function() {
	return applySections;
}

var getIndex = function(el) {
	var i = -1;
	applySections.forEach(function(element, index) {
		if (el === element.name) {
			i = index;
		}
	});
	return i;
}

var navigate = function() {
	var to = Session.get('applySection');
	if (!to) {
		to = "personal-info";
		Session.set('applySection', to);
	}

	// add active class
	$(".pagination li")
		.removeClass('active')
		.each(function(){
			var name = $(this).data('name');
			if (name === to) {
				$(this).addClass('active');
			}
		});

	// selectively hide fragment controls for first and last fragments
	$(".fragment-control").removeClass('hidden');
	var toIndex = getIndex(to);
	if (toIndex === 0) {
		$(".fragment-control.prev").addClass('hidden');
	} else if (toIndex === applySections.length - 1) {
		$(".fragment-control.next").addClass('hidden');
	}
}

// Check whether application is ready for submit
var appReady = function(){
	var required = [
			'college',
			'major',
			'essay-community',
			'essay-leadership',
			'essay-passion'
		],
		app = currentApp(),
		empty = [];
	_.each(required, function(field){
		if (!app[field]) {
			empty.push(field);
		}
	});

	if (empty.length) {
		console.log('app is incomplete');
		console.log(empty);
		return false;
	} else {
		console.log('app is complete');
		return true;
	}
};

// Rendered
Template.apply.rendered = function() {
	if (!Meteor.user()) {
		Meteor.Router.to('/login');
	}
	navigate();

	$("#passion textarea").simplyCountable({
		counter: '#passion-counter',
		countType: 'words',
		maxCount: 500
	});
	$("#community textarea").simplyCountable({
		counter: '#community-counter',
		countType: 'words',
		maxCount: 500
	});
	$("#leadership textarea").simplyCountable({
		counter: '#leadership-counter',
		countType: 'words',
		maxCount: 500
	});

	var $submitButton = $('#app-submit');
	if (Session.get('applySection') === 'resume') {
		$submitButton.removeClass('hidden');
		if (appReady()) {
			$submitButton.removeClass('disabled');
		} else {
			$submitButton.addClass('disabled');
		}
	} else {
		$submitButton.addClass('hidden');
	}
};

//Template Events
Template.apply.events = {
	'click .fragment-control.prev .glyphicon': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current),
			prev = (currentIndex === 0) ? current : applySections[currentIndex-1].name;

		saveInputs();

		// navigate away!
		Meteor.Router.to('/apply/' + prev);
	},
	'click .fragment-control.next .glyphicon': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current),
			next = applySections[currentIndex+1].name;

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}
		saveInputs();

		Meteor.Router.to('/apply/' + next);
	},
	'click .pagination li': function(e) {
		e.preventDefault();
		// `this` is the context of of these li's
		var current = Session.get('applySection'),
			to = this.name;

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}

		saveInputs();

		// Session.set('applySection', to);
		Meteor.Router.to('/apply/' + to);
		navigate();
	},
	'click #logout': function(e) {
		e.preventDefault();
		Meteor.logout(function(err) {
			if (err) {
				console.log(err);
			} else {
				Meteor.Router.to('/');
			}
		});
	},
	'click #app-save': function(e) {
		e.preventDefault();
		saveInputs();
	},
	// add own content
	'click .add-own-content .add': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-own-content').find('.add-content-wrap').toggleClass('hidden');
	},
	'click .add-content-button': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $wrap = $(e.target).closest('.add-content-wrap');
			$input = $('input', $wrap),
			value = $input.val().trim(),
			category = $input.data('category'),
			newInfo = {
				name: html_entity_encode(value),
				slug: slugify(value)
			};

		// quit if nothing is entered
		if (value === '') {
			return;
		}

		Meteor.call('addInfo', category, newInfo, Meteor.userId(), function(err, added) {
			if (err) {
				$wrap.append('<label class="error-label">' + err.reason + ' </label>');
			} else {
				if (added) {
					$wrap.remove('.error-label')
					$input.val('');
					$wrap.append('<label class="success-label">Added!</label>');
					// @TODO: this doesn't matter, as when the data changes, the template is refreshed.
					// Find another way to notify changes
					setTimeout(function() {
						$('.success-label').fadeOut(1000).remove();
					}, 3000);
				}
			}
		});
	}
};

// Template Variables
Template.apply.currentSection = function() {
	if (Session.get('applySection')) {
		return Session.get('applySection');
	} else {
		return applySections[0].name;
	}
}
Template.apply.app = function() {
	var app = currentApp();
	if (app) {
		return app;
	} else {
		throw new Error(400, 'No Application Found');
	}
	return currentApp();
}