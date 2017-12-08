import React from 'react';
import { Route } from 'react-router-dom';

import About from 'components/About';
import Contacts from 'components/Contacts';
import initialLoad from 'helpers/initialLoad';
import MainLayout from 'components/layouts/MainLayout';
import PostsContainer from 'containers/PostsContainer';
import PostFormContainer from 'containers/PostFormContainer';
import PostContainer from 'containers/PostContainer';
import { aboutPath, contactsPath, rootPath, editPostPath, postPath } from 'helpers/routes';
import { fetchPosts } from 'actions/Posts';
import { fetchPost } from 'actions/Post';

const routes = [
  {
    path: rootPath(),
    component: PostsContainer,
    prepareData: (store) => {
      if (initialLoad()) {
        return;
      }

      const {
        posts: { filter, pagination: { current, size } }
      } = store.getState();

      return store.dispatch(fetchPosts({ page: current, pageSize: size, filter }));
    },
    exact: true
  },
  {
    path: postPath(),
    component: PostContainer,
    prepareData: (store, query, params) => (
      store.dispatch(fetchPost(params.id))
    ),
    exact: true
  },
  {
    path: editPostPath(),
    component: PostFormContainer,
    prepareData: (store, query, params) => (
      store.dispatch(fetchPost(params.id))
    )
  },
  {
    path: aboutPath(),
    component: About,
  },
  {
    path: contactsPath(),
    component: Contacts,
  }
];

export default routes;

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) => (
  <Route exact={route.exact} strict={route.exact} path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
);

export const Routes = () => (
  <MainLayout>
    {
      routes.map(
        (route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        )
      )
    }
  </MainLayout>
);
