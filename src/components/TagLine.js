import styled from "styled-components";

const TagContainer = styled.div`
  text-align: center;
  padding: 0 10px;
  margin: 0 auto;
  width: 300px;

  @media only screen and (min-width: 1024px) {
    text-align: left;
    padding: 0;
    width: 400px;
  }
`;

// const LinkA = styled.a`
//   color: #ff00eb;
//   cursor: pointer;
// `;

const Tagline = () => {
  return (
    <TagContainer>
      <h1>Flowception</h1>
      <p>
        This is an AWS Amplify + PWA React TypeScript + custom AWS Cognito
        authentication + GraphQl API + CRUDE + Storage (Upload images)
      </p>
    </TagContainer>
  );
};

export default Tagline;
