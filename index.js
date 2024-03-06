import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import "dotenv/config.js";

import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(process.env.DB_CONN)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err)); //? Подключение к БД

const app = express(); //? Использование app в качестве управление express

app.use(express.json()); //? Делает так, чтобы express мог читать JSON файлы, которые ему отправляют
app.post("/auth/login", loginValidation, UserController.login); //? Запрос на авторизацию, добавляем дополнительно валидатор для проверки
app.post("/auth/register", registerValidation, UserController.register); //? Запрос на регистрацию, добавляем дополнительно валидатор для проверки
app.get("/auth/me", checkAuth, UserController.getMe); //? Запрос на выдачу данных пользователя, добавляем дополнительно проверку актуальности авторизации

app.get("/posts", PostController.getAll); //? Получение всех статей
app.get("/posts/:id", PostController.getOne); //? Получение одной статьи
app.post("/posts", checkAuth, postCreateValidation, PostController.create); //? Создание статьи
app.delete("/posts/:id", checkAuth, PostController.remove); //? Удаление статьи
app.patch("/posts/:id", checkAuth, PostController.update); //? Изменение статьи

const port = process.env.PORT || 4445;
app.listen(port, (err) => {
  //? Включаем сервер на порту, если будет ошибка, то она выведется
  if (err) {
    return console.log(err);
  } else {
    return console.log("Server OK");
  }
});
