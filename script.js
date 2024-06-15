document.addEventListener('DOMContentLoaded', () => {
    // Variables et éléments initiaux
    let bitcoins = 0;
    let bitcoinsPerClick = 1;
    let autoMiningRate = 0;
    let totalPurchases = 0;
    let totalSpent = 0;
    let totalEarned = 0;
    let playTimeInSeconds = 0;
    let testMode = false;
    let bitcoinsBeforeTest = 0;
    let manualClicks = 0;
    let manualBitcoinEarned = 0;
    let buildingBitcoinEarned = 0;
    let gameCreationDate = new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

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
    const manualClicksDisplay = document.getElementById('manualClicks');
    const manualBitcoinEarnedDisplay = document.getElementById('manualBitcoinEarned');
    const buildingBitcoinEarnedDisplay = document.getElementById('buildingBitcoinEarned');
    const gameCreationDateDisplay = document.getElementById('gameCreationDate');
    const testModeButton = document.getElementById('testModeButton');
    const saveGameButton = document.getElementById('saveGameButton');
    const loadGameButton = document.getElementById('loadGameButton');
    const exitPopup = document.getElementById('exitPopup');
    const saveBeforeExitButton = document.getElementById('saveBeforeExitButton');
    const continueExitButton = document.getElementById('continueExitButton');
    const initialPopup = document.getElementById('initialPopup');
    const newGameButton = document.getElementById('newGameButton');
    const loadGameFromPopupButton = document.getElementById('loadGameFromPopupButton');
    const loadGameFromFileButton = document.getElementById('loadGameFromFileButton');
    const loadGameFromFileInput = document.getElementById('loadGameFromFileInput');

    let spacePressed = false;

    // Encode text to base64
    function encodeBase64(input) {
        return btoa(unescape(encodeURIComponent(input)));
    }

    // Decode base64 to text
    function decodeBase64(input) {
        return decodeURIComponent(escape(atob(input)));
    }

    // Format numbers for display
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

    // Format play time for display
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

    // Update display for all elements
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
                button.style.color = "#333";
                button.style.cursor = "pointer";
            } else if (testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#e0e0e0";
                button.style.color = "#333";
                button.style.cursor = "pointer";
            } else {
                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                button.style.color = "#888";
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
                button.style.color = "#333";
                button.style.cursor = "pointer";
            } else if (testMode) {
                button.disabled = false;
                button.style.backgroundColor = "#e0e0e0";
                button.style.color = "#333";
                button.style.cursor = "pointer";
            } else {
                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                button.style.color = "#888";
                button.style.cursor = "not-allowed";
            }
        });

        playTimeDisplay.textContent = formatPlayTime(playTimeInSeconds);
        totalPurchasesDisplay.textContent = totalPurchases;
        totalSpentDisplay.textContent = `${format(totalSpent)} 💰`;
        totalEarnedDisplay.textContent = `${format(totalEarned)} 💰`;
        manualClicksDisplay.textContent = manualClicks;
        manualBitcoinEarnedDisplay.textContent = `${format(manualBitcoinEarned)} 💰`;
        buildingBitcoinEarnedDisplay.textContent = `${format(buildingBitcoinEarned)} 💰`;
        gameCreationDateDisplay.textContent = gameCreationDate;
    };

    // Function to mine bitcoin on click
    const mineBitcoin = () => {
        bitcoins += bitcoinsPerClick;
        manualClicks += 1;
        manualBitcoinEarned += bitcoinsPerClick;
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
        const minedBitcoins = autoMiningRate;
        bitcoins += minedBitcoins;
        buildingBitcoinEarned += minedBitcoins;
        totalEarned += minedBitcoins;
        playTimeInSeconds += 1;
        updateDisplay();
    }, 1000);

    // Onglets
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

    // Activer/Désactiver le mode test
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

    // Sauvegarder la partie
    saveGameButton.addEventListener('click', () => {
        const saveData = {
            bitcoins,
            bitcoinsPerClick,
            autoMiningRate,
            totalPurchases,
            totalSpent,
            totalEarned,
            playTimeInSeconds,
            manualClicks,
            manualBitcoinEarned,
            buildingBitcoinEarned,
            gameCreationDate,
            buildings: Array.from(buildingButtons).map(button => ({
                baseCost: button.getAttribute('data-base-cost'),
                count: button.getAttribute('data-count')
            })),
            upgrades: Array.from(upgradeButtons).map(button => ({
                baseCost: button.getAttribute('data-base-cost'),
                count: button.getAttribute('data-count')
            }))
        };

        const saveText = JSON.stringify(saveData);
        const encodedSaveText = encodeBase64(saveText);
        const saveBlob = new Blob([encodedSaveText], { type: 'text/plain' });
        const saveUrl = URL.createObjectURL(saveBlob);
        const saveLink = document.createElement('a');
        saveLink.href = saveUrl;
        saveLink.download = `bitcoinClickerSave${Date.now()}.txt`;
        saveLink.click();
    });

    // Charger la partie depuis la popup initiale
    loadGameFromPopupButton.addEventListener('click', () => {
        const saveText = prompt("Collez ici les données de sauvegarde pour charger la partie :");
        if (saveText) {
            try {
                const decodedSaveText = decodeBase64(saveText);
                const saveData = JSON.parse(decodedSaveText);
                bitcoins = saveData.bitcoins;
                bitcoinsPerClick = saveData.bitcoinsPerClick;
                autoMiningRate = saveData.autoMiningRate;
                totalPurchases = saveData.totalPurchases;
                totalSpent = saveData.totalSpent;
                totalEarned = saveData.totalEarned;
                playTimeInSeconds = saveData.playTimeInSeconds;
                manualClicks = saveData.manualClicks;
                manualBitcoinEarned = saveData.manualBitcoinEarned;
                buildingBitcoinEarned = saveData.buildingBitcoinEarned;
                gameCreationDate = saveData.gameCreationDate;

                saveData.buildings.forEach((building, index) => {
                    const button = buildingButtons[index];
                    button.setAttribute('data-base-cost', building.baseCost);
                    button.setAttribute('data-count', building.count);
                });

                saveData.upgrades.forEach((upgrade, index) => {
                    const button = upgradeButtons[index];
                    button.setAttribute('data-base-cost', upgrade.baseCost);
                    button.setAttribute('data-count', upgrade.count);
                });

                updateDisplay();
                initialPopup.style.display = 'none';
                alert("La partie a été chargée avec succès !");
            } catch (error) {
                alert("Erreur lors du chargement de la partie. Veuillez vérifier les données de sauvegarde.");
            }
        }
    });

    // Charger la partie depuis un fichier
    loadGameFromFileButton.addEventListener('click', () => {
        loadGameFromFileInput.click();
    });

    loadGameFromFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const saveText = e.target.result;
                try {
                    const decodedSaveText = decodeBase64(saveText);
                    const saveData = JSON.parse(decodedSaveText);
                    bitcoins = saveData.bitcoins;
                    bitcoinsPerClick = saveData.bitcoinsPerClick;
                    autoMiningRate = saveData.autoMiningRate;
                    totalPurchases = saveData.totalPurchases;
                    totalSpent = saveData.totalSpent;
                    totalEarned = saveData.totalEarned;
                    playTimeInSeconds = saveData.playTimeInSeconds;
                    manualClicks = saveData.manualClicks;
                    manualBitcoinEarned = saveData.manualBitcoinEarned;
                    buildingBitcoinEarned = saveData.buildingBitcoinEarned;
                    gameCreationDate = saveData.gameCreationDate;

                    saveData.buildings.forEach((building, index) => {
                        const button = buildingButtons[index];
                        button.setAttribute('data-base-cost', building.baseCost);
                        button.setAttribute('data-count', building.count);
                    });

                    saveData.upgrades.forEach((upgrade, index) => {
                        const button = upgradeButtons[index];
                        button.setAttribute('data-base-cost', upgrade.baseCost);
                        button.setAttribute('data-count', upgrade.count);
                    });

                    updateDisplay();
                    initialPopup.style.display = 'none';
                    alert("La partie a été chargée avec succès !");
                } catch (error) {
                    alert("Erreur lors du chargement de la partie. Veuillez vérifier les données de sauvegarde.");
                }
            };
            reader.readAsText(file);
        }
    });

    // Sauvegarder la partie avant de quitter
    saveBeforeExitButton.addEventListener('click', () => {
        const saveData = {
            bitcoins,
            bitcoinsPerClick,
            autoMiningRate,
            totalPurchases,
            totalSpent,
            totalEarned,
            playTimeInSeconds,
            manualClicks,
            manualBitcoinEarned,
            buildingBitcoinEarned,
            gameCreationDate,
            buildings: Array.from(buildingButtons).map(button => ({
                baseCost: button.getAttribute('data-base-cost'),
                count: button.getAttribute('data-count')
            })),
            upgrades: Array.from(upgradeButtons).map(button => ({
                baseCost: button.getAttribute('data-base-cost'),
                count: button.getAttribute('data-count')
            }))
        };

        const saveText = JSON.stringify(saveData);
        const encodedSaveText = encodeBase64(saveText);
        const saveBlob = new Blob([encodedSaveText], { type: 'text/plain' });
        const saveUrl = URL.createObjectURL(saveBlob);
        const saveLink = document.createElement('a');
        saveLink.href = saveUrl;
        saveLink.download = `bitcoinClickerSave${Date.now()}.txt`;
        saveLink.click();
        exitPopup.style.display = 'none';
        window.removeEventListener('beforeunload', null);
    });

    continueExitButton.addEventListener('click', () => {
        exitPopup.style.display = 'none';
        window.removeEventListener('beforeunload', null);
        window.close();
    });

    // Fonction pour gérer la sortie
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        exitPopup.style.display = 'flex';
        event.returnValue = 'Vous avez des progrès non sauvegardés. Voulez-vous vraiment quitter sans sauvegarder ?';
        return 'Vous avez des progrès non sauvegardés. Voulez-vous vraiment quitter sans sauvegarder ?';
    });

    // Fonction pour afficher la popup initiale
    const showInitialPopup = () => {
        initialPopup.style.display = 'block';
    };

    // Appel de la fonction pour afficher la popup initiale
    showInitialPopup();

    // Nouvelle partie
    newGameButton.addEventListener('click', () => {
        initialPopup.style.display = 'none';
        // Initialiser les valeurs pour une nouvelle partie
        bitcoins = 0;
        bitcoinsPerClick = 1;
        autoMiningRate = 0;
        totalPurchases = 0;
        totalSpent = 0;
        totalEarned = 0;
        playTimeInSeconds = 0;
        manualClicks = 0;
        manualBitcoinEarned = 0;
        buildingBitcoinEarned = 0;
        gameCreationDate = new Date().toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        updateDisplay();
    });
});
