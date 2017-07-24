import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers'
import schema from './schema.graphql'

export default makeExecutableSchema({
   typeDefs: schema,
   resolvers
 })
