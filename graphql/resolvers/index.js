const commentResolvers = require("./comments");
const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const likeResolvers = require("./like");

module.exports = {
  Post: {
    likeCount: (parent) => (parent.likeCount = parent.likes.length),
    commentCount: (parent) => (parent.commentCount = parent.comments.length),
  },

  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...likeResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
