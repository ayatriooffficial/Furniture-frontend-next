

const fixImageUrl = (url) => {
  if (!url) return "";
  return url
    .replace("ayatrio-bucket-data-data-data", "ayatrio-bucket-data")
    .replace("ayatrio-bucket-data-data", "ayatrio-bucket-data")
    .replace(/(?<!-data)-bucket(?!-data)/, "-bucket-data");
};

export default fixImageUrl





