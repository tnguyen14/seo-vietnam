Meteor.subscribe('colleges');
Meteor.subscribe('majors');
Meteor.subscribe('languages');
Meteor.subscribe('industries');
Meteor.subscribe('countries');
Meteor.subscribe('fake-users');
Meteor.subscribe('applications');

var structure = [
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

Template.apply.fragments = function() {
	return structure;
}

Template.apply.app = function() {
	var userId = Session.get("userId");
	console.log(userId);
	if (Applications.find({'user': userId}).count() === 0 ){
		console.log('creating new user');
		//Applications.insert({'user': userId});
	}
	return Applications.findOne({'user': userId});
}

var getIndex = function(el, array) {
	var i = -1;
	array.forEach(function(element, index) {
		if (el === element.name) {
			i = index;
		}
	});
	return i;
}

var save = function(object) {
	var userId = Session.get("userId"),
		appId = Applications.findOne({'user': userId})._id;

	console.log(object);
	Applications.update(appId, {$set: object});
}

var saveInputs = function() {
	var current = Session.get('applySection'),
		group = {};

	console.log('saving inputs for ' + current);

	$('.form-group', $('#' + current)).each(function() {
		var field = {};
		$('input[type="text"], input[type="number"], textarea, select', this).each(function(){
			var name = $(this).attr('name'),
				value = $(this).val();
			field[name] = value;
		});

		// checkboxes are saved as array of values
		$('input[type="checkbox"]:checked').each(function(){
			var name = $(this).attr('name'),
				value = $(this).val();
			field[name] = field[name] || [];
			field[name].push(value);
		});

		var name = $(this).attr('name');
		if (name) {
			group[name] = field;
		} else {
			group = field;
		}

		save(group);

	});
}

var navigate = function() {
	var to = Session.get('applySection');
	console.log('navingating to ' + to);
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

	$(".fragment").removeClass('current prev next');
	// iterate through structure to find index
	var toIndex = getIndex(to, structure),
		prevDisabled = (toIndex === 0) ? 'disabled' : false;
	$('.prev-fragment').attr('disabled', prevDisabled);

	structure.forEach(function(element, index) {
		var $el = $("#" + element.name);
		if (index > toIndex) {
			$el.addClass('next');
		} else if (index < toIndex) {
			$el.addClass('prev');
		} else {
			$el.addClass('current');
		}
	});
	var prevIndex = (toIndex === 0) ? structure.length -1 : toIndex -1,
		nextIndex = (toIndex === structure.length -1) ? 0 : toIndex + 1;
	$("#" + structure[prevIndex].name).addClass('prev');
	$("#" + structure[nextIndex].name).addClass('next');
	$("#" + to).addClass('current');
}

Template.apply.rendered = function() {
	// reset
	navigate();
	// use bootstrap-select
	// $('.selectpicker').selectpicker();

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
};

//Template Events
Template.apply.events = {
	'click .prev-fragment': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current, structure),
			prev = (currentIndex === 0) ? current : structure[currentIndex-1].name;

		saveInputs();

		// navigate away!
		Meteor.Router.to('/apply/' + prev);
	},
	'click .next-fragment': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current, structure);

		saveInputs();
		// not yet at the last fragment
		if (currentIndex + 1 < structure.length) {
			var next = structure[currentIndex+1].name;
			Meteor.Router.to('/apply/' + next);
		// completed!
		} else {
			Meteor.Router.to('/completed');
		}
	},
	'click .pagination li': function(e) {
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
		var fileInput = document.getElementById("file-resume");
		if (!fileInput.value) {
			console.log("Choose a resume to store to S3");
		} else {
			filepicker.store(fileInput, {
				location: 'S3'
			},function(InkBlob){
				// successful response
				// {"url":"https://www.filepicker.io/api/file/5TEGc0A4RPWNcvTtxyYs","filename":"ac2af834-a599-4dbd-b4c0-a925b981f206.png","mimetype":"image/png","size":134347,"key":"7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png","isWriteable":false}
				// aws url: http://s3.amazonaws.com/seo-vietnam/7V1EVxorTWXM87AqUTxb_ac2af834-a599-4dbd-b4c0-a925b981f206.png
				console.log("Store successful:", JSON.stringify(InkBlob));
			}, function(FPError) {
				console.log(FPError.toString());
			}, function(progress) {
				console.log("Loading: "+progress+"%");
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
Template['personal-info'].countries = function() {
	return Countries.find();
}