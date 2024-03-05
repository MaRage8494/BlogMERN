import mongoose from "mongoose";

const PostSchema = new mongoose.Schema( //? Создание модели поста
  {
    fullName: {
      //? Заполнение полей
      type: String, //? Тип поля
      required: true, //? Обязательность его
    },
    email: {
      type: String,
      required: true,
      unique: true, //? Указывает на уникальность для каждого пользователя
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String, //*? Можно и так если никакие параметры больше не нужны
  },
  {
    timestamps: true, //? Добавляет поле с временем создания
  }
);

export default mongoose.model("User", UserSchema); //? Экспорт модели
