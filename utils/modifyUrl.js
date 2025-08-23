

const fixImageUrl = (url) => {

if(url?.imgSrc){  
  return url?.imgSrc}

  if (!url) return "";
  if (typeof url === "object") url = url.imgSrc
  return url
    .replace("ayatrio-bucket-data-data-data", "ayatrio-bucket-data")
    .replace("ayatrio-bucket-data-data", "ayatrio-bucket-data")
    .replace(/(?<!-data)-bucket(?!-data)/, "-bucket-data");
};

export default fixImageUrl





