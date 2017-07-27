const typeDefs = `
  type Post {
    id: ID
    title: String
    description: String
    author: User @relation(name: "PostAuthor")
  }

  type User {
    id: ID
    name: String
    email: String
    password: String
    posts: [Post] @relation(name: "UserPosts")
  }

  type PostPayload {
    post: Post
  }

  type CreateUserPayload {
    user: User
  }

  type Query {
    allPosts: [Post]
    allUsers: [User]
    post(id: ID!): Post
    user(id: ID!): User
  }

  type Mutation {
    createPost(input: CreatePostInput!): PostPayload
    updatePost(input : UpdatePostInput!): PostPayload
    deletePost(id: ID!): PostPayload
    createUser(input : CreateUserInput!): CreateUserPayload
  }

  type Subscription {
    postAdded: Post
  }

  input CreatePostInput {
    title: String!
    description: String!
  }


  input UpdatePostInput {
    id: ID!
    title: String!,
    description: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

export default typeDefs