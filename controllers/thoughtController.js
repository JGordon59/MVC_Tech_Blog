const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models/index');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: ObjectId(req.params.thoughtId) }).select('-__v');
      
      if (!thought) {
        res.status(404).json({ message: 'That thought does not exist yet!' });
        return;
      }
      res.status(200).json(thought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async createThought(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        res.status(404).json({ message: 'Uh-oh! No user found.' });
        return;
      }

      const newThought = await Thought.create(req.body);

      const updatedUser = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: ObjectId(newThought._id) } },
        { new: true }
      );

      res.status(201).json([newThought, updatedUser]);
    } catch (error) {
      res.status(500).json(error)
    }
  },
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: ObjectId(req.params.thoughtId) },
        req.body,
        { new: true }
      );

      if (!updatedThought) {
        res.status(404).json({ message: 'No user has thought of that yet..' });
        return;
      }

      res.status(200).json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndRemove({ _id: ObjectId(req.params.thoughtId) });

      if (!deletedThought) {
        res.status(404).json({ message: 'No user has thought of that yet..' });
        return;
      }

      const updatedUser = await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: ObjectId(deletedThought._id) } }
      );

      res.status(200).json({ message: `The user has had its memory wiped. Thought Deleted. ` })
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async createReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: ObjectId(req.params.thoughtId) },
        { $push: { reactions: req.body } },
        { new: true }
      )

      if (!updatedThought) {
        res.status(404).json({ message: 'No user has thought of that yet..' });
        return;
      }

      res.status(201).json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteReaction(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: ObjectId(req.params.thoughtId) },
        { $pull: { reactions: req.body } },
        { new: true }
      )

      if (!updatedThought) {
        res.status(404).json({ message: 'No user has thought of that yet..' });
        return;
      }

      res.status(200).json(updatedThought);
    } catch (error) {
      res.status(500).json(error);
    };
  },
};