import React from "react";

import { IdentityProvider } from "./package";

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
            // navigate={(path) => navigate(path, { replace: true })}
            routes={[
                { path: "/login", },
                { path: "/guard", auth: true }
            ]}
            disableRouteGuard
            disableAuth
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Public />} />
                        <Route path="guard" element={<Guard />} />
                        <Route path="login" element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </IdentityProvider>
    )
}

export default App;