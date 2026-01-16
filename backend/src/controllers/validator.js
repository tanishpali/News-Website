const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidName = function (name) {
    return /^[a-zA-Z ]+$/.test(name);
};

const isValidEmail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

const isValidPhone = function (phone) {
    return /^[6-9]\d{9}$/.test(phone);
};

const isValidPassword = function (password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password);
};

module.exports = {
    isValid,
    isValidName,
    isValidEmail,
    isValidPhone,
    isValidPassword,
};
