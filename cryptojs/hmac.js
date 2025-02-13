module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function DigestNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.algorithm = config.algorithm;
		node.key = config.key;

		node.on('input', function (msg) {
			
			var algorithm = Object.is(msg.algorithm, undefined) ? node.algorithm : msg.algorithm;
			var key = Object.is(msg.key, undefined) ? node.key : msg.key;
			
			// check configurations
			if(!algorithm || !key) {
				// rising misconfiguration error
				//node.error("Missing configuration, please check your algorithm or key.", msg);
				
				node.error("Missing configuration, please check your algorithm, secret key, mode or padding.", msg);
				
			} else {
				// check the payload
				if(msg.payload) {
					// debugging message
					node.debug('Creating a digest of payload using '+ algorithm);
					// digest with CryptoJS
					msg.payload = CryptoJS[algorithm](msg.payload, key).toString();
				} else {
					// debugging message
					node.trace('Nothing to digest: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("hmac", DigestNode);
};
