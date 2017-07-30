/**
 * @description evaluate pagination details
 * @param {Number} count - total number of user instances
 * @param {Number} limit - page limit
 * @param {Number} offset - page offset
 * @returns {Object} filtered user details
 */
export default (count, limit, offset) => {
  const page = Math.floor(offset / limit) + 1;
  const numberOfPages = Math.ceil(count / limit);
  const pageSize = (count - offset) > limit ? limit : (count - offset);

  return {
    page,
    numberOfPages,
    pageSize,
    totalCount: count
  };
};
