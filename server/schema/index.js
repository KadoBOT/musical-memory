import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers'

const typeDefs = `
  type Post {
    id: ID!
    title: String!
    description: String!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Query {
    allPosts: [Post],
    allUsers: [User],
    post(id: ID!): Post
    user(id: ID!): User
  }

  type Mutation {
    createPost(title: String!, description: String!): Post
    updatePost(id: ID!, title: String, description: String): Post
    createUser(name: String!, email: String!): User
  }

  type Subscription {
    postAdded: Post
  }

  schema {
    query: query
    mutation: Mutation
    Subscription: Subscription
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
