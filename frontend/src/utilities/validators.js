export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

export const validateMongoId = (id) => {
  const re = /^[0-9a-fA-F]{24}$/;
  return re.test(id);
};

export const validateForm = (fields) => {
  const errors = {};
  if (!fields.name) errors.name = 'Name is required';
  if (!fields.email || !validateEmail(fields.email)) {
    errors.email = 'Invalid email';}
if(!fields.password || !validatePassword(fields.password)){
    errors.password= 'Invalid password';
}
 
 
  return errors;
};