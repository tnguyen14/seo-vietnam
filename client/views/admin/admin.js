var totalApps, submittedApps, completedApps;

AdminController = RouteController.extend({
  waitOn: function() {
    return [
      // Meteor.subscribe('allApps'),
      // Meteor.subscribe('allUsers')
    ];
  },
  data: function() {
    Meteor.subscribe('allApps'),
    Meteor.subscribe('allUsers')
    totalApps = Applications.find().fetch();
    submittedApps = Lazy(totalApps).filter(function(app) {
      return app.status === 'completed';
    });
    completedApps = Lazy(totalApps).filter(function(app) {
      return appComplete(app);
    });
    return {
      totalApps: totalApps.length,
      submittedApps: submittedApps.size(),
      completedApps: completedApps.size(),
      numUsers: Meteor.users.find().count()
    }
  }
});

appComplete = function (app) {
  var empty = [],
    required = ['essay.one', 'essay.two', 'essay.three', 'essay.four', 'files.resume'];
  Lazy(required).each(function(field){
    // parse the dot notation
    var value = app,
      path = field.split('.');
    while (path.length !== 0) {
      if (!value) {
        break;
      }
      value = value[path.shift()];
    }
    if (Lazy(value).isEmpty()) {
      empty.push(field);
    }
  });

  if (empty.length > 0) {
    return false;
  } else {
    return true;
  }
}

var getName = function(name) {
  return (name.first || '') + ' ' + (name.middle || '') + ' ' + (name.last || '');
}

Template['admin'].events = {
  'click #export-data': function() {
    var header = 'userId,name,email,phone,school,degree,location,graduationYear,appId,grader1,grade1,grade1Comment,grader2,grade2,grade2Comment,grader3,grade3,grade3Comment,interviewer,interviewScore,interviewComment\r\n',
      body = '';
    completedApps.each(function(app) {
      // userId
      body += app.user + ',';
      var user = Meteor.users.findOne(app.user),
        grade1 = new Array(3),
        grade2 = new Array(3),
        grade3 = new Array(3),
        interview = new Array(3),
        grader1, grader2, grader3, interviewer;
      // name
      body += getName(user.profile.name) + ',';
      // email
      body += user.emails[0].address + ',';
      // phone
      body += user.profile.phone + ',';
      // school
      body += app.college + ',';
      // degree
      body += (app.degree || '') + ',';
      // location
      body += user.profile['country-residence'] + ',';
      // graduationYear
      body += app['graduation-date'] + ',';
      // appId
      body += app._id + ',';
      // grader1
      if (app.graders && app.graders.length > 0) {
        grader1 = Meteor.users.findOne(app.graders[0]);
        if (grader1) {
          grade1[0] = getName(grader1.profile.name);
          if (app.grades && app.grades.length > 0) {
            var g1 = _.findWhere(app.grades, {grader: grader1._id});
            if (g1) {
              grade1[1] = calculateGrade(g1);
              grade1[2] = '"' + (g1.comment || '') + '"';
            }
          }
        }
      }
      body += grade1.join(',') + ',';
      // grader2
      if (app.graders && app.graders.length > 1) {
        grader2 = Meteor.users.findOne(app.graders[1]);
        if (grader2) {
          grade2[0] = getName(grader2.profile.name);
          if (app.grades && app.grades.length > 0) {
            var g2 = _.findWhere(app.grades, {grader: grader2._id});
            if (g2) {
              grade2[1] = calculateGrade(g2);
              grade2[2] = '"' + (g2.comment || '') + '"';
            }
          }
        }
      }
      body += grade2.join(',') + ',';
      // add grader 3 if there's difference of more than 2
      if (grade1[1] && grade2[1] && Math.abs(grade1[1] - grade2[1]) >= 2) {
        if (app.graders.length > 2) {
          grader3 = Meteor.users.findOne(app.graders[2]);
          if (grader3) {
            grade3[0] = getName(grader3.profile.name);
            if (app.grades && app.grades.length > 0) {
              var g3 = _.findWhere(app.grades, {grader: grader3._id});
              if (g1) {
                grade3[1] = calculateGrade(g3);
                grade3[2] = '"' + (g3.comment || '') + '"';
              }
            }
          }
        }
      }
      body += grade3.join(',') + ',';
      // interviewer
      if (app.interviewers && app.interviewers.length > 0) {
        interviewer = Meteor.users.findOne(app.interviewers[0]);
        if (interviewer) {
          interview[0] = getName(interviewer.profile.name);
        }
      }
      body += interview.join(',') + ',';
      body += '\r\n';
    });
    var csv = new Blob([header, body], {type: 'text/csv'}),
        a = document.createElement('a'),
        li = document.createElement('li');
    a.href = window.URL.createObjectURL(csv);
    a.title = 'Completed Apps';
    a.innerHTML = 'Download Completed Apps';
    a.download = "completedapps.csv";
    li.appendChild(a);
    document.getElementsByClassName('download-links')[0].appendChild(li);
  }
};

Template['admin-stats'].events = {
  'click #assign-apps': function() {
    [
      {
        location: 'overseas',
        profession: 'non-business'
      },
      {
        location: 'overseas',
        profession: 'business'
      }, {
        location: 'local',
        profession: 'non-business'
      }, {
        location: 'local',
        profession: 'business'
      }
    ].reduce(function (assignPromise, filter) {
      return assignPromise.then(
        function(value) {
          if (value === 0) {
            $('.assignment-output').append('<h2>Starting...</h2>');
          }
          return assignApps(filter.location, filter.profession);
        }, function(reason) {
        }
      );
    }, Q(0)).done(function(value) {
      notify({
        message: 'Done!',
        context: 'success'
      });
    });
  }
};

Template['admin-menu'].events = {
  'click .nav-icon': function() {
    if ($('.main-container').hasClass('menu-active')) {
      $('.overlay').unbind().remove();
    } else {
      setTimeout(function(){
        $('<div class="overlay"></div>').prependTo('.main-container');
      }, 200);
    }
    $('.main-container').toggleClass('menu-active');
    $('.nav-icon').toggleClass('active');
  }
}
