import { NextFunction, Request, Response } from 'express';
import { uploadToS3 } from '../utils/s3';
import catchAsync from '@app/utils/catchAsync';
import _ from 'lodash';

type UploadedFiles = {
  [fieldname: string]: Express.Multer.File[];
};

interface IUploadField {
  name: string;
  maxCount: number;
  folder?: string;
}

const uploadMultiple = (fields: IUploadField[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (_.isEmpty(req.files)) return next();

    const files = req.files as UploadedFiles;

    await Promise.all(
      _.map(fields, async (field: IUploadField) => {
        const file = _.get(files, `${field.name}[0]`);

        if (!file) return;

        const uploadedUrl = await uploadToS3({
          file,
          fileName: `${field.folder ?? `images/${field.name}`}/${Math.floor(
            100000 + Math.random() * 900000,
          )}`,
        });

        _.set(req.body, field.name, uploadedUrl);
      }),
    ); 
    next();
  });
};

export default uploadMultiple;
