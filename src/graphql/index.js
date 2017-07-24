import mutations from './mutations'
import queries from './queries'
import subscriptions from './subscriptions'

const { postMutation } = mutations
const { postQuery } = queries
const { postSubscription } = subscriptions

export const post = {
  query: postQuery,
  mutation: postMutation,
  subscription: postSubscription
}
