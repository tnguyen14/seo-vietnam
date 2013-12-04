// In-app notifications
// valid context: success, info, warning, danger
notify = function(message, context, dismissable, auto) {
	if (!message) {
		return ;
	}
	var html = '<div class="alert ';
	if (_.contains(['success', 'info', 'warning', 'danger'], context)) {
		html += 'alert-' + context;
	}
	html += '"">';

	if (dismissable) {
		html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
	}

	html += message + '</div>';

	var $notification = $(html).appendTo('.notifications');
	if (auto) {
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