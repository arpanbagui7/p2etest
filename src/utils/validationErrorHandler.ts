import { Request } from "express";
import { ResponseError } from "./response";
import { ValidationError } from "express-validator";

const ValidationErrorHandler = (req: Request, arg: ValidationError) => {
  const { msg } = arg;
  return ResponseError(400, "Validation Errors", msg);
};

export default ValidationErrorHandler;
