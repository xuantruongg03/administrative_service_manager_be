const parseDate = (dateString: string): Date => {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Expected dd/mm/yyyy');
    }

    const [day, month, year] = parts;

    // Validate day, month, and year
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
        throw new Error('Invalid date. Day, month, and year must be numbers');
    }

    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
        throw new Error('Invalid date. Day or month out of range');
    }

    // Create a new Date object with the parsed values
    return new Date(yearNum, monthNum - 1, dayNum);
};

export { parseDate };
