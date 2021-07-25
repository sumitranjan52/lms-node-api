const fs = require("fs");

function decodeToFile(fileName, encodedData, callback) {
  fs.writeFile(
    "./uploads/" + fileName + ".jpg",
    encodedData,
    { encoding: "base64" },
    (err, data) => {
      callback(err, data);
    }
  );
}

function encodeFromFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./uploads/" + fileName + ".jpg",
      { encoding: "base64" },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      }
    );
  });
}

function deleteFile(fileName) {
  fs.rm("./uploads/" + fileName + ".jpg");
}

function emptyToNull(str) {
  if (!str) return null;
  return str.trim().length > 0 ? str.trim() : null;
}

function getSqlDate(strDate) {
  let date = new Date(strDate);
  let year = date.getFullYear();
  let day = date.getDate();
  let finalDay = day < 10 ? "0" + day : day;
  let finalMonth = getShortMonth(date.getMonth().toString());
  console.log(finalDay + "-" + finalMonth + "-" + year);
  return finalDay + "-" + finalMonth + "-" + year;
}

function getShortMonth(month) {
  switch (month) {
    case "0":
      return "Jan";
    case "1":
      return "Feb";
    case "2":
      return "Mar";
    case "3":
      return "Apr";
    case "4":
      return "May";
    case "5":
      return "Jun";
    case "6":
      return "Jul";
    case "7":
      return "Aug";
    case "8":
      return "Sep";
    case "9":
      return "Oct";
    case "10":
      return "Nov";
    case "11":
      return "Dec";
    default:
      return "";
  }
}

module.exports = {
  decodeToFile,
  encodeFromFile,
  deleteFile,
  getSqlDate,
  emptyToNull,
};
