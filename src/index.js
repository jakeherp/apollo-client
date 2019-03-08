import React from "react";
import ReactDOM from "react-dom";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { Query, ApolloProvider } from "react-apollo";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";
import { resolvers, typeDefs } from "./resolvers";
import injectStyles from "./styles";

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "https://server-afz9orqws.now.sh/"
});

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "https://server-afz9orqws.now.sh/graphql",
    headers: {
      authorization: localStorage.getItem("token")
    }
  }),
  resolvers,
  typeDefs
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: []
  }
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
);
