import mongoose from "mongoose";

const PostSchema = new mongoose.Schema( //? Создание модели поста
  {
    title: {
      //? Заполнение полей
      type: String, //? Тип поля
      required: true, //? Обязательность его
    },
    text: {
      type: String,
      required: true,
      unique: true, //? Указывает на уникальность для каждого текста
    },
    tags: {
      type: Array,
      default: [], //? Если ничего не передаётся, то выдать пустой массив
    },
    viewsCount: {
      type: Number,
      default: 0, //? Изначально 0 просмотров
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, //? Тип айдишника в mongoDB
      ref: "User", //? Связывание этой таблицы с другой (Ссылаться на пользователя и вытаскивать его по id)
      required: true,
    },
    imageUrl: String, //*? Можно и так если никакие параметры больше не нужны
  },
  {
    timestamps: true, //? Добавляет поле с временем создания
  }
);

export default mongoose.model("Post", PostSchema); //? Экспорт модели
