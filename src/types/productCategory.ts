import { ITimestamps } from './timestamps';
import { IFile } from './file';
import { IProductProperty } from './productPropery';

export interface IProductCategory extends ITimestamps {
  id: number;
  name: string;
  icon: IFile;
  description: string;
  properties: IProductProperty[];
}
