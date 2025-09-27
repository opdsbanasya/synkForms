const validator = require("validator");

const validateSignupData = (data) => {
  // Name validation
  if (!data.name) {
    throw new Error("Name is required");
  }

  // Remove the extra spaces from name
  data.name = data.name.trim();

  // Name length should not be less than 5 or grater than 100
  let lengthOfName = data.name.length;
  if (lengthOfName > 100 || lengthOfName < 5) {
    throw new Error("Name length should be between 5 to 100");
  }

  // is Nama have numeric values and symbols
  if (!validator.isAlpha(data.name)) {
    throw new Error("Name should be contains only Alphabetic values");
  }

  // Email
  if (!data.email) {
    throw new Error("Email is required");
  }

  // Remove the extra spaces from name
  data.email = data.email.trim();

  // is email valid?
  if (!validator.isEmail(data.email)) {
    throw new Error("Invalid email");
  }

  // Password
  if (!data.password) {
    throw new Error("Passsword is required");
  }

  // check the length of password
  const passwordLength = data.password.length;
  if (passwordLength > 128) {
    throw new Error("Password is too long");
  }

  /**
   * Password must have
   * A uppercase and a lowercase charater
   * A numeric value and a Symbol
   * minimum length is 8
   * maximum length is 128
   */

  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Weak password");
  }

  // Photo - optional
  if (data.userPhoto && !validator.isURL(data.userPhoto)) {
    throw new Error("Invalid URL for userPhoto");
  }

  return data;
};

const validateLoginData = (data) => {
  // Email
  if (!data.email) {
    throw new Error("Email is required");
  }

  // trim email
  data.email = data.email.trim();

  // check for valid email
  if (!validator.isEmail(data.email)) {
    throw new Error("Invalid Credentials");
  }

  // Password
  if (!data.password) {
    throw new Error("Password is required");
  }

  // check the length of password
  const passwordLength = data.password.length;
  if (passwordLength > 128) {
    throw new Error("Invalid password");
  }

  return data;
};

module.exports = { validateSignupData, validateLoginData };
