graderAssignedApps = function (graderId) {
	var grader = Meteor.users.findOne(graderId);
	if (grader.grader && grader.grader.apps) {
		return _.pluck(grader.grader.apps, 'appId');
	} else {
		return [];
	}

}
graderAssignedUsers = function (graderId) {
	var grader = Meteor.users.findOne(graderId);
	if (grader.grader && grader.grader.apps) {
		return _.pluck(grader.grader.apps, 'applicantId');
	} else {
		return [];
	}
}

gradeCriteria = function() {
	return [
		{
			"slug": "academic",
			"title": "Academic Achievement",
			"weight": 30,
			"factors": {
				"gpa": {
					"title": "GPA",
					"weight": 10,
					"hint": "3.5+ or 8.0+ = 10 points (US and VN scale)<br/> 3.3+ or 7.2+ = 8 points<br/> 3.0+ or 7.0+ = 6 points<br/> <3.0 or <7.0 = 4 points"
				},
				"school": {
					"title": "School",
					"weight": 10,
					"hint": "First tier: 10 points<br/> Second-tier: 8 points<br/> Other: 6 points"
				},
				"honors-awards": {
					"title": "Honors and Awards",
					"weight": 6,
					"hint": "Professional certifications (ACCA, CFA, etc), Dean's list, Honor List, Awards at University level = 10 points<br/> Other hono/award = 6 points"
				},
				"language": {
					"title": "Language Ability",
					"weight": 4,
					"hint": "TOEFL 100+ or IELTS 7.0+ or SAT 2000+ or 3+ lnaguage = 10 points<br/> Other = 6 points"
				}
			}
		}, {
			"slug": "leadership",
			"title": "Leadership potentials",
			"weight": 30,
			"factors": {
				"passion": {
					"title": "Level of Passion and Involvement",
					"weight": 10,
					"hint": "How important is the role in shaping the organization?"
				},
				"impact": {
					"title": "Achievement & Impacts",
					"weight": 10,
					"hint": "What are the achievements? How substantial and meaningful are they?"
				},
				"maturity": {
					"title": "Level of Maturity",
					"weight": 10,
					"hint": "Why this role? How does it fit in their personal and professional interest?"
				}
			}
		}, {
			"slug": "community",
			"title": "Community Service",
			"weight": 30,
			"factors": {
				"passion": {
					"title": "Level of Passion and Involvement",
					"weight": 15,
					"hint": "How important is the role in shaping the organization?"
				},
				"impact": {
					"title": "Achievement & Impacts",
					"weight": 15,
					"hint": "What are the achievements?<br/>How substantial and meaningful are they?"
				}
			}
		}, {
			"slug": "vietnam",
			"title": "Interest in Vietnam",
			"weight": 10,
			"hint": "Knowledge about Vietnam's economy/business, industry/career.<br/>Involvement with the Vietnamese community.<br/> Personal/cultural interest."
		}
	];
}

// calculate the final grade based on weightage
// @param {Object} grade object
// @return {number} total grade
calculateGrade = function (grade) {
	if (!grade) {
		return;
	}
	var total = 0;
	var criteria = gradeCriteria();
	for (var i = 0, numCriteria = criteria.length; i < numCriteria; i++) {
		var criterion = criteria[i];
		// if there's no such criterion, or there's no slug
		if (!criterion || !criterion.slug) {
			continue;
		}
		var criterionWeight = criterion.weight,
			criterionGrade = grade[criterion.slug];
		// if the criterion grade is empty or is not a number, skip it
		if (_.isEmpty(criterionGrade) && !_.isNumber(criterionGrade)) {
			continue;
		}
		// if there are factors, dig deeper
		if (!_.isEmpty(criterion.factors)) {
			for (var f in criterion.factors) {
				if (criterion.factors.hasOwnProperty(f)) {
					if (!_.isNumber(criterionGrade[f])) {
						console.log('criterion grade sub factor is not number');
						continue;
					}
					var factorWeight = criterion.factors[f].weight,
						score = criterionGrade[f];
					// add factor grade to total
					total += score * (factorWeight/ 100);
				}
			}
		} else if (_.isNumber(criterionGrade)) {
			total += criterionGrade * (criterionWeight / 100);
		}
	}
	return total;
}