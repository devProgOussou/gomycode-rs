const Post = require("../models/post.model");
const User = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  Post.find((err, data) => {
    if (!err) res.status(200).send(data);
    else console.log(`Error get data ${err}`);
  });
};

module.exports.createPost = async (req, res) => {
  const newPost = new Post({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  const updatedRecord = {
    message: req.body.message,
  };

  Post.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true, upsert: true },
    (err, data) => {
      if (!err) res.status(200).send(data);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  Post.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) res.status(200).send(data);
    else console.log("Error deleting : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
      }
    );
    await Post.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, data) => {
        console.log(data);
        if (!err) res.send(data);
        else res.status(200).send(err);
      }
    );
  } catch (err) {
    return res.status(200).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  
};

