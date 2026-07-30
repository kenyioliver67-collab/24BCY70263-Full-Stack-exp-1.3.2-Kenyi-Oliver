function AdminPage({ user }) {
    return ( <
        div >
        <
        h2 > Admin Page < /h2> <
        p > Welcome, { user.username }! < /p> <
        p > This page is visible to Admins only. < /p> < /
        div >
    );
}

export default AdminPage;