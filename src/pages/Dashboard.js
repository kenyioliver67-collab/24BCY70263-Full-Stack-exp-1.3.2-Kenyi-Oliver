function Dashboard({ user }) {
    return ( <
        div >
        <
        h2 > Dashboard < /h2> <
        p > Welcome, { user.username }!Your role is: { user.role } < /p> <
        p > This page is visible to any logged - in user. < /p> <
        /div>
    );
}

export default Dashboard;