import { 
	ApplicationError,
	INodeType, 
	INodeTypeDescription, 
	IExecuteFunctions, 
	NodeApiError,
	NodeConnectionType,
	NodeOperationError
} from 'n8n-workflow';

export class AbTasty implements INodeType {
	description: INodeTypeDescription = {
		name: 'abTasty',
		displayName: 'AB Tasty',
		group: ['transform'],
		version: 1,
		description: 'Use the AB Tasty API',
    defaults:{ name: 'AB Tasty' },
		icon: 'file:abtasty.svg',
		// @ts-ignore - node-class-description-inputs-wrong
		inputs: [{ type: NodeConnectionType.Main }],
		// @ts-ignore - node-class-description-outputs-wrong
		outputs: [{ type: NodeConnectionType.Main }],        
		usableAsTool: true,
		credentials: [{	name: 'abTastyApi', required: true}],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Data Explorer API', value: 'dataExplorerAPI', description: 'Enables you to query and retrieve detailed visitor-level data collected by AB Tasty, allowing for custom analysis and reporting' },
					{ name: 'Public API', value: 'publicAPI', description: 'Allows you to programmatically access, manage, and retrieve data about experiments, campaigns, and account configurations from the AB Tasty platform' },
					{ name: 'Universal Data Connector API', value: 'universalDataConnectorAPI', description: 'Enables you to send custom audience segments directly to AB Tasty, allowing for real-time personalization and targeted experimentation based on your own data sources' }
			  ],
				default: 'dataExplorerAPI',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['dataExplorerAPI'] } },
				options: [					
					{ name: 'Send Query', value: 'dataExplorerAPIQuery', action: 'Sends a query', description: 'Sends a query' }
				],
				default: 'dataExplorerAPIQuery',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['publicAPI'] } },
				options: [					
					{ name: 'Change User Access', value: 'publicAPIUserAccessPatch', action: 'Changes an access to a user', description: 'Changes an access to a user' },
					{ name: 'Clear AB Tasty Script', value: 'publicAPIScriptDelete', action: 'Deletes the ab tasty script', description: 'Deletes the ab tasty script' },
					{ name: 'Get Framework Checksum', value: 'publicAPIFrameworkChecksumGet', action: 'Gets the framework checksum', description: 'Gets the framework checksum' },
					{ name: 'Get Modification', value: 'publicAPIModificationsGet', action: 'Gets one specific modification', description: 'Gets one specific modification' },
					{ name: 'Get Test', value: 'publicAPITestsGet', action: 'Gets information of one test', description: 'Gets information of one test' },
					{ name: 'Get Third Party Tools Link', value: 'publicAPIThirdPartyToolsGet', action: 'Gets thid party tool link of one test', description: 'Gets thid party tool link of one test' },
					{ name: 'Get User', value: 'publicAPIUsersGet', action: 'Gets a user of an account', description: 'Gets a user of an account' },
					{ name: 'Get Variation', value: 'publicAPIVariationsGet', action: 'Gets one specific variation', description: 'Gets one specific variation' },
          { name: 'Give User Access', value: 'publicAPIUserAccessGive', action: 'Gives an access to a user', description: 'Gives an access to a user' },
					{ name: 'List Events', value: 'publicAPIEventsList', action: 'Lists events set up in a test', description: 'Lists events set up in a test' },
					{ name: 'List Modifications', value: 'publicAPIModificationsList', action: 'Lists all modifications of a variation', description: 'Lists all modifications of a variation' },
					{ name: 'List Tests', value: 'publicAPITestsList', action: 'Lists all tests of an account', description: 'Lists all tests of an account' },
					{ name: 'List Tests Statistics', value: 'publicAPITestsStatisticsList', action: 'Lists tests statistics of an account', description: 'Lists tests statistics of an account' },
					{ name: 'List Third Party Tool Links', value: 'publicAPIThirdPartyToolsList', action: 'Lists all third party tool links of one test', description: 'Lists all third party tool links of one test' },
					{ name: 'List Users', value: 'publicAPIUsersList', action: 'Lists users of an account', description: 'Lists users of an account' },
					{ name: 'List Variations', value: 'publicAPIVariationsList', action: 'Lists the variations of a test', description: 'Lists the variations of a test' },
					{ name: 'Pause Test', value: 'publicAPITestPausePatch', action: 'Pauses a test', description: 'Pauses a test' },
					{ name: 'Play Test', value: 'publicAPITestPlayPatch', action: 'Plays a test', description: 'Plays a test' },
					{ name: 'Revoke User Access', value: 'publicAPIUserAccessDelete', action: 'Revokes an access to a user', description: 'Revokes an access to a user' },
					{ name: 'Update AB Tasty Script', value: 'publicAPIScriptPatch', action: 'Updates the ab tasty script', description: 'Updates the ab tasty script' }
				],
				default: 'publicAPITestsList',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['universalDataConnectorAPI'] } },
				options: [					
					{ name: 'List Visitor Segments', value: 'universalDataConnectorAPIVisitorSegmentsList', action: 'Lists visitor segments from the web', description: 'Lists visitor segments from the web' },
					{ name: 'Upload Segments', value: 'universalDataConnectorAPISegmentsUpload', action: 'Uploads segments', description: 'Uploads segments' }
				],
				default: 'universalDataConnectorAPIVisitorSegmentsList',
			},	  
			{
				displayName: 'Account ID',
				name: 'accountId',            
				type: 'number',
				default: ''
			},	  
			{
				displayName: 'Test ID',
				name: 'testId',            
				type: 'number',
				default: '',
        displayOptions:{ show:{ operation:['publicAPIEventsList', 'publicAPIModificationsGet', 'publicAPIModificationsList', 'publicAPITestsGet', 'publicAPITestPausePatch', 'publicAPITestPlayPatch', 'publicAPIThirdPartyToolsGet', 'publicAPIThirdPartyToolsList', 'publicAPIVariationsGet', 'publicAPIVariationsList'] } }
			},	  
			{
				displayName: 'Variation ID',
				name: 'variationId',            
				type: 'number',
				default: '',
        displayOptions:{ show:{ operation:['publicAPIModificationsGet', 'publicAPIModificationsList', 'publicAPIVariationsGet'] } }
			},
			{
				displayName: 'Modification ID',
				name: 'modificationId',            
				type: 'number',
				default: '',
        displayOptions:{ show:{ operation:['publicAPIModificationsGet'] } }
			},
			{
				displayName: 'Third Party Tool Link ID',
				name: 'thirdPartyToolLinkId',            
				type: 'number',
				default: '',
        displayOptions:{ show:{ operation:['publicAPIThirdPartyToolsGet'] } }
			},
			{
				displayName: 'User ID',
				name: 'userId',            
				type: 'number',
				default: '',
        displayOptions:{ show:{ operation:['publicAPIUserAccessDelete', 'publicAPIUserAccessPatch', 'publicAPIUsersGet'] } }
			},
			{
				displayName: 'Partner Name',
				name: 'partnerName',            
				type: 'string',
				default: '',
        placeholder: 'best3rdparty, awesomeTool, ...',
        displayOptions:{ show:{ operation:['universalDataConnectorAPISegmentsUpload'] } }
			},
      {
        displayName: 'CSV File Path',
        name: 'csvFilePath',
        type: 'string',
        default: '',
        placeholder: '/data/myfile.csv',
        displayOptions:{ show:{ operation:['universalDataConnectorAPISegmentsUpload'] } }
      },
			{
				displayName: 'Query Flagship',
				name: 'queryFlagship',            
				type: 'boolean',
				default: false,
        displayOptions:{ show:{ operation:['dataExplorerAPIQuery'] } }
			},
			{
				displayName: 'Visitor ID',
				name: 'visitorId',            
				type: 'string',
				default: '',
        displayOptions:{ show:{ operation:['universalDataConnectorAPIVisitorSegmentsList'] } }
			},
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default:{},
        displayOptions:{ show:{ operation:['publicAPIEventsList', 'publicAPIModificationsList', 'publicAPITestsGet', 'publicAPITestsList', 'publicAPIThirdPartyToolsList', 'publicAPIUsersList'] } },
        options:[
          {
            displayName: 'Active',
            name: 'filter%5Bactive%5D',
            description: '0 => pause ; 1 => play',
            type: 'options',
            options: [
              {
                name: 'Pause',
                value: 0
              },
              {
                name: 'Play',
                value: 1
              },
            ],
            default: 1
          },
          {
            displayName: 'Exclude Tag',
            name: 'filter%5Bexclude_tag%5D%5B%5D',
            description: 'Exclude specific tag of the collection',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Folder',
            name: 'filter%5Bfolder%5D%5B%5D',
            description: 'Search by folder ID (0 for no folder)',
            type: 'number',
            default: 0
          },
          {
            displayName: 'Is Preprod',
            name: 'filter%5Bis_preprod%5D',
            description: 'Whether it is set or not, only preprod tests will be returned',
            type: 'boolean',
            default: true
          },
          {
            displayName: 'Is Schedule',
            name: 'filter%5Bis_schedule%5D',
            description: '0 -> test not schedule ; 1 -> test schedule',
            type: 'options',
            options: [
              {
                name: 'Test Not Schedule',
                value: 0
              },
              {
                name: 'Test Schedule',
                value: 1
              },
            ],
            default: 1
          },
          {
            displayName: 'Max Per Page',
            name: '_max_per_page',
            description: 'Limit of items per page',
            type: 'number',
            default: 10
          },
          {
            displayName: 'Modification Type',
            name: 'filter%5Btype%5D',
            description: 'Type of the global modification (plugin or actionTracking)',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Name',
            name: 'filter%5Bname%5D',
            description: 'Search by name of the test',
            type: 'string',
            default: ''
          },  
          {
            displayName: 'Name or URL',
            name: 'filter%5Bname_or_url%5D',
            description: 'Search by name and URL of the test',
            type: 'string',
            default: ''
          }, 
          {
            displayName: 'Operation',
            name: 'filter%5Boperation%5D',
            description: 'Search by operation of the modification',
            type: 'string',
            default: ''
          },   
          {
            displayName: 'Order by ID',
            name: 'filter%5B_order%5D%5Bid%5D',
            description: 'Order collecion by ID',
            type: 'options',
            options: [
              {
                name: 'Ascending',
                value: 'ASC'
              },
              {
                name: 'Descending',
                value: 'DESC'
              },
            ],
            default: 'ASC'
          },
          {
            displayName: 'Order by Name',
            name: 'filter%5B_order%5D%5Bname%5D',
            description: 'Order collection by name',
            type: 'options',
            options: [
              {
                name: 'Ascending',
                value: 'ASC'
              },
              {
                name: 'Descending',
                value: 'DESC'
              },
            ],
            default: 'ASC'
          },
          {
            displayName: 'Page',
            name: '_page',
            description: 'Page of the collection',
            type: 'number',
            default: 10
          },             
          {
            displayName: 'Parent',
            name: 'filter%5Bparent%5D%5B%5D',
            description: 'Search by parent ID (0 for no parent)',
            type: 'number',
            default: 0
          },
          {
            displayName: 'Search',
            name: 'filter%5Bsearch%5D',
            description: 'Search by name/URL/ID of the test',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Tag',
            name: 'filter%5Btag%5D%5B%5D',
            description: 'Only test with specific tag of the collection',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Test Type',
            name: 'filter%5Btype%5D%5B%5D',
            description: 'Search by test type (ab,heatmap,mobileapp,mastersegment,multipage,multivariate,mvt,predictive,segmentation,subsegment,tunnel)',
            type: 'string',
            default: ''
          }    
        ]
      },
      {
        displayName: 'Request Body',
        name: 'requestBody',
        type: 'json',
	      default: '{}',
        displayOptions:{ show:{ operation:['dataExplorerAPIQuery', 'publicAPITestPlayPatch', 'publicAPIUserAccessGive', 'publicAPIUserAccessPatch'] } }
      }
		]
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		const credentials = await this.getCredentials('abTastyApi');    
    const { clientId, clientSecret } = credentials as { clientId: string, clientSecret: string };
    if (!clientId || !clientSecret) { throw new ApplicationError('Missing Client ID or Client Secret.'); }

    const authResponse = await this.helpers.request({
      method: 'POST',
      url: 'https://api.abtasty.com/oauth/v2/token',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
      json: true,
    });

    const accessToken = authResponse?.access_token;
    if (!accessToken) { throw new ApplicationError('Failed to retrieve access token.'); }
		
		// Traitement des opérations
		for (let i = 0; i < items.length; i++) {
			try {		        		
        		
       	const operation = this.getNodeParameter('operation', i, '') as string;		
        const resource = this.getNodeParameter('resource', i, '') as string;	
        const accountId = this.getNodeParameter('accountId', i, '') as string;
        const modificationId = this.getNodeParameter('modificationId', i, '') as string;
        const testId = this.getNodeParameter('testId', i, '') as string;
        const thirdPartyToolLinkId = this.getNodeParameter('thirdPartyToolLinkId', i, '') as string;
        const userId = this.getNodeParameter('userId', i, '') as string;
        const variationId = this.getNodeParameter('variationId', i, '') as string;
        const partnerName = this.getNodeParameter('partnerName', i, '') as string;
        const csvFilePath =  this.getNodeParameter('csvFilePath', i, '') as string;
        const queryFlagship = this.getNodeParameter('queryFlagship', i, '') as string;
        const visitorId = this.getNodeParameter('visitorId', i, '') as string;
        const filters = this.getNodeParameter('filters', i, {}) as Record<string, any>;
        const requestBody = this.getNodeParameter('requestBody', i, '') as string;
        
        let url = '';
      
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '') queryParams.append(decodeURIComponent(key), String(value));
        });
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
				
				switch (resource) {
          case 'dataExplorerAPI':			          
            switch (operation) {
              case 'dataExplorerAPIQuery':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api-data-explorer.abtasty.com/v2/clients/${accountId}/query`;
                break;
            }
						break;	
					case 'publicAPI':			          
            switch (operation) {
              case 'publicAPIEventsList':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/global_modifications`;
                break;
              case 'publicAPIFrameworkChecksumGet':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/api/v1/accounts/${accountId}`;
                break;
              case 'publicAPIModificationsGet':       
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                if (!variationId) { throw new ApplicationError('Variation ID is required'); }	
                if (!modificationId) { throw new ApplicationError('Modification ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/variations/${variationId}/modifications/${modificationId}`;
                break;
              case 'publicAPIModificationsList':       
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                if (!variationId) { throw new ApplicationError('Variation ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/variations/${variationId}/modifications`;
                break;
              case 'publicAPIScriptDelete':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/backend/accounts/${accountId}/tag-clear`;
                break;
              case 'publicAPIScriptPatch':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/backend/accounts/${accountId}/tag-rebuild`;
                break;
              case 'publicAPITestsList':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests${queryString}`;
                break;
              case 'publicAPITestsGet':        
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/v1/accounts/${accountId}/tests/${testId}`;
                break;
              case 'publicAPITestsStatisticsList':       
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/general_statistics`;
                break;
              case 'publicAPITestPausePatch':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/interface/accounts/${accountId}/tests/${testId}/pause`;
                break;
              case 'publicAPITestPlayPatch':     
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/interface/accounts/${accountId}/tests/${testId}/play`;
                break;
              case 'publicAPIThirdPartyToolsGet':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                if (!thirdPartyToolLinkId) { throw new ApplicationError('Third Party Tool Link ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/toollinks/${thirdPartyToolLinkId}`;
                break;
              case 'publicAPIThirdPartyToolsList':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/toollinks`;
                break;
              case 'publicAPIUserAccessPatch':
              case 'publicAPIUserAccessDelete':
              case 'publicAPIUsersGet':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!userId) { throw new ApplicationError('User ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/membership/${userId}`;
                break;
              case 'publicAPIUserAccessGive':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/membership`;
                break;
              case 'publicAPIUsersList':
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/membership${queryString}`;
                break;
              case 'publicAPIVariationsGet':        
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                if (!variationId) { throw new ApplicationError('Variation ID is required'); }	
                url += `https://api.abtasty.com/api/v1/accounts/${accountId}/tests/${testId}/variations/${variationId}`;
                break;
              case 'publicAPIVariationsList':        
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!testId) { throw new ApplicationError('Test ID is required'); }	
                url += `https://api.abtasty.com/api/core/accounts/${accountId}/tests/${testId}/variations`;
                break;
            }
						break;	
          case 'universalDataConnectorAPI':			          
            switch (operation) {
              case 'universalDataConnectorAPISegmentsUpload':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!partnerName) { throw new ApplicationError('Partner Name is required'); }	
                url += `https://api-data-connector.abtasty.com/accounts/${accountId}/segments/${partnerName}`;
                break;
              case 'universalDataConnectorAPIVisitorSegmentsList':      
                if (!accountId) { throw new ApplicationError('Account ID is required'); }	
                if (!visitorId) { throw new ApplicationError('Visitor ID is required'); }	
                url += `https://api-data-connector.abtasty.com/accounts/${accountId}/segments/${visitorId}`;
                break;
            }
            break;		
					default:
            throw new NodeOperationError(this.getNode(),`Unknown resource:${resource}`);
				}

        const postOperations = ['Give', 'Query', 'Upload'];

        const httpMethod: 'GET' | 'PATCH' | 'POST' | 'DELETE' = operation.endsWith('Delete') ? 'DELETE' :
                                                                operation.endsWith('Patch') ? 'PATCH' :
                                                                postOperations.some(op => operation.endsWith(op)) ? 'POST' : 'GET';

        const operationsWithoutBody = [
          'publicAPIScriptDelete',
          'publicAPIScriptPatch',
          'publicAPITestPausePatch',
          'publicAPIUserAccessDelete',
          'universalDataConnectorAPISegmentsUpload'
        ];

        let body;
        let headers: any = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        };

        if(!!queryFlagship){
          headers['x-source'] = 'flagship';
        }
        else if(operation == 'universalDataConnectorAPISegmentsUpload'){
          headers['Content-Type'] = 'text/csv';
          delete headers['Accept'];
        }

        if (!operationsWithoutBody.includes(operation) && ['DELETE', 'PATCH', 'POST', 'PUT'].includes(httpMethod)) {
          body = JSON.parse(requestBody);
        }

        let requestConf;

        if (operation === 'universalDataConnectorAPISegmentsUpload') {
          const fs = require('fs');
          const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
        
          requestConf = {
            method: 'POST' as 'POST',
            url,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'text/csv',
            },
            body: csvContent,
          };
        } else {
          requestConf = {
            method: httpMethod,
            url,
            headers,
            ...(body ? { body } : {}),
          };
        }

        const responseData = await this.helpers.request(requestConf);

				if (typeof responseData === 'string') {
          const trimmed = responseData.trim();
          if (trimmed !== '') {
            try {
              returnData.push({ json: JSON.parse(trimmed) });
            } catch (e) {
              returnData.push({ text: trimmed });
            }
          } else {
            returnData.push({ 'Status Code': '204 No Content' });
          }
        } else if (responseData) {
          returnData.push(responseData);
        } else {
          returnData.push({ 'Status Code': '204 No Content' });
        }        

			} catch (error) {
        throw new NodeApiError(this.getNode(), {
          message: `Error calling AB Tasty API: ${error.message}`,
          description: error.stack || 'No stack trace available'
        });
      }
    }
    return [this.helpers.returnJsonArray(returnData)];
  }
}