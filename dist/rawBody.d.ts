import { NextFunction, Request, Response } from 'express';
export declare const rawBodyFromVerify: (req: any, _res: any, buf: Buffer, encoding: string) => void;
export declare const rawBodyFromStream: (req: Request & {
    rawBody?: string;
}, _res: Response, next: NextFunction) => void;
