// leaderboard.js

// Funktion zum Speichern eines neuen Leaderboard-Eintrags
window.saveLeaderboardEntry = function (name, time) {
    // Leaderboard aus localStorage laden oder neues Array erstellen
    console.log("saveLeaderboardEntry called with:", name, time);
    if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
        console.error("Invalid time format:", time);
        return; // Beende die Funktion, wenn das Format ungültig ist
    }
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log("Aktuelles Leaderboard vor dem Hinzufügen:", leaderboard); // Log hinzufügen

    // Neuen Eintrag hinzufügen
    leaderboard.push({ name: name, time: time });
    console.log("Neuer Eintrag hinzugefügt:", { name: name, time: time }); // Log hinzufügen

    // Leaderboard nach Zeit sortieren (MM:SS → Sekunden)
    leaderboard.sort((a, b) => {
        const [aMin, aSec] = a.time.split(':').map(Number);
        const [bMin, bSec] = b.time.split(':').map(Number);
        return (aMin * 60 + aSec) - (bMin * 60 + bSec);
    });

    // Optional: Begrenze das Leaderboard auf die Top 4 Einträge
    leaderboard = leaderboard.slice(0, 4);

    // Leaderboard in localStorage speichern
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    console.log("Leaderboard in localStorage gespeichert."); // Log hinzufügen

    // Leaderboard im UI aktualisieren
    window.updateLeaderboardUI();
};

// Funktion zum Aktualisieren des Leaderboard-UI
window.updateLeaderboardUI = function () {
    // Leaderboard aus localStorage laden
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log("Leaderboard geladen aus localStorage:", leaderboard);

    // **Aktualisiere nur die Top 4 Einträge**
    for (let i = 0; i < 4; i++) { // Ändere die Schleife von 10 auf 4
        const entryLabel = document.querySelector(`#leaderboardEntry${i + 1}`);
        if (leaderboard[i]) {
            entryLabel.setAttribute('value', `${i + 1}. ${leaderboard[i].name} (${leaderboard[i].time})`);
        } else {
            entryLabel.setAttribute('value', `${i + 1}. ---`);
        }
    }

    console.log("Leaderboard UI aktualisiert mit den Top 4 Einträgen.");
};