import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { lightGrey, darkGrey } from "../../styles/colors";

import { selectAllPosts, fetchPosts } from "./postsSlice";

const Section = styled.div`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -17px;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    width: 630px;
  }

  @media only screen and (min-width: 1200px) {
    flex-direction: row;
    justify-content: space-around;
    padding: 0 80px;
    width: 1100px;
  }
`;

const TextContainer = styled.div`
  @media only screen and (min-width: 768px) {
    width: 630px;
  }
  @media only screen and (min-width: 1200px) {
    margin-right: 50px;
  }
`;

const ContentImage = styled.img`
  display: inherit;
  height: 320px;
  margin-top: 50px;
  object-fit: cover;
  position: absolute;
  width: 85%;

  @media only screen and (min-width: 768px) {
    height: 400px;
    width: 630px;
  }

  @media only screen and (min-width: 1200px) {
    width: 500px;
  }
`;

const BoxLineVideo = styled.video`
  border: 1px solid ${lightGrey};
  height: 318px;
  margin: 70px 0 0 20px;
  position: relative;
  width: 95%;

  @media only screen and (min-width: 768px) {
    height: 400px;
    width: 630px;
  }

  @media only screen and (min-width: 1200px) {
    width: 500px;
  }
`;

const Subtitle = styled.h2`
  font-size: 25px;

  @media only screen and (min-width: 768px) {
    font-size: 40px;
  }
`;

const BodyText = styled.p`
  font-size: 18px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

const BtContainer = styled.div`
  display: flex;
`;

const Bt = styled.p`
  cursor: pointer;
  font-family: textFontRegular;
  font-size: 18px;
  margin-right: 20px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

const PostExcerpt = ({ post, user }) => {
  return (
    <Section backgroundColor={darkGrey} color={lightGrey} key={post.id}>
      <ContentContainer>
        <TextContainer>
          <Subtitle>{post.title}</Subtitle>

          <BodyText>{post.text}</BodyText>
          {user !== "no user authenticated" && (
            <BtContainer>
              <Link to={`/post/${post.id}`}>
                <Bt>| Edit |</Bt>
              </Link>
              {/* <Bt onClick={() => removePost(post.id, post.media)}>
                | delete |
              </Bt> */}
            </BtContainer>
          )}
        </TextContainer>
        <div>
          <ContentImage alt={post.title} src={post.media} />
          <BoxLineVideo></BoxLineVideo>
        </div>
      </ContentContainer>
    </Section>
  );
};

export const PostsList = ({ user }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === "loading") {
    content = <div className="loader">Loading...</div>;
  } else if (postStatus === "succeeded") {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} user={user} />
    ));
  } else if (postStatus === "error") {
    content = <div>{error}</div>;
  }

  return <section>{content}</section>;
};
