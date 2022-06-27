import { IdentityProvider } from "../src";

function App(){

    return (
        <IdentityProvider 
            url="test-identity.ourodemi.com"
            defaultRouteState={{ auth: false }}
            route={[
                { path: "/login" },
                { path: "/guarded", auth: true }
            ]}
        >
            
        </IdentityProvider>
    )
}

export default App;