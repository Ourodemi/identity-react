import { createContext, useEffect, useReducer, useState } from "react";
import useReactPath from "./useReactPath";
import identityReducer, { initialIdentityState } from "./identityReducer";
import OurodemiIdentity from './Identity';

const IdentityContext = createContext(null);

export const IdentityProvider = ({
    url,
    navigate, // use custom navigation e.g. React Router
    routes = [],
    defaultRoute,
    defaultRouteState = { auth: false },
    disableRouteGuard = false,

    children
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
                    payload: user
                })
            }
        })
    }, [isAuthenticated])

    /* Route Guard */
    useEffect(() => {
        if ( disableRouteGuard || !defaultRoute ){
            return;
        }
        
        let route = routes.filter((v, i) => v.path === path);
        route = route.length < 1 ? defaultRouteState : route[0];

        if ( isAuthenticated === false && route.auth ){
            if ( navigate ){
                navigate(defaultRoute);
            }else{
                window.location.href = defaultRoute;
            }
        }
    }, [path, disableRouteGuard, isAuthenticated]);

    <IdentityContext.Provider value={{ ...state, isAuthenticated, IdentityAPI, refreshIdentity }}>
        {children}
    </IdentityContext.Provider>
}

export default IdentityContext;