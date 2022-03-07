function formatDate(date_) {
  if (typeof date_ === 'string') {
    return date_;
  }
  const month = `${date_.getMonth() + 1}`.padStart(2, '0');
  const day = `${date_.getDate()}`.padStart(2, '0');
  return `${date_.getFullYear()}-${month}-${day}`;
}

function formatUrl(originUrl, filter) {
  let url = originUrl;
  Object.keys(filter).forEach((key) => {
    if (filter[key]) {
      if (url.includes('?')) {
        url = `${url}&${key}=${filter[key]}`;
      } else {
        url = `${url}?${key}=${filter[key]}`;
      }
    }
  });
  return url;
}

export { formatDate, formatUrl };
