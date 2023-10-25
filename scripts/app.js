document.addEventListener("DOMContentLoaded", function () {
    const savedShipsData = JSON.parse(localStorage.getItem('shipsData')) || [];

    const itemsContainer = document.getElementById("itemsContainer");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const cleanButton = document.getElementById("cleanButton");
    const expensiveSwitch = document.getElementById("expensiveSwitch");
    const countButton = document.getElementById("countButton");
    const totalExpenses = document.getElementById("totalExpenses");

    let isSorted = false; // Flag to track sorting state
    let shipData = [];

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
                const cardToRemove = document.querySelector(`[data-ship-id="${shipId}"]`);
                if (cardToRemove) {
                    cardToRemove.remove();
                }
                fetch(`http://localhost:5000/delete_ship/${shipId}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Ship deleted successfully') {
                            // Remove the ship from shipData
                            const shipIndex = shipData.findIndex(ship => ship.id === shipId);
                            if (shipIndex !== -1) {
                                shipData.splice(shipIndex, 1);
                            }

                            // Remove the ship card from the UI
                            const cardToRemove = document.querySelector(`[data-ship-id="${shipId}"]`);
                            if (cardToRemove) {
                                cardToRemove.remove();
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting ship:', error);
                    });
            }

            itemsContainer.appendChild(card);
        });
    }

    // Function to fetch ship data from the backend
    function fetchShips(sortParam = 0) {
        fetch(`http://localhost:5000/get_ships?sort_by_price=${sortParam}`)
            .then((response) => response.json())
            .then((data) => {
                isSorted = sortParam === "1"; // Update sorting flag
                shipData = data
                populateShips(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    // Populate the ships on page load
    fetchShips();

    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        fetch(`http://localhost:5000/search_ships?search_term=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                populateShips(data);
            })
            .catch(error => {
                console.error('Error searching ships:', error);
            });
    });

    cleanButton.addEventListener("click", () => {
        searchInput.value = "";
        fetchShips(); // Reset to unsorted state
    });

    expensiveSwitch.addEventListener("change", () => {
        const sortParam = expensiveSwitch.checked ? "1" : "0";
        fetchShips(sortParam);
    });

    countButton.addEventListener("click", () => {
        const totalExpense = calculateTotalExpense(shipData);
        totalExpenses.textContent = totalExpense;
    });

    function calculateTotalExpense(ships) {
        return ships.reduce((total, ship) => total + ship.tonnage_price, 0);
    }
});
