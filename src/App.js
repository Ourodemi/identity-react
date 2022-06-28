import React from "react";

import { IdentityProvider } from "./package";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Guarded from './tests/Guarded';
import Login from './tests/Login';
import Public from './tests/Public';

function App(){

    return (
        <IdentityProvider 
            url="test-identity.ourodemi.com"
            defaultRouteState={{ auth: false }}
            route={[
                { path: "/login" },
                { path: "/guard", auth: true }
            ]}
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Public />}>
                        <Route index element={<Public />} />
                        <Route path="guarded" element={<Guarded />} />
                        <Route path="login" element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </IdentityProvider>
    )
}

export default App;