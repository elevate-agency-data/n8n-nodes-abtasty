import { 
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon
} from 'n8n-workflow';

export class AbTastyApi implements ICredentialType {
	name = 'abTastyApi';
	displayName = 'AB Tasty API';
	documentationUrl = 'https://developers.abtasty.com/docs/data/data-getting-started';
  icon: Icon = 'file:icons/abtasty.svg';
	properties: INodeProperties[] = [
    {
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			typeOptions: {
				password: true
			},
			default: '',
			required: true,
			description: 'Client ID for the AB Tasty API'
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true
			},
			default: '',
			required: true,
			description: 'Client Secret for the AB Tasty API'
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
        'Content-Type': 'application/json',	
        'Accept': 'application/json'
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
      method: 'POST',
			url: 'https://api.abtasty.com/oauth/v2/token',
			headers: {
        'Content-Type': 'application/json',	
        'Accept': 'application/json'
			},
			body: {
				client_id: '={{$credentials.clientId}}',
				client_secret: '={{$credentials.clientSecret}}',
				grant_type: 'client_credentials',
			},
			json: true,
		},
	};
}
