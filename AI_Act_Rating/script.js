let chartInstance;

// Bewertung berechnen & Live-Chart aktualisieren
function calculateScore() {
    let score = getScore();
    let resultText = "";
    let resultClass = "";

    if (score >= 10) {
        resultText = "⚠️ Hohes Risiko!";
        resultClass = "high-risk";
    } else if (score >= 5) {
        resultText = "⚠️ Mittleres Risiko!";
        resultClass = "medium-risk";
    } else {
        resultText = "✅ Niedriges Risiko!";
        resultClass = "low-risk";
    }

    let resultElement = document.getElementById("result");
    resultElement.innerText = resultText;
    resultElement.className = resultClass;

    updateChart(score);
    saveSelections();
}

// Werte für Diagramm live aktualisieren
function updateChart(score) {
    let ctx = document.getElementById("chart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Niedrig", "Mittel", "Hoch"],
            datasets: [{
                label: "Risiko-Einstufung",
                data: [score < 5 ? 1 : 0, (score >= 5 && score < 10) ? 1 : 0, score >= 10 ? 1 : 0],
                backgroundColor: ["green", "orange", "red"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 1, display: false }
            }
        }
    });
}

// Score berechnen basierend auf den Antworten
function getScore() {
    return [...document.querySelectorAll("select")].reduce((sum, el) => sum + parseInt(el.value), 0);
}

// Speichert die Auswahl des Nutzers im localStorage
function saveSelections() {
    let selections = {};
    document.querySelectorAll("select").forEach(select => {
        selections[select.id] = select.value;
    });
    localStorage.setItem("userSelections", JSON.stringify(selections));
}

// Lädt gespeicherte Auswahl beim Start
function loadSelections() {
    let selections = JSON.parse(localStorage.getItem("userSelections"));
    if (selections) {
        document.querySelectorAll("select").forEach(select => {
            if (selections[select.id]) {
                select.value = selections[select.id];
            }
        });
    }
    calculateScore();
}

// Reset-Funktion
function resetForm() {
    document.querySelectorAll("select").forEach(select => {
        select.value = "0";
    });
    localStorage.removeItem("userSelections");
    calculateScore();
}

// Sicherstellen, dass Chart und gespeicherte Daten geladen werden
document.addEventListener("DOMContentLoaded", () => {
    loadSelections();
    updateChart(0);
});
