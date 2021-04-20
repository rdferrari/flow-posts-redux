import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { darkGrey } from "../styles/colors";

import { UserStatusContext } from "../App";
// import EditPost from "../components/EditPost";
import EditPost from "../features/posts/EditPost";

const PostContainer = styled.div`
  background-color: ${darkGrey};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Post() {
  let { id } = useParams();

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <PostContainer>
          {user !== "no user authenticated" && (
            // <EditPost posts={posts} setPosts={setPosts} postId={id} />
            <EditPost postId={id} />
          )}
        </PostContainer>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Post;
