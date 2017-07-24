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
      // const Key = { id: '3b1884b8-9ee7-4d9d-ab2f-ff32bcd69b9a' }
      // const user = await users.get({ Key })
      //
      // console.log('🌝', user.Item)

      const Item = {
        id: uuid.v4(),
        authorId: '3b1884b8-9ee7-4d9d-ab2f-ff32bcd69b9a',
        ...input
      }
      await posts.create({ Item })
      await pubsub.publish(POST_ADDED_TOPIC, { [POST_ADDED_TOPIC]: Item })

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
    author: async({ authorId }, req, { users }) => {
      const Key = { id: authorId }
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
