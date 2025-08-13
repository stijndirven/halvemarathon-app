// Voorbeeld trainingsschema
let trainingsSchema = JSON.parse(localStorage.getItem("trainingsSchema")) || [
    { datum: "2025-08-14", type: "Duurloop", afstand: 10, tijd: 60, voltooid: false, notitie: "" },
    { datum: "2025-08-16", type: "Interval", afstand: 8, tijd: 50, voltooid: false, notitie: "" },
    { datum: "2025-08-18", type: "Herstel", afstand: 5, tijd: 40, voltooid: false, notitie: "" },
    { datum: "2025-08-20", type: "Duurloop", afstand: 12, tijd: 70, voltooid: false, notitie: "" }
];

// Functie om data op te slaan
function saveData() {
    localStorage.setItem("trainingsSchema", JSON.stringify(trainingsSchema));
}

// Functie om dashboard bij te werken
function updateDashboard() {
    const next = trainingsSchema.find(t => !t.voltooid);
    document.getElementById("next-training-info").innerHTML = next ? 
        `${next.datum}: ${next.type}, ${next.afstand} km in ${next.tijd} min` : 
        "Geen trainingen gepland.";

    const totalDistance = trainingsSchema.filter(t => t.voltooid).reduce((sum, t) => sum + t.afstand, 0);
    const totalCompleted = trainingsSchema.filter(t => t.voltooid).length;

    document.getElementById("total-distance").textContent = `Totaal afstand: ${totalDistance} km`;
    document.getElementById("total-completed").textContent = `Voltooide trainingen: ${totalCompleted}`;

    // Trainingslijst
    const listEl = document.getElementById("training-list");
    listEl.innerHTML = "";
    trainingsSchema.slice(0,5).forEach((t, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${t.datum}: ${t.type}, ${t.afstand} km 
                        <button class="complete" onclick="completeTraining(${index})">Voltooid</button>
                        <button class="skip" onclick="skipTraining(${index})">Overslaan</button>
                        <input class="notitie" type="text" placeholder="Notitie" 
                               value="${t.notitie}" onchange="addNote(${index}, this.value)">`;
        listEl.appendChild(li);
    });

    updateChart();
}

// Functies voor interactie
function completeTraining(index) {
    trainingsSchema[index].voltooid = true;
    saveData();
    updateDashboard();
}

function skipTraining(index) {
    trainingsSchema[index].voltooid = true; // markeer als voltooid
    saveData();
    updateDashboard();
}

function addNote(index, note) {
    trainingsSchema[index].notitie = note;
    saveData();
}

// Grafiek
let chart;
function updateChart() {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    const labels = trainingsSchema.map(t => t.datum);
    const data = trainingsSchema.map(t => t.voltooid ? t.afstand : 0);

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Afstand per training (km)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Initialiseer
updateDashboard();
