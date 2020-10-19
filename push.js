const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });


rsmq.sendMessage({ qname: "myqueue", message: "Hello World22222222222 "}, function (err, resp) {
	if (err) {
		console.error(err)
		return
	}

	console.log("Message sent. ID:", resp);
});