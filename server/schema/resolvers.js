import uuid from 'uuid';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const POST_ADDED_TOPIC = 'postAdded';

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
    createPost: async (root, { input }, { posts, users }) => {
      const Item = {
        id: uuid.v4(),
        authorId: 'b5c78e7a-fc37-436f-a341-4e89ec10eb1e',
        ...input
      }
      await posts.create({ Item })
      console.log('🥈', Item)
      pubsub.publish(POST_ADDED_TOPIC, { [POST_ADDED_TOPIC]: Item })

      return { post: Item }
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

      return { post: { ...Key, ...Attributes } }
    },
    deletePost: async (root, { id }, { posts }) => {
      const Key = { id }
      return await posts.delete({ Key })
    },
    createUser: async (root, { input }, { users }) => {
      const Item = { id: uuid.v4(), ...input }
      await users.create({ Item })
      console.log('🦑', Item, { user: Item })

      return { user: Item }
    }
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(POST_ADDED_TOPIC),
    }
  },
  Post: {
    author: async({ authorId }, req, context) => {
      const obj = { a: '1', foo: '2', c: '3'}
      console.log('🥇','foo' in obj) // true
      const Key = { id: authorId }
      const { Item } = await context.users.get({ Key })

      return Item
    }
    // author: (res, req, context) => {
    //   return {name: 'John Doe', id: '23997ef2-7098-4915-b0f5-23535b1bcd0e'}
    // },
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
