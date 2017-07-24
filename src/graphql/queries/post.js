import { graphql, gql } from 'react-apollo'

export const ALL_POSTS_QUERY = gql`
  query AllPosts {
    allPosts {
      id
      title
      description
      author {
        id
        name
      }
    }
  }
`

export const withAllPostsQuery = graphql(ALL_POSTS_QUERY, { name: 'allPostsQuery' })
