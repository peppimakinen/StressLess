import { fetchData } from '../assets/fetch.js';
import {convertToDDMMYYYY} from './convertDay.js';



window.addEventListener('load', async (evt) => {
    evt.preventDefault();
    try {
        //get all the weeks related to the user
        const url = "http://127.0.0.1:3000/api/reports/available-weeks";
        let token = localStorage.getItem("token");
        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        const reportData = await fetchData(url, options);
        console.log(reportData);
        // Iterate over each object in the reportData array
        reportData.forEach(async (report) => {
            // Get the report_id for each report object
            const reportId = report['report_id'];
            console.log(reportId)

            // Get the specific report by using report_id
            const url2 = `http://127.0.0.1:3000/api/reports/${reportId}`;
            let token2 = localStorage.getItem("token");
            const options2 = {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token2,
                },
            };
            const specificReportData = await fetchData(url2, options2); 
            console.log(specificReportData);

            // Stress index summary comparing last week
            const stressIndexNow = specificReportData.week_si_avg;
            const stressIndexPrev = specificReportData.previous_week_si_avg;
            const uploadDate = `Raporttisi luotu: ${convertToDDMMYYYY(specificReportData.created_at)}`;
            const createdTag = document.querySelector('.createdTag');
            createdTag.textContent = uploadDate;

        if ( stressIndexNow >= (stressIndexPrev || null) ) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = `Mitatun stressi-indexisi perusteella stressasit tällä viikolla enemmän verrattuna viime viikkoon. On hyvä kerrata tapoja, jotka ovat tehokkaimmin alentaneet stressiäsi aikaisemmin.`;
        } if ( stressIndexNow == stressIndexPrev) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = `Mitatun stressi-indexisi perusteella stressitasossa ei havaittu merkittäviä muutoksia viime viikkoon verrattuna.`;
        } if ( stressIndexNow <= stressIndexPrev ) {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = `Mitatun stressi-indexisi perusteella stressasit tällä viikolla vähemmän edelliseen viikkoon verrattuna, hienoa! Kannattaa kiinnittää huomioita niihin tapoihin, joita olet tällä viikolla tehnyt stressisi lieventämiseksi. Niistä voi olla hyötyä myös jatkossa!`;
        } else {
            const summary = document.querySelector('#stressSummary');
            summary.textContent = `Tietokannassa ei ole tarpeeksi tarkkaa tietoa antamaan yhteenvetoa tämän viikon stressitasosta verrattuna aiempaan viikkoon mitatun stressi-indexisi perusteella.`;
        }
    
//trials for diagrams

    //pieChart objects
    const moodGreen = specificReportData.green_percentage;
    const moodYellow = specificReportData.yellow_percentage;
    const moodRed = specificReportData.red_percentage;
    const moodGrey = specificReportData.gray_percentage;
    const canvasPie = document.getElementById('pieChart');
    const ctxPie = canvasPie.getContext('2d');

    // Data for the pie chart (percentages)
    const dataPie = {
        colors: ['#FF8585', '#9BCF53', '#D9D9D9', '#FFF67E'],
        percentages: [moodRed, moodGreen, moodGrey, moodYellow] 
    };


    // Pie chart properties
    const x = canvasPie.width / 2;
    const y = canvasPie.height / 2;
    const radius = Math.min(x, y) * 0.9;
    const startAngle = 180;

    // Draw the pie chart
    let angle = startAngle;
    dataPie.percentages.forEach((percentage, index) => {
        const sliceAngle = (Math.PI * 2 * percentage) / 100;
        const endAngle = angle + sliceAngle;

        ctxPie.beginPath();
        ctxPie.moveTo(x, y);
        ctxPie.arc(x, y, radius, angle, endAngle);
        ctxPie.fillStyle = dataPie.colors[index];
        ctxPie.fill();
        // Add a black outline
        ctxPie.strokeStyle = 'black';
        ctxPie.stroke(); // Draw the outline
        angle = endAngle;
    });

    // labels for colors in pieChart
    // const labels = ['Punainen', 'Vihreä', 'Harmaa', 'Keltainen']
    // dataPie.colors.forEach((color, index) => {
    //     ctxPie.fillStyle = color;
    //     ctxPie.fillRect(20, 20 + index * 30, 15, 15);
    //     ctxPie.fillStyle = 'black';
    //     ctxPie.fillText(labels[index], 40, 32 + index * 30);
    // });

    //bar-chart
    const monday = specificReportData.monday_si;
    const tuesday = specificReportData.tuesday_si;
    const wednesday = specificReportData.wednesday_si;
    const thursday = specificReportData.thursday_si;
    const friday = specificReportData.friday_si;
    const saturday = specificReportData.saturday_si;
    const sunday = specificReportData.sunday_si;
    const canvasBar = document.getElementById('barChart');
    const ctxBar = canvasBar.getContext('2d');

    // Data for the bar chart (percentages for each day of the week)
    const dataBar = {
        days: ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'],
        percentages: [monday, tuesday, wednesday, thursday, friday, saturday, sunday] 
    };

    // Bar chart properties
    const barWidth = 15;
    const barSpacing = 40
    const chartHeight = canvasBar.height - 50;
    console.log(dataBar.percentages)
    const maxScaleValueh = 20; // Maximum scale value (assuming percentage data)

    // Draw the bars
    ctxBar.fillStyle = 'black';
    dataBar.percentages.forEach((percentage, index) => {
        const barHeight = (percentage / maxScaleValueh) * chartHeight; // Adjust calculation for bar height;
        const x = (barWidth + barSpacing) * index + 20;
        const y = (chartHeight - barHeight);
        ctxBar.fillRect(x, y, barWidth, barHeight);
    });

    // Draw the labels
    ctxBar.fillStyle = 'black';
    ctxBar.font = '14px tahoma';
    dataBar.days.forEach((day, index) => {
        const x = (barWidth + barSpacing) * index + 15;
        const y = chartHeight + 20;
        ctxBar.fillText(day, x, y);
        });

     
//scales
    // Draw the horizontal scale
    const scaleIntervalh = 2; // Interval between scale ticks
    ctxBar.lineWidth = 0.1; // Set the width of the horizontal lines
    for (let i = 0; i <= maxScaleValueh; i += scaleIntervalh) {
        const yPos = chartHeight - (i / maxScaleValueh) * chartHeight;
        ctxBar.moveTo(10, yPos); // Start at the left of the chart
        ctxBar.lineTo(canvasBar.width, yPos); // Draw a line to the right of the chart
        ctxBar.stroke();
        ctxBar.fillText(i.toString(), 0, yPos - 5); // Draw scale label
    }

});
} catch (error) {
    console.error('Error fetching report:', error);
}
});