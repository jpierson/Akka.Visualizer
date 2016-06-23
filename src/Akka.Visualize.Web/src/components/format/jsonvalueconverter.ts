export class JsonValueConverter {
	// server has dates in format "2016-01-19T00:00:00"
	// JS has dates in format "dd MMM yyyy";
	toView(value, format) {
		if(!value)
			return '-';
				
		return JSON.stringify(value);
	}
}