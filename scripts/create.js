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
                name: name,
                tonnage: tonnage,
                number_of_passengers: passengers,
                tonnage_price: tonnage_price,
            };

            createShip(newShip);
        }
    });

    function createShip(shipData) {
        fetch('http://localhost:5000/create_ship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Ship created successfully') {
                alert('Ship created successfully');
                window.location.href = 'index.html';
            } else {
                alert('Failed to create the ship');
            }
        })
        .catch(error => {
            console.error('Error creating ship:', error);
        });
    }
});
