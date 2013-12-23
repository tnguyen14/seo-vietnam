// In-app notifications
// valid context: success, info, warning, danger
notify = function(options) {
	// default options
	var defaultOptions = {
		message: 'Something went wrong.',
		context: 'warning',
		dismissable: true,
		auto: false
	}
	var contexts = [
		'success',
		'info',
		'warning',
		'danger'
	]
	if (_.isObject(options)) {
		options = _.extend(defaultOptions, options);
	}
	var html = '<div class="alert ';
	if (_.contains(contexts, options.context)) {
		html += 'alert-' + options.context;
	}
	html += '"">';

	if (options.dismissable) {
		html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
	}

	// the main message
	html += options.message + '</div>';

	var $notification = $(html).appendTo('.notifications');
	if (options.auto) {
		setTimeout(function() {
			$notification.fadeOut(1000, function(){
				$(this).remove();
			});
		}, 3000);
		return;
	} else {
		return $notification;
	}
}

// Clear all notifications of a particular class
// default to '.alert'
// accepted type: success, info, warning, danger
clearNotifications = function(type) {
	var alerts = '.alert';
	if (_.contains(['success', 'info', 'warning', 'danger'], type)) {
		alerts += '-' + type;
	}
	$('.notifications').find(alerts).remove();
}