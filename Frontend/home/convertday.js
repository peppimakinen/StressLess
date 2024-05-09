// Function to convert selected date to yyyy-mm-dd format
function convertToYYYYMMDD(date) {
  // Split the date into day, month, and year
  const [day, month, year] = date.split(".");
  // Construct the date string in yyyy-mm-dd format
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  return formattedDate;
}

// Function to convert selected date to dd.mm.yyyy format
function convertToDDMMYYYY(date) {
  // Split the date into year, month, and day
  const [year, month, day] = date.split("-");
  // Construct the date string in dd.mm.yyyy format
  const formattedDate = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
  return formattedDate;
}

export { convertToYYYYMMDD, convertToDDMMYYYY };