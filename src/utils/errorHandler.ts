import { Request, Response, NextFunction } from "express";
import { ResponseError, ResponseHandler } from "./response";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = ResponseError(
    err.status || 500,
    err.msg || err.message || "No MSG",
    err.reason || err.stack || "Something failed"
  );

  res.status(error.status).json(ResponseHandler(error.status, error));
};

export default ErrorHandler;
