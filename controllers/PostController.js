import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["fullName", "avatarUrl"] })
      .exec(); //? Вывод всех статей (find) + добавление информации о пользователе (populate) @.exec() нужен для завершения@

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //? Передача динамического параметра (id)

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId, //? То, по чему мы ищем объект
      },
      {
        $inc: { viewsCount: 1 }, //? Добавляем 1 к полю viewsCount
      },
      {
        returnDocument: "after", //? После всех преобразований возврашаем документ
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    return res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      //? Создание нового поста
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save(); //? Сохранение в БД

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id; //? Получение динамического параметра (id)

    const doc = await PostModel.findOneAndDelete({
      _id: postId,
    }); //? Удаление статьи по id

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id; //? Получение динамического параметра (id)

    await PostModel.updateOne(
      //? Обновление по id поста
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
