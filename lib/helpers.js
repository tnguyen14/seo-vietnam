slugify = function (string) {
	// non-word \W is equivalent to [^A-Za-z0-9_]
	return string.trim().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_-]/gi, '').replace(/-{2,}/g, '-');
}