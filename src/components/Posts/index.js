import React from 'react';
import { gql, graphql } from 'react-apollo'
import { compose, lifecycle } from 'recompose'

import Post from './Post'

const postsSubscription = gql`
  subscription postAdded {
    postAdded {
      id
      title
      description
    }
  }
`

const enhance = compose(
  lifecycle({
    componentWillMount() {
      console.log("🖥️",this.props)
    },
    componentDidMount(){
      this.props.allPostsQuery.subscribeToMore({
        document: postsSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          console.log("👹", subscriptionData)
          if (!subscriptionData.data) {
            return prev;
          }
          const newPost = subscriptionData.data.postAdded;
          // don't double add the message
          if (!prev.allPosts.find(post => post.id === newPost.id)) {
            console.log('🐃', newPost)
            return newPost
          } else {
            return prev;
          }
        }
      });
    }
  })
)

const Posts = enhance((props) => {
  const { allPostsQuery } = props
  if (allPostsQuery && allPostsQuery.loading) {
    return <div>Loading</div>
  }

  if (allPostsQuery && allPostsQuery.error) {
    return <div>Error</div>
  }

  const { allPosts } = allPostsQuery

  return (
    <div className="cf w-100 pa2-ns">
      {allPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
});

const ALL_POSTS_QUERY = gql`
  query AllPosts {
    allPosts {
      id
      title
      description
      author {
        name
      }
    }
  }
`

export default graphql(ALL_POSTS_QUERY, { name: 'allPostsQuery' })(Posts)
