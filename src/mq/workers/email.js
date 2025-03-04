const zmq = require("zeromq");
const { sendMail } = require("../../utils/SendMail");

const worker = async () => {
  const socket = new zmq.Pull();
  socket.connect("tcp://127.0.0.1:5000");
  console.log("Connection succesfuly!");
  for await (const message of socket) {
    const email = JSON.parse(message.toString());
    await sendMail(email);
  }
};

worker();
