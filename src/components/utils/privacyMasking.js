function maskSSN(ssn) {
    ssn = ssn.replace(/\D/g, '');

    if (ssn.length !== 9) {
        console.error('Invalid SSN Length');
        return '<SSN-invalid length>';
    }

    return '***-**-' + ssn.slice(5);
    // return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
}

function maskEIN(ein) {
    ein = ein.replace(/\D/g, '');

    if (ein.length !== 9) {
        console.error('Invalid EIN Length');
        return '**';
    }

    return ein.slice(0, 2) + '-*******';
}

function formattedPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, '');

    if (phoneNumber.length !== 10) {
        console.error('Invalid Phone Number Length');
        return '<PHONE_NUMBER> - invalid length';
    }

    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
    )}-${phoneNumber.slice(6)}`;
}

export { maskSSN, maskEIN, formattedPhoneNumber };
