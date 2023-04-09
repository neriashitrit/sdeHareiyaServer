import { ITimestamps } from './timestamps';

export enum PropertyType {
  Text = 'text',
  Number = 'number',
  File = 'file',
  Pick = 'pick',
}

export interface IProductProperty extends ITimestamps {
  id: number;
  name: string;
  type: PropertyType;
  label: string;
  validation?: any;
  multipleFiles?: boolean;
  linesCountText?: number;
  selectOptions?: string[] | null;
  helperText?: string | null;
}
