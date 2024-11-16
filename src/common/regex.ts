const REGEX = {
    PHONE_NUMBER: /^\d{10}$/,
    CITIZEN_ID: /^\d{12}$/,
    MONTH_YEAR: /^(0[1-9]|1[0-2])\/\d{4}$/,
    QUARTER_YEAR: /^([1-4])\/\d{4}$/,
    YEAR: /^\d{4}$/,
    DATE_RANGE:
        /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\s*-\s*\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
};

export default REGEX;
