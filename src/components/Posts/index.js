import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose'

import { post } from '../../graphql'
import Post from './Post'
import CreatePost from './CreatePost'

const { POST_SUBSCRIPTION } = post.subscription
const { ALL_POSTS_QUERY, withAllPostsQuery } = post.query
const { deletePost } = post.mutation

const enhance = compose(
  withAllPostsQuery,
  deletePost,
  lifecycle({
    componentDidMount() {
      console.log('💩', this.props);
      this.props.allPostsQuery.subscribeToMore({
        document: POST_SUBSCRIPTION,
        updateQuery: (prev, arg) => {
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
  withHandlers({
    handleClick: ({ mutate }) => async (id) => await mutate({
      variables: { id },
      update: (proxy, res) => {
        const query = ALL_POSTS_QUERY
        const data = proxy.readQuery({ query })
        data.allPosts = data.allPosts.filter(post => post.id !== id)

        proxy.writeQuery({ query, data })
      },
    })
  })
)

const Posts = enhance(({ allPostsQuery, handleClick }) => {
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
        <Post key={post.id} post={post} onDelete={handleClick} />
      ))}
    </div>
  )
});

export default Posts
