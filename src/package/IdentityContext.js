import React, { 
    createContext, 
    useEffect, 
    useReducer, 
    useState 
} from "react";

import useReactPath from "./useReactPath";
import OurodemiIdentity from './Identity';

import identityReducer, { 
    initialIdentityState,
    UPDATE_USER
} from "./identityReducer";

const axios = require('axios').default;

const IdentityContext = createContext(null);

export const IdentityProvider = ({
    url,
    apiConfig = {
        url: "",
        headers: { access_token: 'Authorization'},
        defaultHeaders: {}
    },
    navigate, // use custom navigation e.g. React Router
    routes = {},
    defaultRoute,
    defaultAuthenticatedRoute,
    defaultRouteState = { auth: false },
    disableRouteGuard = false, // to be removed
    enableRouteGuard = false,
    enableLoader = false,
    disableAuth = false,
    children,

    LoaderComponent
}) => {
    const [state, dispatch] = useReducer(identityReducer, initialIdentityState);

    const IdentityAPI = new OurodemiIdentity(url);

    const path = useReactPath();
    const [isAuthenticated, setAuthenticated] = useState(null);

    const refreshIdentity = () => {
        IdentityAPI.isAuthenticated().then(setAuthenticated);
    }

    useEffect(refreshIdentity, []);

    useEffect(() => {
        if ( !isAuthenticated ){
            return;
        }

        IdentityAPI.getUser().then((user) => {
            if ( user ){
                dispatch({
                    type: UPDATE_USER,
                    payload: user
                })
            }
        });
    }, [isAuthenticated])

    /* Route Guard */
    /* Disabled for now, use separate RouteGuard component*/
    useEffect(() => {
        return;

        if ( (disableRouteGuard || !defaultRoute) && !enableRouteGuard ){
            return;
        }

        if ( !enableRouteGuard ){
            return;
        }
    
        let route = routes[path];
        if ( !route ){
            let k = Object.keys(routes).filter((key, i) => {
                return key === path.substring(0, key.length);
            });

            route = k.length < 1 ? defaultRouteState : routes[k[0]];
        }

        if ( isAuthenticated === false && route.auth ){
            navigateToDefault();
        }
    }, [path, disableRouteGuard, isAuthenticated]);

    // navigates to the default route
    const navigateToDefault = (auth = false) => {
        if ( navigate ){
            navigate(auth ? defaultAuthenticatedRoute : defaultRoute);
        }else{
            window.location.href = auth ? defaultAuthenticatedRoute : defaultRoute;
        }
    }

    /**
     * Override and/or set the currenty identity manually. This will set the authenticated
     * state to true.
     * @param identity - user object, access token, refresh token, and expiry times
     */
    const setIdentity = ({ access_token, refresh_token, user, access_token_expiry, refresh_token_expiry }) => {
        IdentityAPI.clearLocalIdentity();
        IdentityAPI.updateLocalIdentity({ 
            access_token, refresh_token, user, 
            access_token_expiry, refresh_token_expiry 
        });
        setAuthenticated(true);
    };

    const login = async (id, password) => {
        
    }

    const logout = async () => {
        await IdentityAPI.deauth();
        setAuthenticated(false);
    }

    const api = (path, options = {}) => {
        const { url } = apiConfig || {};
        const { params, headers, method = 'GET', useAuth = true, data } = options;

        return new Promise(async (resolve, reject) => {
            let _headers = { ...apiConfig.defaultHeaders, ...headers };

            if ( useAuth && !disableAuth ){
                IdentityAPI.request((accessToken) => {
                    _headers[apiConfig.headers.access_token] = accessToken;
                    axios({
                        url: `${url}${path}`,
                        method,
                        headers: _headers,
                        params,
                        data
                    }).then(resolve).catch(reject);
                });
            }else{
                axios({
                    url: `${url}${path}`,
                    method,
                    headers: _headers,
                    params,
                    data
                }).then(resolve).catch(reject)
            }
        });
    }

   return (
    <IdentityContext.Provider 
        value={{ 
            ...state, 
            isAuthenticated, 
            IdentityAPI, 
            navigateToDefault,
            refreshIdentity, 
            logout, 
            login,
            api,
            setIdentity,
            LoaderComponent,
            enableLoader,
            disableRouteGuard
        }}
    >
        {children}
    </IdentityContext.Provider>
   );
}

export default IdentityContext;