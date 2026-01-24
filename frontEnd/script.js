document.getElementById("sendBtn").addEventListener("click", async () => {
  const text = document.getElementById("textInput").value;

  const response = await fetch("http://localhost:3000/api/echo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: text
    })
  });

  const data = await response.json();
  alert("Server replied: " + data.received);
});
