import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjl09zvkj0h4c0154gymm3d88',
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});