const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      if (body.trim() === "") throw new Error("Post Body must not be empty");
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt:Date.now(),
      });
      const post = await newPost.save();
      context.pubsub.publish("NEW_POST", { newPost: post });
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);
      if(!post) throw new Error(`Post not found`);
      if (user.username === post.username) {
        try {
          await post.delete();
          return "Post Deleted successfually";
        } catch (err) {
          throw new Error(`There was an error deleting post ${err}`);
        }
      } else {
        throw new AuthenticationError("Action not alloweds");
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (root, _, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
