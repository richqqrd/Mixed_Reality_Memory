
window.saveLeaderboardEntry = function (name, time) {
    console.log("saveLeaderboardEntry called with:", name, time);
    if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
        console.error("Invalid time format:", time);
        return;
    }
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log("Aktuelles Leaderboard vor dem Hinzufügen:", leaderboard);

    leaderboard.push({ name: name, time: time });
    console.log("Neuer Eintrag hinzugefügt:", { name: name, time: time });

    leaderboard.sort((a, b) => {
        const [aMin, aSec] = a.time.split(':').map(Number);
        const [bMin, bSec] = b.time.split(':').map(Number);
        return (aMin * 60 + aSec) - (bMin * 60 + bSec);
    });

    leaderboard = leaderboard.slice(0, 4);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    console.log("Leaderboard in localStorage gespeichert.");

    window.updateLeaderboardUI();
};

window.updateLeaderboardUI = function () {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.log("Leaderboard geladen aus localStorage:", leaderboard);

    for (let i = 0; i < 4; i++) {
        const entryLabel = document.querySelector(`#leaderboardEntry${i + 1}`);
        if (leaderboard[i]) {
            entryLabel.setAttribute('value', `${i + 1}. ${leaderboard[i].name} (${leaderboard[i].time})`);
        } else {
            entryLabel.setAttribute('value', `${i + 1}. ---`);
        }
    }
};