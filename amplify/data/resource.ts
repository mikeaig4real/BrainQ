import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // This tells the data client in your app (generateClient())
    // to sign API requests with the user authentication token. 
    defaultAuthorizationMode: 'userPool',
  },
});