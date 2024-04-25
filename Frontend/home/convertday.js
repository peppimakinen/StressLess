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

export { convertToYYYYMMDD };