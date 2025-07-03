export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};