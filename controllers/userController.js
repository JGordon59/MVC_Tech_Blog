const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models/index');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: ObjectId(req.params.userId) })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v');

      if (!user) {
        res.status(404).json({ message: 'This user does not exist!' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: ObjectId(req.params.userId) },
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'This user does not exist!' });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndRemove({ _id: ObjectId(req.params.userId) });

      if (!deletedUser) {
        res.status(404).json({ message: 'This user does not exist!' });
        return;
      }

      const deletedThoughts = await Thought.deleteMany({ username: deletedUser._id });

      res.status(200).json({ message: 'This user was snapped away by Thanos' });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async addFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: ObjectId(req.params.userId) },
        { $push: { friends: ObjectId(req.params.friendId) } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'This friend is currently not on our network, would you like to send them a join request?' });
        return;
      };

      const updatedFriend = await User.findOneAndUpdate(
        { _id: ObjectId(req.params.friendId) },
        { $push: { friends: ObjectId(req.params.userId) } },
        { new: true }
      );

      res.status(201).json([updatedUser, updatedFriend]);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteFriend(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: ObjectId(req.params.userId) },
        { $pull: { friends: ObjectId(req.params.friendId) } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: 'This friend is currently not on our network, would you like to send them a join request?' });
        return;
      };

      const updatedFriend = await User.findOneAndUpdate(
        { _id: ObjectId(req.params.friendId) },
        { $pull: { friends: ObjectId(req.params.userId) } },
        { new: true }
      );

      res.status(200).json([updatedUser, updatedFriend]);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};