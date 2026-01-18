const SORT_OPTIONS = {
  MOST_LIKED: 'mostLiked',
  MOST_DISLIKED: 'mostDisliked',
  NEWEST: 'newest',
  OLDEST: 'oldest',
};

const getSortCriteria = (sortBy) => {
  switch (sortBy) {
    case SORT_OPTIONS.MOST_LIKED:
      return { likesCount: -1, createdAt: -1 };
    case SORT_OPTIONS.MOST_DISLIKED:
      return { dislikesCount: -1, createdAt: -1 };
    case SORT_OPTIONS.OLDEST:
      return { createdAt: 1 };
    case SORT_OPTIONS.NEWEST:
    default:
      return { createdAt: -1 };
  }
};

const isValidSortOption = (sortBy) => {
  return Object.values(SORT_OPTIONS).includes(sortBy);
};

module.exports = {
  SORT_OPTIONS,
  getSortCriteria,
  isValidSortOption,
};
