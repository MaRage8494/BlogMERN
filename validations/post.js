import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(), //? Проверка длины заголовка
  body("text", "Введите текст статьи").isLength({ min: 3 }).isString(), //? Проверка длины текста
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(), //? Опционально, если есть, то проверка на строку
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isArray(), //? Опционально, если есть, то проверка на массив (строку)
];
