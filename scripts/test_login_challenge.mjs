const response = await fetch("http://127.0.0.1:3000/api/login_challenge", {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    username: "admin",
    clientNonce: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  })
});

const text = await response.text();
console.log("status", response.status);
console.log("body", text);

