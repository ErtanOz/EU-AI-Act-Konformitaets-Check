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
}

// Werte für Diagramm live aktualisieren
function updateChart(score) {
    let ctx = document.getElementById("chart").getContext("2d");

    // Falls Diagramm existiert, zerstören & neu erstellen
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

// Sicherstellen, dass Chart beim Start gerendert wird
document.addEventListener("DOMContentLoaded", () => updateChart(0));
