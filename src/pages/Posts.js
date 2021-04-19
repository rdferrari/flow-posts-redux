import React, { useState } from "react";
import styled from "styled-components";
import List from "../components/List";
import CreatePost from "../components/CreatePost";
import { darkGrey, action } from "../styles/colors";

import { UserStatusContext } from "../App";

const CreateButton = styled.p`
  background-color: ${action};
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  bottom: 20px;
  color: ${darkGrey};
  padding: 10px 20px;
  position: fixed;
  right: 20px;

  @media only screen and (min-width: 768px) {
    bottom: 60px;
    right: 60px;
  }

  @media only screen and (min-width: 1200px) {
    bottom: 100px;
    right: 100px;
`;

function Home({ posts, setPosts }) {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          {showCreatePost ? (
            user !== "no user authenticated" && (
              <>
                <CreatePost posts={posts} setPosts={setPosts} />
              </>
            )
          ) : (
            <List posts={posts} setPosts={setPosts} user={user} />
          )}
          {user !== "no user authenticated" && (
            <CreateButton onClick={() => setShowCreatePost(!showCreatePost)}>
              {showCreatePost ? `Posts List` : "New Post"}
            </CreateButton>
          )}
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Home;
