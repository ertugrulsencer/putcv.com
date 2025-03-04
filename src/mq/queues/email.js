const zmq = require("zeromq");

const socket = new zmq.Push();
let isSocketBound = false;

const initSocket = async () => {
  try {
    if (!isSocketBound) {
      await socket.bind("tcp://127.0.0.1:5000");
      isSocketBound = true;
      console.log("ZeroMQ socked connected: tcp://127.0.0.1:5000");
    }
  } catch (error) {
    console.error("Soket bağlanırken hata oluştu:", error);
  }
};

initSocket();

const sendEmailMessage = async (emailData) => {
  try {
    if (!isSocketBound) await initSocket();
    await socket.send(JSON.stringify(emailData));
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
  }
};

module.exports = {
  sendEmailMessage,
};
