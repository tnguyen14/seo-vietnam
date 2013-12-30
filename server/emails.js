Accounts.emailTemplates.siteName = "SEO-Vietnam Applications";

Accounts.emailTemplates.from = "SEO-Vietnam Recruitment <recruitment@seo-vietnam.org>";

// Reset Password
Accounts.emailTemplates.resetPassword.text = function(user, url) {
	var greeting = (user.profile && user.profile.name) ? ("Hello " + user.profile.name.first + " " + user.profile.name.last + ",") : "Hello,";
	return greeting + "\n"
		+ "\n"
		+ "To reset your password, please following the link below to enter your new password.\n"
		+ url + "\n"
		+ "\n"
		+ "Thanks.\n";
};

Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};