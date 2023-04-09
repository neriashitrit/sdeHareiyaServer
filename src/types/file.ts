import { ITimestamps } from './timestamps';

export interface IFile extends ITimestamps {
  id: number;
  azureKey: string;
  url: string;
}
