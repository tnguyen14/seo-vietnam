// In-app notifications
// valid context: success, info, warning, danger
// @param timeout - the duration for message to appear if auto dismissed is selected
notify = function(options) {
	// default options
	var defaultOptions = {
		message: 'Something went wrong.',
		context: 'warning',
		dismissable: true,
		auto: false,
		timeout: 5000,
		clearPrev: false,
		clearPrevType: ''
	};
	var contexts = [
		'success',
		'info',
		'warning',
		'danger'
	];
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

	if (options.clearPrev) {
		clearNotifications(options.clearPrevType);
	}

	var $notification = $(html).appendTo('.notifications');
	if (options.auto) {
		setTimeout(function() {
			$notification.fadeOut(1000, function(){
				$(this).remove();
			});
		}, options.timeout);
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