import { gql } from 'react-apollo'

export const POST_SUBSCRIPTION = gql`
  subscription postAdded {
    postAdded(filter: {
      mutation_in: [CREATED]
    }) {
      id
      title
      description
    }
  }
`
