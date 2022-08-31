import PostModel from "../models/PostModel.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problems with receiving the posts",
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Some problems with receiving the post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Article is not found",
          });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problem with getting posts",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(','),
      viewsCount: req.body.viewsCount,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problem with post creation",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(','),
        viewsCount: req.body.viewsCount,
        user: req.userId,
        imageUrl: req.body.imageUrl,
      }
    );
    res.json({
        success: true
    })
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problem with post creation",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Some problem with deleting post",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Article is not found",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problem with getting posts",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(item => item.tags).flat().slice(0,5)

    res.json(tags);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Some problem with getting posts",
    });
  }
};