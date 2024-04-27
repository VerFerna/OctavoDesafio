const socket = io();

const formCreate = document.getElementById("realTimeFormCreate");
const formDelete = document.getElementById("realTimeFormDelete");

//Envia el front
formCreate.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("input[name=title]").value;
  const description = document.querySelector("input[name=description]").value;
  const price = Number(document.querySelector("input[name=price]").value);
  const thumbnail = document.querySelector("input[name=thumbnail]").value;
  const code = document.querySelector("input[name=code]").value;
  const stock = Number(document.querySelector("input[name=stock]").value);
  const category = document.querySelector("input[name=category]").value;

  const product = {
    title,
    description,
    price,
    thumbnail: thumbnail ? thumbnail : "",
    code,
    stock,
    category,
  };

  socket.emit("client:newProduct", product);

  formCreate.reset();
});

//Envia el front
formDelete.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.querySelector("input[name=id]").value;

  socket.emit("client:deleteProduct", id);

  formDelete.reset();
});

//Envia el front
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const id = event.target.getAttribute("id");

    socket.emit("client:deleteProduct", id);
  }
});

//Respuesta del back
socket.on("server:list", (data) => {
  const divList = document.getElementById("list");
  let cards = "";
  data.forEach((content) => {
    content.thumbnail =
      content.thumbnail.length > 0
        ? content.thumbnail
        : ["https://i.ibb.co/zsQdBNc/200x200.gif"];
    cards += `
        <div class="card" style="margin: 20px 100px; max-width: 200px">
            <img src=${content.thumbnail} width="200" alt="img - ${content.thumbnail}">
            <div class="card-body">
                <p class="card-title">${content.category} - ${content.title}</p>
            </div>
            <div class="p-3" style="display: flex; justify-content: space-between;">
                <a href="/products/${content._id}" class="btn btn-primary">Info</a>
                <div class="delete">
                    <button class="btn btn-primary delete" id=${content._id}>
                        Delete
                    </button>
                </div>
            </div>
        </div>`;
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
