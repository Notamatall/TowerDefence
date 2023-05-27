interface DateConstructor {
	today: () => Date
}

Date.today = function () {
	let date = new Date;
	date.setHours(0, 0, 0, 0);
	return date;
}
