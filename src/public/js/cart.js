const socket = io();

const cartId = document.getElementById("cartId").innerText;

//Envia el front
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("id");

    socket.emit("client:deleteProductOnCart", {id, cartId});
  }
});

//Respuesta del back
socket.on("server:cart", (data) => {
  const divList = document.getElementById("cart");
  let cards = "";
  data.products.forEach((content) => {
    cards += `
      <li class="list-group-item p-0">
          <div style="display: flex;">
              <div style="width: 10px; background-color: #ffd700">
              </div>
              <div style="display: flex;">
                  <img src=${content.product.thumbnail} alt="img - ${content.product.thumbnail}" width="150px">
                  <div style="display: flex; justify-content: space-between">
                      <div style="display: flex; flex-direction: column">
                          <h5 class="m-0">${content.product.category} - ${content.product.title}</h5>
                          <h6 class="m-0">Price: ${content.product.price}U$D</h6>
                          <h6 class="m-0">Quantity: ${content.quantity}</h6>
                      </div>
                      <div class="delete" style="position: absolute; right: 0px;">
                          <button id=${content.product._id} class="btn delete">Delete</button>
                      </div>
                  </div>
              </div>
          </div>
      </li>`;
  });

  divList.innerHTML = cards;
});

socket.on("server:error", (data) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `${data}`,
  });
});
