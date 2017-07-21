import uuid from 'uuid';
import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
  Query: {
    allPosts: async (root, req, { posts }) => {
      const { Items } = await posts.scan()
      console.log('🦑', Items)

      return Items
    },
    allUsers: async (root, req, { users }) => {
      const { Items } = await users.scan()
      console.log('🦑', Items)

      return Items
    },
    post: async(root, { id }, { posts }) => {
      const Key = { id }
      const { Item } = await posts.get({ Key })
      console.log('🦑', Item)

      return Item
    },
    user: async(root, { id }, { users }) => {
      const Key = { id }
      const { Item } = await users.get({ Key })
      console.log('🦑', Item)

      return Item
    },
  },
  Mutation: {
    createPost: async (root, req, { posts }) => {
      const Item = {
        id: uuid.v4(),
        authorId: '565dbdc0-36f2-4bba-be67-c126d0c71fff',
        ...req
      }
      await posts.create({ Item })
      pubsub.publish('postAdded', { postAdded: Item })

      return Item
    },
    updatePost: async (root, req, { posts }) => {
      const Key = { id: req.id }
      const { Item } = await posts.get({ Key })

      const params = {
        Key,
        UpdateExpression: "set title = :p, description = :d, authorId = :a",
        ExpressionAttributeValues: {
          ':p': req.title || Item.title,
          ':d': req.description || Item.description,
          ':a': Item.authorId
        },
        ReturnValues: 'UPDATED_NEW'
      }

      const { Attributes } = await posts.update(params)

      return { ...Key, ...Attributes}
    },
    createUser: async (root, req, { users }) => {
      const Item = { id: uuid.v4(), ...req }
      await users.create({ Item })

      return Item
    }
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator('postAdded')
    }
  },
  Post: {
    author: async(res, req, { users }) => {
      const Key = { id: res.authorId }
      const { Item } = await users.get({ Key })

      return Item
    }
  },
  User: {
    posts: async({ id }, req, { posts }) => {
      const params = {
        FilterExpression: "authorId = :id",
        ExpressionAttributeValues: { ":id": id }
      };
      const { Items } = await posts.scan(params)
      console.log('🦑', Items)

      return Items
    }
  }
}
