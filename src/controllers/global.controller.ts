import { Request, Response } from 'express';
import { AuthInfo } from 'types';
import globalHelper from '../helpers/global.helper';

import { globalModel } from '../models/index';
import FileService from '../services/storage.service';

const fileService = FileService.getInstance();
