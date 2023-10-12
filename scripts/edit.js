document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shipId = parseInt(urlParams.get('id'));

    const savedShipsData = JSON.parse(localStorage.getItem('shipsData')) || [];
    const shipToEdit = savedShipsData.find((ship) => ship.id === shipId);

    if (!shipToEdit) {
        console.error('Ship not found');
        return;
    }

    document.getElementById("name").value = shipToEdit.name;
    document.getElementById("tonnage").value = shipToEdit.tonnage;
    document.getElementById("passengers").value = shipToEdit.number_of_passengers;
    document.getElementById("tonnage_price").value = shipToEdit.tonnage_price;

    const editShipForm = document.getElementById("editShipForm");
    editShipForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const tonnage = parseFloat(document.getElementById("tonnage").value);
        const passengers = parseInt(document.getElementById("passengers").value);
        const tonnagePrice = parseFloat(document.getElementById("tonnage_price").value);

        if (!isNaN(tonnage) && !isNaN(passengers) && !isNaN(tonnagePrice)) {

            shipToEdit.name = name;
            shipToEdit.tonnage = tonnage;
            shipToEdit.number_of_passengers = passengers;
            shipToEdit.tonnage_price = tonnagePrice;


            localStorage.setItem('shipsData', JSON.stringify(savedShipsData));

            window.location.href = 'index.html';
        }
    });
});
