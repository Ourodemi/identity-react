import React, { createContext, useEffect, useReducer, useState } from "react";
import useReactPath from "./useReactPath";
import OurodemiIdentity from './Identity';
import identityReducer, { initialIdentityState, UPDATE_USER } from "./identityReducer";

const axios = require('axios').default;

const IdentityContext = /*#__PURE__*/createContext(null);
export const IdentityProvider = ({
  url,
  apiConfig = {
    url: "",
    headers: {
      access_token: 'Authorization'
    },
    defaultHeaders: {}
  },
  navigate,
  // use custom navigation e.g. React Router
  routes = [],
  defaultRoute,
  defaultRouteState = {
    auth: false
  },
  disableRouteGuard = true,
  disableAuth = false,
  children
}) => {
  const [state, dispatch] = useReducer(identityReducer, initialIdentityState);
  const IdentityAPI = new OurodemiIdentity(url);
  const path = useReactPath();
  const [isAuthenticated, setAuthenticated] = useState(null);

  const refreshIdentity = () => {
    IdentityAPI.isAuthenticated().then(setAuthenticated);
  };

  useEffect(refreshIdentity, []);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    IdentityAPI.getUser().then(user => {
      if (user) {
        dispatch({
          type: UPDATE_USER,
          payload: user
        });
      }
    });
  }, [isAuthenticated]);
  /* Route Guard */

  useEffect(() => {
    if (disableRouteGuard || !defaultRoute) {
      return;
    }

    let route = routes.filter((v, i) => v.path === path);
    route = route.length < 1 ? defaultRouteState : route[0];

    if (isAuthenticated === false && route.auth) {
      if (navigate) {
        navigate(defaultRoute);
      } else {
        window.location.href = defaultRoute;
      }
    }
  }, [path, disableRouteGuard, isAuthenticated]);

  const login = async (id, password) => {};

  const logout = async () => {
    await IdentityAPI.deauth();
    setAuthenticated(false);
  };

  const api = (path, options = {}) => {
    const {
      url
    } = apiConfig || {};
    const {
      params,
      headers,
      method = 'GET',
      useAuth = true,
      data
    } = options;
    return new Promise(async (resolve, reject) => {
      let _headers = { ...apiConfig.defaultHeaders,
        ...headers
      };

      if (useAuth && !disableAuth) {
        IdentityAPI.request(accessToken => {
          _headers[apiConfig.headers.access_token] = accessToken;
          axios({
            url: `${url}${path}`,
            method,
            headers: _headers,
            params,
            data
          }).then(resolve).catch(reject);
        });
      } else {
        axios({
          url: `${url}${path}`,
          method,
          headers: _headers,
          params,
          data
        }).then(resolve).catch(reject);
      }
    });
  };

  return /*#__PURE__*/React.createElement(IdentityContext.Provider, {
    value: { ...state,
      isAuthenticated,
      IdentityAPI,
      refreshIdentity,
      logout,
      login,
      api
    }
  }, children);
};
export default IdentityContext;