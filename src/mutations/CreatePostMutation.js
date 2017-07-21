// import {
//   commitMutation,
//   graphql,
// } from 'react-relay'
// import { ConnectionHandler } from 'relay-runtime'
// import environment from '../Environment'
//
// const mutation = graphql`
//   mutation CreatePostMutation($input: CreatePostInput!) {
//     createPost(input: $input) {
//       id
//       title
//       description
//     }
//   }
// `
//
// export default (description, url, callback) => {
//   const variables = {
//     input: {
//       description,
//       url,
//       clientMutationId: ''
//     }
//   }
//
//   commitMutation(
//     environment,
//     {
//       mutation,
//       variables,
//       onCompleted: () => callback(),
//       onError: err => console.error(err)
//     }
//   )
// }
