import {shipsData} from './shipsData.js';

document.addEventListener("DOMContentLoaded", function () {
    const createShipForm = document.getElementById("createShipForm");

    createShipForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const tonnage = parseFloat(document.getElementById("tonnage").value);
        const passengers = parseInt(document.getElementById("passengers").value);
        const tonnage_price = parseFloat(document.getElementById("tonnage_price").value);

        if (name && !isNaN(tonnage) && !isNaN(passengers) && !isNaN(tonnage_price)) {
            const newShip = {
                id: generateUniqueId(),
                name: name,
                tonnage: tonnage,
                number_of_passengers: passengers,
                tonnage_price: tonnage_price,
            };

            shipsData.push(newShip);
            saveShipsData(shipsData);
            window.location.href = 'index.html'
            console.log(shipsData)
        }
    });

    function generateUniqueId() {
        return Math.floor(Math.random() * Date.now());
    }

    function saveShipsData(data) {
        localStorage.setItem('shipsData', JSON.stringify(data));
    }
});
