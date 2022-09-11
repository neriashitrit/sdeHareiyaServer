import AzureStorage from 'azure-storage';
import azureConnectionParser from 'azure-connection-parser';
import stream from 'stream';
import _ from 'lodash';


interface IFileService {
	azure: any;
}

export default class FileService implements IFileService {
	azure: any;
	static instance: any;

	constructor() {
		if (FileService.instance) {
			return FileService.instance;
		}
		if (_.isNil(process.env.AZURE_STORAGE_CONNECTION_STRING)) throw new Error('Define AZURE_STORAGE_CONNECTION_STRING in env');

		this.azure = AzureStorage.createBlobService();
		FileService.instance = this;
	}

	insert = (file: any, fileName: string, container: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			const fileService = AzureStorage.createBlobService();
			const fileStream = new stream.Readable();
			fileStream.push(file.data);
			fileStream.push(null);
			const params = azureConnectionParser(process.env.AZURE_STORAGE_CONNECTION_STRING);
			const url = `${params.DefaultEndpointsProtocol}://${params.AccountName}.blob.core.windows.net/${container}/` +
				encodeURI(fileName);
			fileService.createBlockBlobFromStream(container, fileName, fileStream, file.data.length,
				(error, response) => {
					if (error) {
						reject(error);
					}
					resolve(url);
				});
		});
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

	remove = async (fileName: string): Promise<boolean> => {
		const container = process.env.AZURE_STORAGE_IMAGE || 'images';
		const fileService = AzureStorage.createBlobService();
		return new Promise<boolean>((resolve, reject) =>
			fileService.deleteBlobIfExists(container, fileName, (err, result) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(result);
				}
			}));
	};
}
