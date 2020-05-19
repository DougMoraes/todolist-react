const isEmpty = str => {
  return str.length === 0 || !str.trim();
}

exports.validateLoginData = data => {
  let errors = { };

  if (isEmpty(data.email)) errors.email = "Email must not be empty";
  if (isEmpty(data.password)) errors.password = "Password must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  }
}