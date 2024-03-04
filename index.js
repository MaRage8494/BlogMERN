import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import "dotenv/config.js";

import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";

mongoose
  .connect(process.env.DB_CONN)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err)); //? Подключение к БД

const app = express(); //? Использование app в качестве управление express

app.use(express.json()); //? Делает так, чтобы express мог читать JSON файлы, которые ему отправляют

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); //? Находим пользователя по email

    if (!user) {
      //? Ошибка если пользователь не найден
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      //? Проверка правильности пароля
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      //? Ошибка если пароль неверный
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      //? Генерация JWT токена по id пользователя
      {
        _id: user._id,
      },
      "bebra1337", //? Секретное слово по которому шифруется
      {
        expiresIn: "30d", //? Сроком на 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc; //? Удаляем passwordHash с финального ответа

    res.json({
      //? Если всё нормально, то вернётся инфа о пользователе (кроме пароля) и токен
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
});

app.post("/auth/register", registerValidation, async (req, res) => {
  //? Запрос на регистрацию, добавляем дополнительно валидатор для проверки
  try {
    const errors = validationResult(req); //? Если будут возникать ошибки при валидации, то они будут записываться в errors
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()); //? Если же ошибки всё таки есть, то вернется ответ с ошибкой и статусом 400 (Bad request)
    }

    const password = req.body.password; //? Получаем пароль с запроса
    const salt = await bcrypt.genSalt(10); //? Генерируем "соль" для шифрования
    const hash = await bcrypt.hash(password, salt); //? Шифруем полученный пароль сгенерированной солью

    const doc = new UserModel({
      //? Создаем новую модель пользователя
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save(); //? Сохраняем пользователя в БД

    const token = jwt.sign(
      //? Генерация JWT токена по id пользователя
      {
        _id: user._id,
      },
      "bebra1337", //? Секретное слово по которому шифруется
      {
        expiresIn: "30d", //? Сроком на 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc; //? Удаляем passwordHash с финального ответа

    res.json({
      //? Если всё нормально, то вернётся инфа о пользователе (кроме пароля) и токен
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

app.get("/auth/me", (req, res) => {
  try {
  } catch (err) {}
});

const port = process.env.PORT || 4445;
app.listen(port, (err) => {
  //? Включаем сервер на порту, если будет ошибка, то она выведется
  if (err) {
    return console.log(err);
  } else {
    return console.log("Server OK");
  }
});
