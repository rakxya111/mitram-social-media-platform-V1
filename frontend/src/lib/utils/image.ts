export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return "/assets/icons/profile-placeholder.svg";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:8000";

  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};
