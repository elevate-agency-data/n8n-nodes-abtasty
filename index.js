// This file ensures n8n can find and load your nodes and credentials
const { ABTasty } = require('./dist/nodes/ABTasty/ABTasty.node.js');

module.exports = {
	nodeTypes: {
		ABTasty: ABTasty,
	},
	credentialTypes: {
		ABTastyApi: require('./dist/credentials/ABTastyApi.credentials.js').ABTastyApi,
	},
};
