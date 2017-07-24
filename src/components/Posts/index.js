import React from 'react';
import { compose, lifecycle } from 'recompose'
import { graphql, gql } from 'react-apollo'

import { post } from '../../graphql'
import Post from './Post'
import CreatePost from './CreatePost'

const { POST_SUBSCRIPTION } = post.subscription
const { withAllPostsQuery, ALL_POSTS_QUERY } = post.query

const withData = graphql(ALL_POSTS_QUERY, {
  name: 'allPostsQuery',
  props: props => ({
    subscribeToNewPosts: params => (
      props.allPostsQuery.subscribeToMore({
        document: POST_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newPost = subscriptionData.data.postAdded
          console.log('😆', {...prev, allPosts: [...prev.allPosts, newPost]})
          return {...prev, allPosts: [...prev.allPosts, newPost]}
        },
        onError: err => console.error("💩", err)
      })
    )
  })
})

const enhance = compose(
  withData,
  withAllPostsQuery,
  lifecycle({
    componentWillMount(){
      console.log('🍌', this.props)
      this.props.subscribeToNewPosts()
    }
  })
)

const Posts = enhance(({ allPostsQuery }) => {
  if (allPostsQuery && allPostsQuery.loading) {
    return <div>Loading</div>
  }

  if (allPostsQuery && allPostsQuery.error) {
    return <div>Error</div>
  }

  const { allPosts } = allPostsQuery
  console.log('📦', allPostsQuery)

  return (
    <div className="cf w-100 pa2-ns">
      <CreatePost />
      {allPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
});

export default Posts
