const convertParamsToDefault = (string, type) => {
  if (!!string && string.includes('-')) {
    if (type === 'number') {
      return string.split('-').map(item => +item);
    } else {
      return string.split('-');
    }
  } else {
    if (!string) return [];
    if (type === 'number') {
      return [Number(string)];
    } else if (type === 'string') {
      return [string];
    }
  }
};
export default convertParamsToDefault;
