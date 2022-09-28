import React from "react";
import useIdentity from "./useIdentity";

const RouteGuard = ({
    children,
    disableLoader,
    disabled = false,
    reverse = false // only de-authenticated users are allowed to access this path
}) => {

    const { 
        LoaderComponent, 
        isAuthenticated, 
        enableLoader, 
        navigateToDefault,
        disableRouteGuard
    } = useIdentity();

    // if isAuthenticated hasn't be initialized, it's loading
    if ( !disableRouteGuard && !disabled ){
        if ( isAuthenticated === null ){
            return enableLoader && !disableLoader ? (
                <LoaderComponent />
            ) : children;
        }
    
        if ( isAuthenticated === false && !reverse ){
            navigateToDefault();
            return <></>;
        }
    }

    if ( isAuthenticated && reverse ){
        navigateToDefault(true);
        return <></>;
    }
    
    return children;
}

export default RouteGuard;