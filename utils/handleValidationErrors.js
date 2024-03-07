import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req); //? Если будут возникать ошибки при валидации, то они будут записываться в errors
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()); //? Если же ошибки всё таки есть, то вернется ответ с ошибкой и статусом 400 (Bad request)
  }

  next();
};
