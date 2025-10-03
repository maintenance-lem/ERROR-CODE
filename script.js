const machineSelect = document.getElementById("machineDropdown");
const laserSelect = document.getElementById("laserDropdown");
const errorSelect = document.getElementById("errorDropdown");
const detailsList = document.getElementById("detailsList");

const topMachine = document.getElementById("topMachine");
const topLaser = document.getElementById("topLaser");
const topError = document.getElementById("topError");

const counts = {
  machines: {},
  lasers: {},
  errors: {}
};

function populateLasers(machine) {
  laserSelect.innerHTML = "";
  errorSelect.innerHTML = "";
  detailsList.innerHTML = "";

  const lasers = Object.keys(machineData[machine] || {});
  lasers.forEach(laser => {
    const option = document.createElement("option");
    option.value = laser;
    option.textContent = laser;
    laserSelect.appendChild(option);
  });

  if (lasers.length > 0) {
    laserSelect.value = lasers[0];
    populateErrors(machine, lasers[0]);
  }
}

function populateErrors(machine, laser) {
  errorSelect.innerHTML = "";
  detailsList.innerHTML = "";

  const errors = Object.keys(machineData[machine]?.[laser] || {});
  errors.forEach(error => {
    const option = document.createElement("option");
    option.value = error;
    option.textContent = error;
    errorSelect.appendChild(option);
  });

  if (errors.length > 0) {
    errorSelect.value = errors[0];
    showDetails(machine, laser, errors[0]);
  }
}

function showDetails(machine, laser, error) {
  detailsList.innerHTML = "";

  const entries = machineData[machine]?.[laser]?.[error] || [];

  entries.forEach(entry => {
    const fields = [
      { label: "🕒 When", value: entry.when },
      { label: "🔧 What", value: entry.what },
      { label: "📦 Reason Code", value: entry.reason_code },
      { label: "📝 Description", value: entry.reason_desc }
    ];

    fields.forEach(field => {
      const li = document.createElement("li");
      li.textContent = `${field.label}: ${field.value}`;
      detailsList.appendChild(li);
    });
  });
}

function updateTopCounts(type, value) {
  if (!value) return;
  counts[type][value] = (counts[type][value] || 0) + 1;
  const top = Object.entries(counts[type]).sort((a, b) => b[1] - a[1])[0];

  if (type === "machines") topMachine.textContent = `🔥 Top Machine: ${top[0]} (${top[1]})`;
  if (type === "lasers") topLaser.textContent = `🔥 Top Laser: ${top[0]} (${top[1]})`;
  if (type === "errors") topError.textContent = `🔥 Top Error Code: ${top[0]} (${top[1]})`;
}

machineSelect.addEventListener("change", () => {
  populateLasers(machineSelect.value);
  updateTopCounts("machines", machineSelect.value);
});

laserSelect.addEventListener("change", () => {
  populateErrors(machineSelect.value, laserSelect.value);
  updateTopCounts("lasers", laserSelect.value);
});

errorSelect.addEventListener("change", () => {
  showDetails(machineSelect.value, laserSelect.value, errorSelect.value);
  updateTopCounts("errors", errorSelect.value);
});

Object.keys(machineData).forEach(machine => {
  const option = document.createElement("option");
  option.value = machine;
  option.textContent = machine;
  machineSelect.appendChild(option);
});

if (machineSelect.options.length > 0) {
  machineSelect.value = machineSelect.options[0].value;
  populateLasers(machineSelect.value);
  updateTopCounts("machines", machineSelect.value);
}
