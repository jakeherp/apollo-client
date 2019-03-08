import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";

import Pages from "./pages";
import { LaunchTile, Header, Button, Loading } from "../components";

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
  link
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
);
