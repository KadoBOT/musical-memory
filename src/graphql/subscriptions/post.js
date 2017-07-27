import { gql } from 'react-apollo'

export const POST_SUBSCRIPTION = gql`
  subscription PostAdded {
    postAdded(filter: {
      mutation_in: [CREATED]
    }) {
      id
      title
      description
      author {
        name
        id
      }
    }
  }
`
