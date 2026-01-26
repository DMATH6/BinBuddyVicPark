const input = document.getElementById("textInput");
const suggestionsBox = document.getElementById("suggestions");
const binGroupDiv = document.getElementById("binGroup");

// ---------- Autocomplete ----------
input.addEventListener("input", async () => {
  const value = input.value;

  if (value.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/suggest?q=${encodeURIComponent(value)}`
    );
    const suggestions = await response.json();

    console.log("SUGGESTIONS RECEIVED:", suggestions);

    suggestionsBox.innerHTML = "";

    suggestions.forEach(item => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = item.address;

      div.addEventListener("click", () => {
        input.value = item.address;
        suggestionsBox.innerHTML = "";

        // Display bin group safely
        binGroupDiv.textContent = "Bin Group: " + (item.binGroup ?? "Unknown");
      });

      suggestionsBox.appendChild(div);
    });
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
});

// ---------- Optional: Echo button ----------
document.getElementById("sendBtn").addEventListener("click", async () => {
  const text = input.value;
  const response = await fetch("http://localhost:3000/api/echo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });
  const data = await response.json();
  alert("Exact match found? " + data.found);
});
