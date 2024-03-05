import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(), //? Проверка на почту
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }), //? Проверка длины пароля
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(), //? Опционально, если есть, то проверка на URL
];

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(), //? Проверка на почту
  body("password", "Пароль должен содержать минимум 5 символов").isLength({
    min: 5,
  }), //? Проверка длины пароля
];
