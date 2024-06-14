document.addEventListener('DOMContentLoaded', () => {
    let bitcoins = 0;
    let bitcoinsPerClick = 1;
    let autoMiningRate = 0;

    const bitcoinDisplay = document.getElementById('bitcoinDisplay');
    const miningRateDisplay = document.getElementById('miningRateDisplay');
    const clickRateDisplay = document.getElementById('clickRateDisplay');
    const clickButton = document.getElementById('clickButton');
    const buildingButtons = document.querySelectorAll('.building');
    const upgradeButtons = document.querySelectorAll('.upgrade');

    // Variable pour suivre l'état de la touche espace
    let spacePressed = false;

    // Fonction pour formater les grands nombres
    const formatNumber = (num) => {
        if (num >= 1e15) return (num / 1e15).toFixed(2) + ' Q';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + ' k';
        return num.toString();
    };

    // Fonction pour mettre à jour l'affichage
    const updateDisplay = () => {
        bitcoinDisplay.innerHTML = `Bitcoins: <strong>${formatNumber(bitcoins)}</strong>`;
        miningRateDisplay.textContent = `${formatNumber(autoMiningRate)} bitcoins par seconde`;
        clickRateDisplay.textContent = `${formatNumber(bitcoinsPerClick)} bitcoins par clic`;

        buildingButtons.forEach(button => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const count = parseInt(button.getAttribute('data-count'));
            const cost = Math.floor(baseCost * Math.pow(1.15, count));
            button.querySelector('.cost').textContent = `${formatNumber(cost)} 💰`;
            button.querySelector('.count').textContent = count;

            // Mettre à jour la description avec le nombre formaté
            const description = button.getAttribute('data-description');
            button.querySelector('.description').innerHTML = description.replace(/\d+(\.\d+)?/, match => formatNumber(parseFloat(match)));

            if (bitcoins >= cost) {
                button.disabled = false;
                button.style.backgroundColor = "#f0f0f0";
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
            button.querySelector('.cost').textContent = `${formatNumber(cost)} 💰`;
            button.querySelector('.count').textContent = count;

            // Mettre à jour la description avec le nombre formaté
            const description = button.getAttribute('data-description');
            button.querySelector('.description').innerHTML = description.replace(/\d+(\.\d+)?/, match => formatNumber(parseFloat(match)));

            if (bitcoins >= cost) {
                button.disabled = false;
                button.style.backgroundColor = "#f0f0f0";
                button.style.cursor = "pointer";
            } else {
                button.disabled = true;
                button.style.backgroundColor = "#ccc";
                button.style.cursor = "not-allowed";
            }
        });
    };

    // Fonction de minage
    const mineBitcoin = () => {
        bitcoins += bitcoinsPerClick;
        updateDisplay();
    };

    clickButton.addEventListener('click', mineBitcoin);

    // Ajout de l'écouteur d'événements pour la barre d'espace
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !spacePressed) {
            mineBitcoin();
            spacePressed = true; // Empêche le déclenchement multiple lors du maintien de la touche
            event.preventDefault();  // Empêche le défilement de la page lorsqu'on appuie sur la barre d'espace
        }
    });

    // Réinitialiser l'état de la touche espace lors du relâchement
    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            spacePressed = false;
        }
    });

    // Fonction pour gérer les achats de bâtiments
    buildingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const value = parseInt(button.getAttribute('data-value'));
            let count = parseInt(button.getAttribute('data-count'));

            const cost = Math.floor(baseCost * Math.pow(1.15, count));

            if (bitcoins >= cost) {
                bitcoins -= cost;
                autoMiningRate += value;
                count += 1;
                button.setAttribute('data-count', count);
                updateDisplay();
            }
        });
    });

    // Fonction pour gérer les achats d'améliorations
    upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const baseCost = parseInt(button.getAttribute('data-base-cost'));
            const value = parseInt(button.getAttribute('data-value'));
            let count = parseInt(button.getAttribute('data-count'));

            const cost = Math.floor(baseCost * Math.pow(1.15, count));

            if (bitcoins >= cost) {
                bitcoins -= cost;
                bitcoinsPerClick += value;
                count += 1;
                button.setAttribute('data-count', count);
                updateDisplay();
            }
        });
    });

    // Fonction pour miner automatiquement
    setInterval(() => {
        bitcoins += autoMiningRate;
        updateDisplay();
    }, 1000);

    // Initialiser l'affichage
    updateDisplay();
});
