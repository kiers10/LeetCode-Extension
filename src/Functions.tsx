export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const getColor = (difficulty: string) => {
  if (difficulty === "Easy") return "success";
  if (difficulty === "Medium") return "warning";
  return "error";
};
