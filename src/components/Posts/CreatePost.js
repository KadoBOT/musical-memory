import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { gql, graphql } from 'react-apollo'

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
        await mutate({ variables: { description, title } })
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

const POST_MUTATION = gql`
  mutation Post($title: String!, $description: String!) {
    createPost(title: $title, description: $description) {
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

export default graphql(POST_MUTATION)(CreatePost);
