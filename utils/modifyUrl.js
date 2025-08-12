

const fixImageUrl = (url) => {
  console.log("THis is the url",url)

  



if(url?.imgSrc){
  console.log("This is the image src",url?.imgSrc)
  
  return url?.imgSrc}

  if (!url) return "";

  return url
    .replace("ayatrio-bucket-data-data-data", "ayatrio-bucket-data")
    .replace("ayatrio-bucket-data-data", "ayatrio-bucket-data")
    .replace(/(?<!-data)-bucket(?!-data)/, "-bucket-data");
};

export default fixImageUrl





