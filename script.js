const esp32Url = "http://192.168.1.100/data"; // Replace with your ESP32 IP address

let weightHistory = [];
let currencyHistory = [];
let timeLabels = [];

async function fetchData() {
  try {
    const response = await fetch(esp32Url);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Update current weight and currency
    document.getElementById("weight-value").innerText = `${data.weight} kg`;
    document.getElementById("currency").innerText = `${data.currency} USD`;

    // Add to history
    const currentTime = new Date().toLocaleTimeString();
    weightHistory.push(data.weight);
    currencyHistory.push(data.currency);
    timeLabels.push(currentTime);

    // Update history table
    const tableBody = document.getElementById("history-data");
    const row = `<tr><td>${currentTime}</td><td>${data.weight}</td><td>${data.currency}</td></tr>`;
    tableBody.innerHTML += row;

    // Update graph
    updateGraph();
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("weight-value").innerText = "Error loading weight";
    document.getElementById("currency").innerText = "Error loading currency";
  }
}

// Set up Chart.js
const ctx = document.getElementById("weight-chart").getContext("2d");
const weightChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Time labels
    datasets: [
      {
        label: "Weight (kg)",
        data: [], // Weight data
        borderColor: "black",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Weight (kg)" } },
    },
  },
});

// Function to update the graph
function updateGraph() {
  weightChart.data.labels = timeLabels;
  weightChart.data.datasets[0].data = weightHistory;
  weightChart.update();
}

// Fetch data every 2 seconds
setInterval(fetchData, 2000);
