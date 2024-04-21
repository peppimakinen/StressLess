import { fetchData } from "../assets/fetch.js";

async function getMonthColors(year, month) {
  console.log("Fetching monthly entries for year:", year, "and month:", month);
  const url = "http://127.0.0.1:3000/api/entries/monthly";
  let token = localStorage.getItem("token");

  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer: " + token,
    },
  };

  try {
    const responseData = await fetchData(url, options);
    console.log(responseData);
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
}

export { getMonthColors };
