const socket = io();

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add")) {
    const id = event.target.getAttribute("id");
    const selectedQuantity = document.getElementById("stockSelect").value;

    socket.emit("client:addProductOnCart", { id, selectedQuantity });
  }
});
