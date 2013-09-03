Meteor.subscribe('colleges');
Meteor.subscribe('majors');
Meteor.subscribe('languages');
Meteor.subscribe('industries');
Meteor.subscribe('functions');
Meteor.subscribe('countries');
Meteor.subscribe('fake-users');
Meteor.subscribe('applications');

var applySections = [
	{
		index: 1,
		name: 'personal-info',
		validate: {
			first: "required",
			last: "required"
		}
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

var collectInputs = function(ctx) {
	var field = {};
	$('input[type="text"], input[type="number"], textarea, select', ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val();
		field[name] = value;
	});

	// checkboxes are saved as array of values
	$('input[type="checkbox"]:checked', ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val();
		field[name] = field[name] || [];
		field[name].push(value);
	});

	$('input[type="file"]', ctx).each(function(){
		var name = $(this).attr('name'),
			value = {};
		value.url = $(this).data('url');
		value.key = $(this).data('awskey');
		console.log(value);
		field[name] = value;
	})

	return field;
};

var saveFormGroups = function(ctx, collection, _id, cb) {
	$('.form-group', $(ctx)).each(function() {
		var group = {},
			field = collectInputs(this),
			name = $(this).attr('name');
		console.log(field);
		if (name) {
			group[name] = field;
		} else {
			group = field;
		}
		collection.update(_id, {$set: group}, cb);
	});
};

var saveInputs = function(cb) {
	var current = Session.get('applySection'),
		userId = Session.get("userId"),
		appId = Applications.findOne({'user': userId})._id;


	// save personal info to User
	if (current === 'personal-info') {
		saveFormGroups('#' + current, FakeUsers, userId, cb);
		return;
	}

	saveFormGroups('#' + current, Applications, appId, cb);
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
		console.log('first fragment');
		$(".fragment-control.prev").addClass('hidden');
	} else if (toIndex === applySections.length - 1) {
		$(".fragment-control.next").addClass('hidden');
	}
}

var currentApp = function() {
	var userId = Session.get("userId");
	return Applications.findOne({'user': userId});
}
// Check whether application is ready for submit
var appReady = function(){
	var app = currentApp(),
		required = ['college', 'major', 'essay-community', 'essay-leadership', 'essay-passion'],
		empty = [];
	_.each(required, function(field){
		if (app[field] === '') {
			console.log(field);
			empty.push(field);
		}
	});

	if (empty.length) {
		console.log('appl is incomplete');
		console.log(empty);
		return false;
	} else {
		console.log('app is complete');
		return true;
	}

}

// Rendered
Template.apply.rendered = function() {
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

	// defaults for jquery validator
	var error = 'has-error',
		valid = 'has-success';

	$.validator.setDefaults({
		errorClass: 'error-label control-label',
		highlight: function(element, errorClass, validClass) {
			$(element).parent('.field-group').removeClass(valid).addClass(error);
		},
		unhighlight: function(element, errorClass, validClass) {
			$(element).parent('.field-group').removeClass(error).addClass(valid);
		}
	});
};

Template['personal-info'].rendered = function() {
	$("#personal-info").validate({
		rules: {
			first: "required",
			last: "required"
		}
	});
};

Template.resume.rendered = function() {
	// testing
	if (appReady()) {
		$("#app-submit").removeClass("hidden");
	}
};

//Template Events
Template.apply.events = {
	'click .fragment-control.prev': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current),
			prev = (currentIndex === 0) ? current : applySections[currentIndex-1].name;

		saveInputs();

		// navigate away!
		Meteor.Router.to('/apply/' + prev);
	},
	'click .fragment-control.next': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current)

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}
		saveInputs();
		// not yet at the last fragment
		if (currentIndex + 1 < applySections.length) {
			var next = applySections[currentIndex+1].name;
			Meteor.Router.to('/apply/' + next);
		// completed!
		} else {
			Meteor.Router.to('/completed');
		}
	},
	'click .pagination li': function(e) {
		saveInputs();
		// `this` is the context of of these li's
		var to = this.name;
		// Session.set('applySection', to);
		Meteor.Router.to('/apply/' + to);
		navigate();
	}
};

Template.resume.events = {
	'click #resume-submit': function(e) {
		e.preventDefault();
		var $form = $("#resume");
			fileInput = document.getElementById("file-resume"),
			$submit = $("#resume-submit"),
			$label = $submit.siblings(".control-label");

		$form.validate({
			rules: {
				'file-resume': {
					required: true
				}
			}
		});

		if ($form.valid()) {
			filepicker.store(fileInput, {
				location: 'S3'
			},function(InkBlob){
				// successful response
				// {"url":"https://www.filepicker.io/api/file/5TEGc0A4RPWNcvTtxyYs","filename":"ac2af834-a599-4dbd-b4c0-a925b981f206.png","mimetype":"image/png","size":134347,"key":"7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png","isWriteable":false}
				// aws url: http://s3.amazonaws.com/seo-vietnam/7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png
				console.log('Store successful:', JSON.stringify(InkBlob));
				$(fileInput).data('url', InkBlob.url).data('awskey', InkBlob.key);
				saveInputs(function(){
					$submit.removeClass('btn-default btn-primary btn-danger').addClass('btn-success').html("Success!");
					$label.html('Thank you for uploading your resume!');
				});
			}, function(FPError) {
				console.log(FPError.toString());
				$submit.removeClass('btn-default btn-primary btn-success').addClass('btn-danger').html("Failed!");
				$label.html('There has been an error uploading your file (' +  FPError.toString() + '). Please try again.');
			}, function(progress) {
				console.log('Loading: ' + progress + '%');
				$submit.removeClass('btn-default btn-success btn-danger').addClass('btn-primary').html(progress + "%");
				$label.html('Uploading...');
			});
		}
	}
}
// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});
Template.professional.helpers({
	'checked': function (slug, values) {
		if (_.contains(values, slug)) {
			return 'checked';
		}
	}
});

// Template Variables
Template.apply.currentSection = function() {
	if (Session.get('applySection')) {
		return Session.get('applySection');
	} else {
		return applySections[0].name;
	}
}
Template.apply.app = function() {
	return currentApp();
}


Template['personal-info'].user = function() {
	var userId = Session.get("userId");
	return FakeUsers.findOne({'_id': userId});
}
Template.education.colleges = function() {
	return Colleges.find();
}

Template.education.majors = function() {
	return Majors.find();
}

Template.qualifications.languages = function() {
	return Languages.find();
}

Template.professional.industries = function() {
	return Industries.find();
}
Template.professional.functions = function() {
	return Functions.find();
}
Template['personal-info'].countries = function() {
	return Countries.find();
}