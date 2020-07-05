export const handleConvert = (key) => {
	switch (key) {
		case 0:
			return 'Rejected';
		case 1:
			return 'Approved';
		case 3:
			return 'All';
		case 4:
			return 'DAILY';
		case 5:
			return 'WEEKLY';
		case 6:
			return 'MONTHLY'
		default:
			break;
	}
};