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