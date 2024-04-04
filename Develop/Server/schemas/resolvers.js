const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  Query: {
    // Resolver function to get a single user by either their id or their username
    getSingleUser: async (_, { id, username }, { user }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: user ? user._id : id }, { username }],
        });

        if (!foundUser) {
          throw new Error('Cannot find a user with this id or username!');
        }

        return foundUser;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // Resolver function to create a user, sign a token, and send it back
    createUser: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });

        if (!user) {
          throw new Error('Something went wrong while creating the user!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(err);
      }
    },
    // Resolver function to login a user, sign a token, and send it back
    login: async (_, { usernameOrEmail, password }) => {
      try {
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });

        if (!user) {
          throw new Error("Can't find this user");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new Error('Wrong password!');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(err);
      }
    },
    // Resolver function to save a book to a user's `savedBooks` field
    saveBook: async (_, { bookInput }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookInput } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error(err);
      }
    },
    // Resolver function to remove a book from `savedBooks`
    deleteBook: async (_, { bookId }, { user }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
