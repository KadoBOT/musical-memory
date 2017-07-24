import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { graphql } from 'react-apollo'
import { gql } from 'react-apollo'

import { post } from '../../graphql'

const { POST_MUTATION } = post.mutation
const { ALL_POSTS_QUERY } = post.query

const enhance = compose(
  withState('description', 'setDescription', ''),
  withState('title', 'setTitle', ''),
  withHandlers({
    onChange: ({ setDescription, setTitle }) => e => {
      e.target.name === 'title' ? setTitle(e.target.value) : setDescription(e.target.value)
    },
    createPost: ({ description, mutate, setDescription, setTitle, title }) => async (e) => {
      e.preventDefault()
      try {
        const input = { description, title }
        const res = await mutate({
          variables: { input },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   createPost: {
          //     post: {
          //       author: {
          //         id: -1,
          //         name: 'John Doe',
          //         __typename: 'User',
          //       },
          //       description,
          //       id: -1,
          //       title,
          //       __typename: 'Post',
          //     },
          //     __typename: 'PostPayload',
          //   }
          // },
          // update: (proxy, { data: { createPost } }) => {
          //   const { post } = createPost
          //   const query = ALL_POSTS_QUERY
          //   const data = proxy.readQuery({ query })
          //   data.allPosts.push(post);
          //
          //   proxy.writeQuery({ query, data })
          // },
        })
        console.log(res)
        setDescription('')
        setTitle('')
      } catch (err) {
        console.error('💩', err);
      }
    }
  })
)

const CreatePost = enhance(({ createPost, description, title, onChange }) => (
  <div>
    <form onSubmit={createPost}>
      <div className='flex flex-column mt3'>
        <input
          className='mb2'
          name="title"
          value={title}
          onChange={onChange}
          type='text'
          placeholder='The title for the post'
        />
        <input
          className='mb2'
          name="description"
          value={description}
          onChange={onChange}
          type='text'
          placeholder='A description for the post'
        />
      </div>
      <button
        className='button'
        type="submit"
      >
        submit
      </button>
    </form>
  </div>
));

export default graphql(ALL_POSTS_QUERY)(graphql(POST_MUTATION)(CreatePost));
