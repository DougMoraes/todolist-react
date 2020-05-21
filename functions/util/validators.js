const isEmpty = str => {
  return str.length === 0 || !str.trim();
}

const isValidEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email.match(emailRegEx) ? true : false;
}

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty"
  } else if (!isValidEmail(email)) {
    errors.email = "Email should be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Password must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  }
}

exports.validateSignUpData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Email should be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Password must not be empty";
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
  if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
  if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty';
  if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';
  if (isEmpty(data.country)) errors.country = 'Must not be empty';

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (isEmpty(data.username)) errors.username = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  }
}