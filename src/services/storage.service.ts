import { BlobServiceClient } from '@azure/storage-blob'
import _ from 'lodash'
import stream from 'stream'

export default class FileService {
  static instance: FileService
  serviceClient!: BlobServiceClient
  connectionString!: string
  constructor() {
    if (FileService.instance) {
      return FileService.instance
    }
    if (_.isNil(process.env.AZURE_STORAGE_CONNECTION_STRING))
      throw new Error('Define AZURE_STORAGE_CONNECTION_STRING in env')
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
    this.connectionString = connectionString
    this.serviceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    FileService.instance = this
  }

  static getInstance = () => FileService.instance || new FileService()

  async insert(file: any, directory: string, subdirectory: string) {
    try {
      const blockBlobClient = this.serviceClient
        .getContainerClient('files')
        .getBlockBlobClient(`${directory}/${subdirectory}`)
      const fileStream = new stream.Readable()
      fileStream.push(file.data)
      fileStream.push(null)
      await blockBlobClient.uploadStream(fileStream, file.data.length)
      const url = `https://${process.env.AccountName}.blob.${process.env.EndpointSuffix}/files/${directory}/${subdirectory}`
      return url
    } catch (error) {
      console.log(error)
      throw { message: 'Something went wrong', error: error.message }
    }
  }

  getSas = (): string => {
    try {
      const sas = this.serviceClient.generateAccountSasUrl()
      return sas?.replace(`https://${process.env.AccountName}.blob.${process.env.EndpointSuffix}/`, '')
    } catch (error) {
      console.error('cant get sas from azure', error)
      throw `cant get sas error: ${error}`
    }
  }

  streamToBuffer = (readableStream: NodeJS.ReadableStream) => {
    return new Promise((resolve, reject) => {
      const chunks: any = []
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data))
      })
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      readableStream.on('error', reject)
    })
  }

  // getSas = () : string => {
  // 	try {
  // 		const sas = this.serviceClient.generateAccountSasUrl()
  // 		return sas?.replace(`https://${process.env.AccountName}.file.${process.env.EndpointSuffix}/`,'')

  // 	} catch (error) {
  // 		console.error('cant get sas from azure', error);
  // 		throw(`cant get sas error: ${error}`)
  // 	}
  // };

  // streamToBuffer = (readableStream:NodeJS.ReadableStream) => {
  // 	return new Promise((resolve, reject) => {
  // 	const chunks:any = [];
  // 	readableStream.on("data", (data) => {
  // 	chunks.push(data instanceof Buffer ? data : Buffer.from(data));
  // 	});
  // 	readableStream.on("end", () => {
  // 	resolve(Buffer.concat(chunks));
  // 	});
  // 	readableStream.on("error", reject);
  // 	});
  // 	}
}
