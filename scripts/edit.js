document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shipId = parseInt(urlParams.get('id'));

    const editShipForm = document.getElementById("editShipForm");

    // Fetch ship data and populate the form
    fetch(`http://localhost:5000/get_ship/${shipId}`)
        .then(response => response.json())
        .then(data => {
            if (data.ship) {
                const shipToEdit = data.ship;

                document.getElementById("name").value = shipToEdit.name;
                document.getElementById("tonnage").value = shipToEdit.tonnage;
                document.getElementById("passengers").value = shipToEdit.number_of_passengers;
                document.getElementById("tonnage_price").value = shipToEdit.tonnage_price;

                editShipForm.addEventListener("submit", function (event) {
                    event.preventDefault();

                    const name = document.getElementById("name").value;
                    const tonnage = parseFloat(document.getElementById("tonnage").value);
                    const passengers = parseInt(document.getElementById("passengers").value);
                    const tonnagePrice = parseFloat(document.getElementById("tonnage_price").value);

                    if (!isNaN(tonnage) && !isNaN(passengers) && !isNaN(tonnagePrice)) {
                        const updatedShip = {
                            name: name,
                            tonnage: tonnage,
                            number_of_passengers: passengers,
                            tonnage_price: tonnagePrice,
                        };

                        // Send a PUT request to update the ship
                        fetch(`http://localhost:5000/edit_ship/${shipId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedShip),
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.message === 'Ship updated successfully') {
                                    alert('Ship updated successfully');
                                    window.location.href = 'index.html'; // Redirect to the main page
                                } else {
                                    alert('Failed to update the ship');
                                }
                            })
                            .catch(error => {
                                console.error('Error updating ship:', error);
                            });
                    }
                });
            } else {
                console.error('Ship not found');
            }
        })
        .catch(error => {
            console.error('Error fetching ship data:', error);
        });
});
