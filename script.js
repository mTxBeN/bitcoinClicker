document.addEventListener('DOMContentLoaded', () => {
    let bitcoins = 0;
    let bitcoinsPerClick = 1;
    let autoMiningRate = 0;
    let totalPurchases = 0;
    let totalSpent = 0;
    let totalEarned = 0;
    let playTimeInSeconds = 0;
    let testMode = false;
    let bitcoinsBeforeTest = 0;

    const bitcoinDisplay = document.getElementById('bitcoinDisplay');
    const miningRateDisplay = document.getElementById('miningRateDisplay');
    const clickRateDisplay = document.getElementById('clickRateDisplay');
    const clickButton = document.getElementById('clickButton');
    const buildingButtons = document.querySelectorAll('.building');
    const upgradeButtons = document.querySelectorAll('.upgrade');
    const playTimeDisplay = document.getElementById('playTime');
    const totalPurchasesDisplay = document.getElementById('totalPurchases');
    const totalSpentDisplay = document.getElementById('totalSpent');
    const totalEarnedDisplay = document.getElementById('totalEarned');
    const testModeButton = document.getElementById('testModeButton');

    let spacePressed = false;

    const formatNumber = (num) => {
        if (num >= 1e15) return (num / 1e15).toFixed(2) + ' Q';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + ' k';
        return num.toString();
    };

    const formatNumberPlain = (num) => {
        return num.toString();
    };

    const formatPlayTime = (seconds) => {
        const days = Math.floor(seconds / (24 * 3600));
        seconds %= (24 * 3600);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        let timeString = "";
        if (days > 0) {
            timeString += `${days} jour${days > 1 ? "s" : ""}, `;
        }
        if (hours > 0) {
            timeString += `${hours} heure${hours > 1 ? "s" : ""}, `;
        }
        if (minutes > 0) {
            timeString += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
        }
        timeString += `${seconds} seconde${seconds > 1 ? "s" : ""}`;

        return timeString;
    };

    const updateDisplay = () => {
        const format = document.getElementById('formatNumbers').checked ? formatNumber : formatNumberPlain;
        bitcoinDisplay.innerHTML = testMode ? `Bitcoins: <strong>Infini</strong>` : `Bitcoins: <strong>${format(bitcoins)}</strong>`;
        miningRateDisplay.textContent = `${format(autoMiningRate)} bitcoins par seconde`;
        clickRateDisplay.textContent = `${format(bitcoinsPerClick)} bitcoins par clic`;

        buildingButtons.forEach(button => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const count = parseInt(button.getAttribute('data-count'));
            const cost = Math.floor(baseCost * Math.pow(1.15, count));
            button.querySelector('.cost').textContent = `${format(cost)} 💰`;
            button.querySelector('.count').textContent = count;

            if ((bitcoins >= cost || testMode) && !testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#f0f0f0";
                button.style.cursor = "pointer";
            } else if (testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#e0e0e0";
                button.style.cursor = "pointer";
            } else {
                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                button.style.cursor = "not-allowed";
            }
        });

        upgradeButtons.forEach(button => {
            const baseCost = parseFloat(button.getAttribute('data-base-cost'));
            const count = parseInt(button.getAttribute('data-count'));
            const cost = Math.floor(baseCost * Math.pow(1.15, count));
            button.querySelector('.cost').textContent = `${format(cost)} 💰`;
            button.querySelector('.count').textContent = count;

            if ((bitcoins >= cost || testMode) && !testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#f0f0f0";
                button.style.cursor = "pointer";
            } else if (testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#e0e0e0";
                button.style.cursor = "pointer";
            } else {
                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                button.style.cursor = "not-allowed";
            }
        });

        playTimeDisplay.textContent = formatPlayTime(playTimeInSeconds);
        totalPurchasesDisplay.textContent = totalPurchases;
        totalSpentDisplay.textContent = `${format(totalSpent)} 💰`;
        totalEarnedDisplay.textContent = `${format(totalEarned)} 💰`;
    };

    const mineBitcoin = () => {
        bitcoins += bitcoinsPerClick;
        totalEarned += bitcoinsPerClick;
        updateDisplay();
    };

    clickButton.addEventListener('click', mineBitcoin);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !spacePressed) {
            mineBitcoin();
            spacePressed = true;
            event.preventDefault();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            spacePressed = false;
        }
    });

    buildingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const value = parseInt(button.getAttribute('data-value'));
            let count = parseInt(button.getAttribute('data-count'));

            const cost = Math.floor(baseCost * Math.pow(1.15, count));

            if (bitcoins >= cost || testMode) {
                if (!testMode) {
                    bitcoins -= cost;
                    totalSpent += cost;
                }
                autoMiningRate += value;
                totalPurchases += 1;
                count += 1;
                button.setAttribute('data-count', count);
                updateDisplay();
            }
        });
    });

    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const value = parseInt(button.getAttribute('data-value'));
            let count = parseInt(button.getAttribute('data-count'));

            const cost = Math.floor(baseCost * Math.pow(1.15, count));

            if (bitcoins >= cost || testMode) {
                if (!testMode) {
                    bitcoins -= cost;
                    totalSpent += cost;
                }
                bitcoinsPerClick += value;
                totalPurchases += 1;
                count += 1;
                button.setAttribute('data-count', count);
                updateDisplay();
            }
        });
    });

    setInterval(() => {
        bitcoins += autoMiningRate;
        playTimeInSeconds += 1;
        updateDisplay();
    }, 1000);

    window.openTab = (evt, tabName) => {
        let i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    document.getElementById("defaultOpen").click();

    const formatNumbersCheckbox = document.getElementById('formatNumbers');
    const lightModeRadio = document.getElementById('lightMode');
    const darkModeRadio = document.getElementById('darkMode');

    formatNumbersCheckbox.addEventListener('change', updateDisplay);

    lightModeRadio.addEventListener('change', () => {
        document.body.classList.remove('dark-mode');
    });

    darkModeRadio.addEventListener('change', () => {
        document.body.classList.add('dark-mode');
    });

    testModeButton.addEventListener('click', () => {
        if (!testMode) {
            const password = prompt("Entrez le mot de passe pour activer le mode test:");
            if (password === "mtxbenisthebest") {
                testMode = true;
                bitcoinsBeforeTest = bitcoins; // Sauvegarder le nombre de bitcoins actuel
                bitcoins = Number.MAX_SAFE_INTEGER; // Bitcoins infinis pour le mode test
                alert("Le mode test est activé ! Vous avez maintenant des bitcoins infinis.");
                testModeButton.textContent = "Désactiver le Mode Test";
                updateDisplay();
            } else {
                alert("Mot de passe incorrect. Veuillez réessayer.");
            }
        } else {
            testMode = false;
            bitcoins = bitcoinsBeforeTest; // Restaurer le nombre de bitcoins d'avant le mode test
            alert("Le mode test est désactivé. Vos bitcoins ont été restaurés.");
            testModeButton.textContent = "Activer le Mode Test";
            updateDisplay();
        }
    });
});
