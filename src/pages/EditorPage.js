function EditorPage({ user }) {
    return ( <
        div >
        <
        h2 > Editor Page < /h2> <
        p > Welcome, { user.username }! < /p> <
        p > This page is visible to Editors and Admins only. < /p> <
        /div>
    );
}

export default EditorPage;