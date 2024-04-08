const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  Query: {
    getSingleUser: async (_, { id, username }, { user }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: user ? user._id : id }, { username }],
        });

        if (!foundUser) {
          return new Error('Cannot find a user with this id or username!');
        }

        return foundUser;
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });

        if (!user) {
          return new Error('Something went wrong while creating the user!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        return err;
      }
    },
    login: async (_, { usernameOrEmail, password }) => {
      try {
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        if (!user) {
          return new Error("Can't find this user");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          return new Error('Wrong password!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        return err;
      }
    },
    saveBook: async (_, { bookInput }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
    removeBook: async (_, { bookId }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          return new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        return err;
      }
    },
  },
};
