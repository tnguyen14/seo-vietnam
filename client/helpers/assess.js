parseAssessors = function (assessors, app, type) {
	return Lazy(assessors).map(function(id) {
		var assessor = Meteor.users.findOne(id),
			a = {};
		if (assessor) {
			a._id = assessor._id;
			a.name = assessor.profile.name.first + ' ' + assessor.profile.name.last;
			a.email = assessor.emails[0].address;
		} else {
			a._id = id,
			a.noAssessorFound = true
		}
		switch (type) {
			// do grade set up stuff
			case 'grader':
				var grade = Lazy(app.grades).findWhere({grader: id}),
					criteria = parseGrade(grade);
					if (grade) {
						a.grade = grade;
					}
					a.criteria = criteria;
					a.total = calculateGrade(grade);
				break;
			case 'interviewer':
				var interview = Lazy(app.interviews).findWhere({interviewer: id});
				if (interview) {
					a.interview = interview;
				}
				break;
			default:
				break;
		}
		return a;
	}).toArray();
}