// This file ensures n8n can find and load your nodes and credentials
const { ABTasty } = require('./dist/nodes/AbTasty/AbTasty.node.js');

module.exports = {
	nodeTypes: {
		ABTasty: ABTasty,
	},
	credentialTypes: {
		ABTastyApi: require('./dist/credentials/AbTastyApi.credentials.js').AbTastyApi,
	},
};
