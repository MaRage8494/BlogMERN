import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  //? Функционал регистрации
  try {
    const password = req.body.password; //? Получаем пароль с запроса
    const salt = await bcrypt.genSalt(10); //? Генерируем "соль" для шифрования
    const hash = await bcrypt.hash(password, salt); //? Шифруем полученный пароль сгенерированной солью

    const doc = new UserModel({
      //? Создаем новую модель пользователя
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl || "/uploads/default-avatar.png",
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
};

export const login = async (req, res) => {
  //? Функционал авторизации
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
};

export const getMe = async (req, res) => {
  //? Функционал выдачи данных
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc; //? Удаляем passwordHash с финального ответа

    res.json({
      //? Если всё нормально, то вернётся инфа о пользователе (кроме пароля)
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
