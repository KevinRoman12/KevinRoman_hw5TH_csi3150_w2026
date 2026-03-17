const carListings = document.getElementById("carListings");
const filterForm = document.getElementById("filterForm");
const resetBtn = document.getElementById("resetBtn");
const noResultsMessage = document.getElementById("noResultsMessage");
const resultsCount = document.getElementById("resultsCount");

const minYearInput = document.getElementById("minYear");
const maxYearInput = document.getElementById("maxYear");
const makeSelect = document.getElementById("makeSelect");
const maxMileageInput = document.getElementById("maxMileage");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const colorSelect = document.getElementById("colorSelect");

function populateFilterOptions() {
  const uniqueMakes = [...new Set(usedCars.map((car) => car.make))].sort();
  const uniqueColors = [...new Set(usedCars.map((car) => car.color))].sort();

  uniqueMakes.forEach((make) => {
    const option = document.createElement("option");
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  });

  uniqueColors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorSelect.appendChild(option);
  });
}

function getSelectedOptions(selectElement) {
  return Array.from(selectElement.selectedOptions).map((option) => option.value);
}

function formatPrice(price) {
  return `$${price.toLocaleString()}`;
}

function createCarCard(car) {
  const card = document.createElement("article");
  card.classList.add("car-card");

  card.innerHTML = `
    <div class="car-card-header">
      <h3>${car.year} ${car.make} ${car.model}</h3>
      <p>${car.color}</p>
    </div>
    <div class="car-card-body">
      <p class="car-info"><strong>Year:</strong> ${car.year}</p>
      <p class="car-info"><strong>Make:</strong> ${car.make}</p>
      <p class="car-info"><strong>Model:</strong> ${car.model}</p>
      <p class="car-info"><strong>Mileage:</strong> ${car.mileage.toLocaleString()} miles</p>
      <p class="car-info"><strong>Fuel Economy:</strong> ${car.gasMileage}</p>
      <p class="car-info"><strong>Color:</strong> ${car.color}</p>
      <p class="price-tag">${formatPrice(car.price)}</p>
    </div>
  `;

  return card;
}

function displayCars(cars) {
  carListings.innerHTML = "";

  if (cars.length === 0) {
    noResultsMessage.classList.remove("hidden");
    resultsCount.textContent = "0 cars found";
    return;
  }

  noResultsMessage.classList.add("hidden");
  resultsCount.textContent = `${cars.length} car${cars.length !== 1 ? "s" : ""} found`;

  cars.forEach((car) => {
    const carCard = createCarCard(car);
    carListings.appendChild(carCard);
  });
}

function applyFilters() {
  const minYear = minYearInput.value ? parseInt(minYearInput.value) : null;
  const maxYear = maxYearInput.value ? parseInt(maxYearInput.value) : null;
  const selectedMakes = getSelectedOptions(makeSelect);
  const maxMileage = maxMileageInput.value ? parseInt(maxMileageInput.value) : null;
  const minPrice = minPriceInput.value ? parseInt(minPriceInput.value) : null;
  const maxPrice = maxPriceInput.value ? parseInt(maxPriceInput.value) : null;
  const selectedColors = getSelectedOptions(colorSelect);

  const filteredCars = usedCars.filter((car) => {
    const matchesMinYear = minYear === null || car.year >= minYear;
    const matchesMaxYear = maxYear === null || car.year <= maxYear;
    const matchesMake =
      selectedMakes.length === 0 || selectedMakes.includes(car.make);
    const matchesMaxMileage =
      maxMileage === null || car.mileage <= maxMileage;
    const matchesMinPrice =
      minPrice === null || car.price >= minPrice;
    const matchesMaxPrice =
      maxPrice === null || car.price <= maxPrice;
    const matchesColor =
      selectedColors.length === 0 || selectedColors.includes(car.color);

    return (
      matchesMinYear &&
      matchesMaxYear &&
      matchesMake &&
      matchesMaxMileage &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesColor
    );
  });

  displayCars(filteredCars);
}

function resetFilters() {
  filterForm.reset();

  Array.from(makeSelect.options).forEach((option) => {
    option.selected = false;
  });

  Array.from(colorSelect.options).forEach((option) => {
    option.selected = false;
  });

  displayCars(usedCars);
}

filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  applyFilters();
});

resetBtn.addEventListener("click", resetFilters);

populateFilterOptions();
displayCars(usedCars);