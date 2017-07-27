import { gql } from 'react-apollo'

export const POST_MUTATION = gql`
  mutation Post($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        id
        title
        description
        author {
          id
          name
        }
      }
    }
  }
`

export const DELETE_POST = gql`
  mutation Post($id: ID!) {
    deletepost(id: $id)
  }
`
