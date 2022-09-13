import AzureStorage from 'azure-storage';
import stream from 'stream';
import _ from 'lodash';
import { ShareServiceClient } from '@azure/storage-file-share'

export default class FileService {
	static instance: FileService;
    serviceClient: ShareServiceClient;
	connectionString: string;
	
	constructor() {
		if (FileService.instance) {
			return FileService.instance;
		}
		if (_.isNil(process.env.AZURE_STORAGE_CONNECTION_STRING)) throw new Error('Define AZURE_STORAGE_CONNECTION_STRING in env');
		const connectionString  = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
		this.connectionString = connectionString;
        this.serviceClient = ShareServiceClient.fromConnectionString(this.connectionString);
		FileService.instance = this;
	}

	static getInstance = () => FileService.instance || new FileService()
	
	async insert (file: any, fileName: string, directory: string) {
		try {
			const directoryClient = this.serviceClient.getShareClient('images').getDirectoryClient(directory);
			const fileClient = directoryClient.getFileClient(fileName);
			const fileStream = new stream.Readable();
			fileStream.push(file.data);
			fileStream.push(null);
			await fileClient.create(file.data.length);
			await fileClient.uploadRange(file.data, 0, file.data.length);
			const url = `https://${process.env.AccountName}.file.${process.env.EndpointSuffix}/images/${directory}/${fileName}`
			return url
		} catch (error) {
			throw {message:'Something went wrong', error:error.message}
		}
	};

	fetch = async (fileName: string, directory: string): Promise<any> => {
		try {
			const directoryClient = this.serviceClient.getShareClient('images').getDirectoryClient(directory);
			const fileClient = directoryClient.getFileClient(fileName);
			const fileStream = new stream.Readable();
			const downloadFileResponse = await fileClient.download();
			const readableStream = downloadFileResponse.readableStreamBody
			if (readableStream){ return await this.streamToBuffer(readableStream)}
		} catch (error) {
			throw {message:'Something went wrong', error:error.message}
		}
	};
	
	getSas = (fileName: string, container: string) => {
		const AzureService = AzureStorage.createBlobService();
		let expiryDate = new Date();
		expiryDate.setHours(expiryDate.getHours() + 1);

		const sharedAccessPolicy = {
			AccessPolicy: {
				Permissions: AzureStorage.BlobUtilities.SharedAccessPermissions.READ +
					AzureStorage.BlobUtilities.SharedAccessPermissions.WRITE +
					AzureStorage.BlobUtilities.SharedAccessPermissions.DELETE,
				Expiry: expiryDate
			}
		};
		return AzureService.generateSharedAccessSignature(container, fileName, sharedAccessPolicy);
	};

	streamToBuffer = (readableStream:NodeJS.ReadableStream) => {
		return new Promise((resolve, reject) => {
		const chunks:any = [];
		readableStream.on("data", (data) => {
		chunks.push(data instanceof Buffer ? data : Buffer.from(data));
		});
		readableStream.on("end", () => {
		resolve(Buffer.concat(chunks));
		});
		readableStream.on("error", reject);
		});
		}

}
