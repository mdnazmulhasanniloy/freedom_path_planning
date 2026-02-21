import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
const parseData = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   
        if (req.body?.data && typeof req.body.data === 'string') {
          const parsed = JSON.parse(req.body.data);

          req.body = {
            ...parsed,
            ...req.body,  
          };

          delete req.body.data;
        }

        next();
      },
    );
  }

    // if (req?.body?.data) {
    //   req.body = JSON.parse(req.body.data);
    // }

    // next();
  
export default parseData;
