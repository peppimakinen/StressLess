import { fetchData } from "../assets/fetch.js";

async function getReport(userId, reportId) {
    console.log("Fetching report for user:", userId);
    const url = `http://127.0.0.1:3000/api/reports/${reportId}`;
    let token = localStorage.getItem("token");

    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    try {
        const responseData = await fetchData(url, options);
        console.log(responseData);
        return responseData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching report:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}
export { getReport };
