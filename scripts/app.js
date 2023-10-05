document.addEventListener("DOMContentLoaded", function () {
    const savedShipsData = JSON.parse(localStorage.getItem('shipsData')) || [];

    const itemsContainer = document.getElementById("itemsContainer");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const cleanButton = document.getElementById("cleanButton");
    const expensiveSwitch = document.getElementById("expensiveSwitch");
    const countButton = document.getElementById("countButton");
    const totalExpenses = document.getElementById("totalExpenses");

    function populateShips(data) {
        itemsContainer.innerHTML = "";

        data.forEach((ship) => {
            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
            <div class="card" data-ship-id="${ship.id}">
                <div class="card-body">
                    <h5 class="card-title">${ship.name}</h5>
                    <p class="card-text">
                        ID: ${ship.id}<br>
                        Tonnage: ${ship.tonnage}<br>
                        Passengers: ${ship.number_of_passengers}<br>
                        Tonnage price: ${ship.tonnage_price}
                    </p>
                    <button class="btn btn-success edit-button">Edit</button>
                    <button class="btn btn-danger delete-button">Delete</button>
                </div>
            </div>
        `;

            const editButton = card.querySelector(".edit-button");
        editButton.addEventListener("click", () => {
            window.location.href = `edit.html?id=${ship.id}`;
        });

            const deleteButton = card.querySelector(".delete-button");
            deleteButton.addEventListener("click", () => {
                const shipId = ship.id;
                deleteShipById(shipId);
            });

            function deleteShipById(shipId) {
                const shipIndex = data.findIndex((ship) => ship.id === shipId);

                if (shipIndex !== -1) {
                    data.splice(shipIndex, 1);

                    const cardToRemove = document.querySelector(`[data-ship-id="${shipId}"]`);
                    if (cardToRemove) {
                        cardToRemove.remove();
                    }
                }

                localStorage.setItem('shipsData', JSON.stringify(data));
            }

            itemsContainer.appendChild(card);
        });
    }

    populateShips(savedShipsData);

    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredShips = savedShipsData.filter((ship) =>
            ship.name.toLowerCase().includes(searchTerm)
        );
        populateShips(filteredShips);
    });

    cleanButton.addEventListener("click", () => {
        searchInput.value = "";
        populateShips(savedShipsData);
    });

    expensiveSwitch.addEventListener("change", () => {
        const dataToSort = [...savedShipsData];
        if (expensiveSwitch.checked) {
            dataToSort.sort((a, b) => b.tonnage_price - a.tonnage_price);
        } else {
            dataToSort.sort((a, b) => a.tonnage_price - b.tonnage_price);
        }
        populateShips(dataToSort);
    });

    countButton.addEventListener("click", () => {
        totalExpenses.textContent = savedShipsData.reduce((total, ship) => total + ship.tonnage_price, 0);
    });
});
