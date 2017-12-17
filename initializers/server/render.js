import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { matchPath, StaticRouter } from 'react-router-dom';
import { assign } from 'lodash';
import Helmet from 'react-helmet';

import createStore from 'store';
import routes, { Routes } from 'routes';

import prepareData from 'helpers/prepareData';
import webpackAsset from './webpackAsset';

const store = createStore();

export default (req, res) => {
  const state = {
    params: {},
    routes: [],
    query: {}
  };

  // бежим по всем роутам и матчим каждый в поисках подходящих
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match)
    {
      // Если нашли, то добавляем в состояние роутинга запись о таком роуте
      state.routes.push(route);
      assign(state.params, match.params);
      assign(state.query, req.query);
    }
    return match;
  });

  prepareData(store, state).then(() => {
    // и после этого рендерим страницу с начальным состоянием
    const initialState = JSON.stringify(store.getState());

    const content = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={state}>
          <Routes />
        </StaticRouter>
      </Provider>
    );

    const helmet = Helmet.rewind();

    res.status(200);
    res.render('index', { initialState, content, helmet, webpackAsset });
  });
};
