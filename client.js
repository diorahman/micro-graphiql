import React from 'react';
import GraphiQL from 'graphiql';
import {render} from 'react-dom';
import fetch from 'isomorphic-fetch';

const fetcher = (params) => {
  return fetch(`${window.location.origin}/graph`, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(params)
  }).then(response => response.json());
}

render(<GraphiQL fetcher={fetcher} />, document.body);
