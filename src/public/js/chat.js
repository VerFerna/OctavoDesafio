const socket = io();

const chatbox = document.getElementById("chatbox");
const userName = document.getElementById("userName").innerText;

window.onload = function () {
  const logs = document.getElementById("logs");
  logs.scrollTop = logs.scrollHeight;
};

let user = userName;

//SweetAlert2
if (!user) {
  Swal.fire({
    title: "Auth",
    input: "text",
    text: "Set username",
    inputAttributes: {
      maxlength: 10,
    },
    inputValidator: (value) => {
      return !value.trim() && "Please write a username";
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
    user = user.charAt(0).toUpperCase() + user.slice(1);
    document.getElementById("username").innerHTML = user;
    sessionStorage.setItem("user", user);
    socket.emit("new", user);
  });
} else {
  document.getElementById("username").innerHTML = user;
  socket.emit("new", user);
}

//Envia el front - Editar mensaje
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("edit")) {
    const id = event.target.getAttribute("id");

    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });

    if (text) {
      let user = sessionStorage.getItem("user");

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your message was updated",
        text: text,
        showConfirmButton: false,
        timer: 1500,
      });

      socket.emit("client:editMessage", {
        id: id,
        user: user,
        message: text,
      });
    }
  }
});

//Envia el front - Mensaje
chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const message = chatbox.value.trim();

    if (message.length > 0) {
      socket.emit("client:message", {
        user,
        message,
      });

      chatbox.value = "";
    }
  }
});

//Respuesta del back
socket.on("server:messages", (data) => {
  const divLogs = document.getElementById("logs");
  let messages = "";
  data.forEach((message) => {
    messages =
      `
        <div class="card m-3" style="width: 200px">
          <div class="m-2" style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p class="m-0" style="font-size: 10px;"><b>${message.user}</b></p>
              <button id=${message._id} type="button" class="btn edit" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: 10px;">
                edit
              </button>
            </div>
            <p class="m-0" style="font-size: 16px;">${message.message}</p>
            <div style="margin-left: auto;">
              <i style="font-size: x-small; margin-left: 5px;">${message.hour}</i>
            </div>
          </div>
        </div>
      ` + messages;
  });

  divLogs.innerHTML = messages;
});
