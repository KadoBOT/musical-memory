import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose'

import { post } from '../../graphql'
import Post from './Post'
import CreatePost from './CreatePost'

const { POST_SUBSCRIPTION } = post.subscription
const { withAllPostsQuery } = post.query
const { DELETE_POST } = post.mutation

const enhance = compose(
  withAllPostsQuery,
  lifecycle({
    componentWillMount() {
      console.log('💩', this.props);
      this.props.allPostsQuery.subscribeToMore({
        document: POST_SUBSCRIPTION,
        updateQuery: (prev, arg) => {
          console.log('👯‍', prev, arg)
          const { subscriptionData } = arg
          const newPost = subscriptionData.data.postAdded
          console.log('😆', {...prev, allPosts: [...prev.allPosts, newPost]})
          return {...prev, allPosts: [...prev.allPosts, newPost]}
        },
        onError: err => console.error("💩", err)
      })
    }
    // componentWillReceiveProps(newProps) {
    //   console.log("💩", newProps)
    //   if(!newProps.allPostsQuery.loading) {
    //     if(this.unsubscribe) {
    //       if (newProps.allPostsQuery !== this.props.allPostsQuery) {
    //         this.unsubscribe()
    //       } else {
    //         return
    //       }
    //     }
    //
    //     console.log(newProps.allPostsQuery)
    //
        // this.unsubscribe = newProps.allPostsQuery.subscribeToMore({
        //   document: POST_SUBSCRIPTION,
        //   updateQuery: (prev, { subscriptionData }) => {
        //     const newPost = subscriptionData.data.postAdded
        //     console.log('😆', {...prev, allPosts: [...prev.allPosts, newPost]})
        //     return {...prev, allPosts: [...prev.allPosts, newPost]}
        //   },
        //   onError: err => console.error("💩", err)
        // })
    //   }
    // }
  }),
  // withHandlers({
  //   handleClick: ({ mutate }) => async (id) => {
  //     await mutate
  //   }
  // })
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
