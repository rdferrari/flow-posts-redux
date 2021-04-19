import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { lightGrey, darkGrey, action } from "../styles/colors";

import { UserStatusContext } from "../App";

const VideoContainer = styled.div`
  left: 0;
  position: absolute;
  top: 0;
  z-index: 1;
`;
const HeroVideo = styled.video`
  display: inherit;
  height: 95vh;
  object-fit: cover;
  width: 100%;
`;

const Mask = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  height: 95vh;
  position: relative;
  width: 100%;
  z-index: 2;
`;

const TaglineContainer = styled.div`
  color: white;
  left: 20px;
  position: absolute;
  top: 40vh;
  z-index: 3;

  @media only screen and (min-width: 768px) {
    left: 60px;
  }

  @media only screen and (min-width: 1200px) {
    left: 100px;
    top: 30vh;
  }
`;

const Tagline = styled.h1`
  color: ${lightGrey};
  font-size: 30px;

  @media only screen and (min-width: 768px) {
    font-size: 50px;
  }
`;

const Button = styled.p`
  border-bottom: 2px solid ${action};
  color: ${action};
  cursor: pointer;
  font-family: textFontBold;
  font-size: 18px;
  padding: 10px;
  width: 150px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

const Section = styled.div`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -17px;
  padding: 80px 20px;

  @media only screen and (min-width: 768px) {
  }

  @media only screen and (min-width: 1200px) {
  }
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

const ContentVideo = styled.video`
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

const URL =
  "https://flowceptionio8aa338f82a884000915b17c1e6ee133a194519-dev.s3-us-west-2.amazonaws.com/public/";

function Home() {
  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          <VideoContainer>
            <HeroVideo autoPlay loop muted playsInline>
              <source src={`${URL}fire-hero.mp4`} type="video/mp4" /> Your
              browser does not support HTML5 video.{" "}
            </HeroVideo>
          </VideoContainer>
          <Mask></Mask>
          <TaglineContainer>
            <Tagline>
              Impermanent,
              <br /> substanceless
              <br /> unsatisfactory
            </Tagline>
            <Link to="/posts">
              <Button>Explore</Button>
            </Link>
          </TaglineContainer>
          <Section backgroundColor={darkGrey} color={lightGrey}>
            <ContentContainer>
              <TextContainer>
                <Subtitle>
                  Flow + Perception
                  <br /> = Flowception
                </Subtitle>
                <BodyText>
                  This mind-body is arising and passing way, burning like fire.
                  Pleasant or painful experiences, they are unsatisfactory. The
                  former because of its inevitable end; the last do not need an
                  explanation. If it is changing, it is never the same, it is a
                  flow of perceptions, which is the experience of Flowception -
                  impermanent, substanceless and unsatisfactory.
                </BodyText>
              </TextContainer>
              <div>
                <ContentVideo autoPlay loop muted playsInline>
                  <source src={`${URL}inception.mp4`} type="video/mp4" /> Your
                  browser does not support HTML5 video.{" "}
                </ContentVideo>
                <BoxLineVideo></BoxLineVideo>
              </div>
            </ContentContainer>
          </Section>
          <Section backgroundColor={lightGrey} color={darkGrey}>
            <ContentContainer>
              <TextContainer>
                <Subtitle>
                  Open Source
                  <br /> and Open Access
                </Subtitle>
                <BodyText>
                  The Flowception.io source code is Open Source and the content
                  is Open Access. It is a serverless AWS Amplify Progressive Web
                  Application with React JS and TypeScript.
                </BodyText>
              </TextContainer>
              <div>
                <ContentVideo autoPlay loop muted playsInline>
                  <source src={`${URL}inception.mp4`} type="video/mp4" /> Your
                  browser does not support HTML5 video.{" "}
                </ContentVideo>
                <BoxLineVideo></BoxLineVideo>
              </div>
            </ContentContainer>
          </Section>
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Home;
