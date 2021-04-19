import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Storage, API } from "aws-amplify";
import { createPost } from "../graphql/mutations";
import { useForm, Controller } from "react-hook-form";
import { lightGrey, darkGrey, action } from "../styles/colors";

import styled from "styled-components";

const Section = styled.div`
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;

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
  margin-top: 50px;
  width: 300px;

  @media only screen and (min-width: 768px) {
    width: 630px;
  }
  @media only screen and (min-width: 1200px) {
    margin-right: 50px;
  }
`;

const InputTile = styled.textarea`
  background-color: ${darkGrey};
  border: 0.5px solid #ebebeb;
  color: ${lightGrey};
  font-family: titleFont;
  font-size: 25px;
  padding: 5px;
  width: 280px;

  @media only screen and (min-width: 768px) {
    font-size: 40px;
    width: 630px;
  }
`;

const InputTextArea = styled.textarea`
  background-color: ${darkGrey};
  border: 0.5px solid #ebebeb;
  color: ${lightGrey};
  font-family: textFontLight;
  font-size: 18px;
  padding: 5px;
  width: 280px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
    width: 630px;
  }
`;

const Button = styled.p`
  color: ${action};
  cursor: pointer;
  font-family: textFontBold;
  font-size: 18px;

  @media only screen and (min-width: 768px) {
    font-size: 22px;
  }
`;

export default function CreatePost({ setPosts, posts }) {
  /* 1. Create local state with useState hook */
  const { control, handleSubmit, errors, reset } = useForm();
  const [mediaName, setMediaName] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  // const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  // const [prevImage, setPreviewImage] = useState("");

  function onChangeFile(e) {
    e.persist();
    if (!e.target.files[0]) return;
    const media = {
      fileInfo: e.target.files[0],
      name: `${uuid()}_${e.target.files[0].name}`,
    };
    // setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setMediaName(media.name);
    setMediaInfo(media.fileInfo);
  }

  async function savePost(data) {
    const { title, text } = data;
    try {
      const postInfo = { id: uuid(), title, text, media: mediaName };
      await Storage.put(mediaName, mediaInfo, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploading(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      const mediaUrl = await Storage.get(mediaName);

      await API.graphql({
        query: createPost,
        variables: { input: postInfo },
        // @ts-ignore
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      console.log(mediaInfo);
      console.log(mediaUrl);
      setPosts([...posts, { ...postInfo, media: mediaUrl }]);
      // setPosts([...posts, postInfo]);
      reset({
        title: "",
        text: "",
      });
    } catch (err) {
      // error
    }
  }

  return (
    <Section backgroundColor={darkGrey} color={lightGrey}>
      <Link to="/posts">
        <Button>
          <p>Back to posts list</p>
        </Button>
      </Link>
      <ContentContainer>
        <TextContainer>
          <div>
            <p>Title</p>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputTile
                  rows={1}
                  onBlur={onBlur}
                  onChange={(value) => onChange(value)}
                  value={value}
                  placeholder="Title"
                />
              )}
              name="title"
              rules={{ required: true }}
              defaultValue=""
            />

            {errors.code && <p className="error-message">Title is required</p>}
          </div>

          <div>
            <p>Paragraph</p>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputTextArea
                  rows={12}
                  onBlur={onBlur}
                  onChange={(value) => onChange(value)}
                  value={value}
                  placeholder="Paragraph"
                />
              )}
              name="text"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors.code && (
              <p className="error-message">Paragraph is required</p>
            )}
          </div>
          <input type="file" onChange={onChangeFile} />
          {/* {prevImage && <img alt="Uploaded" src={prevImage} />} */}
          {uploading && <p>{uploading}</p>}
        </TextContainer>
        <div>
          {/* <ContentImage alt={post.title} src={post.media} />
          <BoxLineVideo></BoxLineVideo> */}
        </div>
      </ContentContainer>
      <Button onClick={handleSubmit(savePost)}>
        <p>Save post</p>
      </Button>
    </Section>
  );
}
