import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import multer from "multer";
import "dotenv/config.js";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/index.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { PostController, UserController } from "./controllers/index.js";

mongoose
  .connect(process.env.DB_CONN)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err)); //? Подключение к БД

const app = express(); //? Использование app в качестве управление express

const storage = multer.diskStorage({
  //? Настройка загрузки изображений
  destination: (_, __, cb) => {
    //? Выбор папки
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    //? Выбор названия файла
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); //? Объявление хранилища

app.use(express.json()); //? Делает так, чтобы express мог читать JSON файлы, которые ему отправляют
app.use("/uploads", express.static("uploads")); //? При обращение к /uploads express будет искать статические файлы в папке uploads

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
); //? Запрос на авторизацию, добавляем дополнительно валидатор для проверки
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
); //? Запрос на регистрацию, добавляем дополнительно валидатор для проверки
app.get("/auth/me", checkAuth, UserController.getMe); //? Запрос на выдачу данных пользователя, добавляем дополнительно проверку актуальности авторизации

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  //? Загрузка изображения
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll); //? Получение всех статей
app.get("/posts/:id", PostController.getOne); //? Получение одной статьи
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
); //? Создание статьи
app.delete("/posts/:id", checkAuth, PostController.remove); //? Удаление статьи
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
); //? Изменение статьи

const port = process.env.PORT || 4445;
app.listen(port, (err) => {
  //? Включаем сервер на порту, если будет ошибка, то она выведется
  if (err) {
    return console.log(err);
  } else {
    return console.log("Server OK");
  }
});
