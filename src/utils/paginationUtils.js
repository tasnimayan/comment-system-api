const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT),
    MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMetadata = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    pageSize: limit,
    totalCount,
    hasNextPage,
    hasPrevPage,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMetadata,
};
