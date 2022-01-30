const User = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isVaunfollowlid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {
    await User.findById(req.params.id, (err, data) => {
      if (!err) res.status(200).json(data);
      else res.status(500).send({ err });
    }).select("-password");
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, data) => {
        if (!err) res.status(200).json(data);
        else res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {
    await User.remove({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {
    //add to the follower list
    await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, data) => {
        if (!err) res.status(200).json(data);
        else res.status(500).send({ message: err });
      }
    );
    //add to following list
    await User.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, data) => {
        if (err) res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnFollow)
  )
    return res.status(404).send({ message: `Unknown ID : ${req.params.id}` });

  try {

    await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnFollow } },
      { new: true, upsert: true },
      (err, data) => {
        if (!err) res.status(200).json(data);
        else res.status(500).send({ message: err });
      }
    );
    //add to following list
    await User.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, data) => {
        if (err) res.status(500).send({ message: err });
      }
    );

  } catch (err) {}
};
