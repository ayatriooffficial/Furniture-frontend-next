

const fixImageUrl = (url) => {
  if (!url) return "";
  if (typeof url === "object") url = url.imgSrc || "";
  if (typeof url !== "string") return "";

  let fixedUrl = url
    .replace("ayatrio-bucket-data-data-data", "ayatrio-bucket-data")
    .replace("ayatrio-bucket-data-data", "ayatrio-bucket-data")
    .replace(/(?<!-data)-bucket(?!-data)/, "-bucket-data");

  if (fixedUrl && !fixedUrl.startsWith("http") && !fixedUrl.startsWith("/")) {
    fixedUrl = "/" + fixedUrl;
  }

  return fixedUrl;
};

export default fixImageUrl;





