export function convertArrayToParamsWithDash(object) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (Array.isArray(value) && value.length > 1) {
      object[key] = value.join('-');
    }

    return object;
  });
}
