import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserStatusContext } from "../App";
import styled from "styled-components";
import { lightGrey } from "../styles/colors";

const HeaderBarContainer = styled.div`
  background-color: #272727;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  margin: 5px 10px;

  @media only screen and (min-width: 768px) {
    margin: 5px 50px;
  }

  @media only screen and (min-width: 1200px) {
    margin: 5px 90px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  margin: 5px 10px;

  @media only screen and (min-width: 768px) {
    margin: 5px 50px;
  }

  @media only screen and (min-width: 1200px) {
    margin: 5px 90px;
`;

const MenuContainer = styled.div`
  background-color: #272727;
  color: #ebebeb;
  height: 100vh;
  left: 0;
  position: fixed;
  text-align: right;
  top: 0;
  width: 100%;
  z-index: 99;
`;

const TextContainer = styled.div`
  float: right;
  margin: 100px 20px;

  @media only screen and (min-width: 768px) {
    margin: 100px 60px;
  }

  @media only screen and (min-width: 1200px) {
    margin: 100px;
`;

const Button = styled.p`
  border-bottom: 2px solid ${lightGrey};
  color: ${lightGrey};
  cursor: pointer;
  font-family: textFontBold;
  font-size: 18px;
  padding: 10px;
  width: 150px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

function Header({ signOut}) {
  const [installPromptEvent, setInstallPromptEvent] = useState();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
  }, []);

  const handleInstallPwa = () => {
    installPromptEvent.prompt();

    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
    });
  };

  const Menu = ({ user }) => {
    return (
      <MenuContainer>
        <TextContainer>
          <Link to="/">
            <Button onClick={() => setShowMenu(!showMenu)}>Home</Button>
          </Link>
          <Link to="/posts">
            <Button onClick={() => setShowMenu(!showMenu)}>Posts</Button>
          </Link>
          {user === "no user authenticated" ? (
            <Link to="/auth">
              <Button onClick={() => setShowMenu(!showMenu)}>Sign in</Button>
            </Link>
          ) : (
            <Button onClick={signOut}>Sign out</Button>
          )}
          {installPromptEvent && (
            <Button onClick={handleInstallPwa}>Install</Button>
          )}
        </TextContainer>
      </MenuContainer>
    );
  };

  return (
    <UserStatusContext.Consumer>
      {(user) => (
        <>
          <HeaderBarContainer>
            <HeaderLeft>
              <Link to="/">
                <img alt="Flowception logo" src="/svg/logo.svg" />
              </Link>
            </HeaderLeft>

            <HeaderRight>
              {showMenu ? (
                <img
                  onClick={() => setShowMenu(!showMenu)}
                  alt="Menu hamburger"
                  src="/svg/close.svg"
                />
              ) : (
                <img
                  onClick={() => setShowMenu(!showMenu)}
                  alt="Menu hamburger"
                  src="/svg/menu.svg"
                />
              )}
            </HeaderRight>
          </HeaderBarContainer>
          {showMenu && <Menu user={user} />}
        </>
      )}
    </UserStatusContext.Consumer>
  );
}

export default Header;
