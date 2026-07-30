import { Link } from "react-router-dom";

function Unauthorized() {
    return ( <
        div >
        <
        h2 > Access Denied < /h2> <
        p > You don 't have permission to view this page.</p> <
        Link to = "/dashboard" > Back to Dashboard < /Link> <
        /div>
    );
}

export default Unauthorized;