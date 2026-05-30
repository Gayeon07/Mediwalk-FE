export const formatDistance = (meters?: number | null): string => {
  if (!meters) return "0m";

  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1).replace(/\.0$/, "")}km`;
  }

  return `${meters}m`;
};
