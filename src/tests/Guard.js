import React from "react";
import useIdentity from "../package";

function Guard(){
    const { api } = useIdentity();

    React.useEffect(() => {
        api('/orders').then(({data}) => {
            console.log(data)
        })
    }, [])

    return (
        <div>
            <h1>Guarded!</h1>
        </div>
    );
}

export default Guard;