function isEmpty(value) {
  return !value || value.trim() === '';
}

function userCredentailsIsValid(email, password) {
  return (
    email &&
    email.includes('@' && '.') &&
    password &&
    password.trim().length >= 6
  );
}

function userDetailsIsValid(email, password, name, street, postal, city) {
  return (
    userCredentailsIsValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

function productDetailsIsValid(formData) {
	for (const input in formData) {
		 if (isEmpty(formData[input])) {
			return false;
		} 
	}
	return true;
}

function emailIsConfirm(email, confirmEmail) {
	return email === confirmEmail;
}

module.exports = {
	userDetailsIsValid,
	productDetailsIsValid,
  emailIsConfirm
};