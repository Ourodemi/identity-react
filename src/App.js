import React from "react";

import { IdentityProvider } from "./package";
import RouteGuard from "./package/RouteGuard";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Guard from './tests/Guard';
import Login from './tests/Login';
import Public from './tests/Public';


function App(){

    return (
        <IdentityProvider 
            url="identity.ourodemi.com"
            apiConfig={{
                url: "https://mock-delivery-api.herokuapp.com",
                headers: { access_token: 'Authorization' },
                defaultHeaders: {
                    Accept: "application/json"
                }
            }}
            defaultRouteState={{ auth: false }}
            defaultRoute='/'
            defaultAuthenticatedRoute='/dashboard'
            // navigate={(path) => navigate(path, { replace: true })}
            routes={{
                '/login': {},
                '/guard': { auth: true },
                '/guard/order': { auth: false },
                '/guard/order/pickles': { auth: false }
            }}
            // disableRouteGuard
            disableAuth
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Public />} />
                        
                        <Route 
                            path="login" 
                            element={<Login />} 
                        />

                        <Route 
                            path="mexico" 
                            element={
                                <RouteGuard>
                                    <Guard />
                                </RouteGuard>
                            } 
                        />

                        <Route 
                            path="guard" 
                            element={
                                <RouteGuard disabled>
                                    <Guard />
                                </RouteGuard>
                            } 
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </IdentityProvider>
    )
}

export default App;