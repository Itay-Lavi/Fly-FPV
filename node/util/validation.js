function isEmpty(value) {
  return !value || value.trim() === '';
}

function emailIsValid(email) {
  return (email && email.includes('@' && '.'));
}

function passwordIsValid(password) {
  return (password && password.trim().length >= 6);
}

function userCredentailsIsValid(email, password) {
  return (
    emailIsValid(email) &&
    passwordIsValid(password)
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

function fieldIsConfirm(email, confirmEmail) {
	return email === confirmEmail;
}

module.exports = {
	userDetailsIsValid,
	productDetailsIsValid,
  fieldIsConfirm,
  emailIsValid,
  passwordIsValid
};