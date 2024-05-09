import { fetchData } from "../assets/fetch.js";
import {reportRouter} from "../routes/report-router"

async function getReport(userId, reportId) {
    console.log("Fetching report for user:", userId);
    const url = `https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api/reports/${reportId}`;
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
