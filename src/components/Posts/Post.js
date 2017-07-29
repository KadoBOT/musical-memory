import React from 'react';

const Post = ({ onDelete, post }) => {
  const deletePost = () => onDelete(post.id)
  return (
    <article className="fl hidden w-100 pa2">
      <div className="br3 ba b--black-10">
        <h1 className="f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3 nowrap truncate">
          {post.title}
          <span className="f6 i"> by {post.author ? post.author.name : ''}</span>
          <span className="fr grow pointer" onClick={deletePost}>🗑</span>
        </h1>
        <div className="pa3 bt b--black-10">
          <p className="f6 f5-ns lh-copy measure">{post.description}</p>
        </div>
      </div>
    </article>
  )
};

export default Post
