// Function to convert selected date to dd.mm.yyyy format
function convertToDDMMYYYY(selectedDate) {
    // Split the date into year, month, and day
    const [year, month, day] = selectedDate.split("-");
    // Construct the date string in dd.mm.yyyy format
    const formattedDate = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
    return formattedDate;
  }
  
  export { convertToDDMMYYYY };
  