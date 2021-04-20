import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Storage } from "aws-amplify";
// import { createPost } from "../graphql/mutations";
import { useForm } from "react-hook-form";
import { lightGrey, darkGrey, action } from "../../styles/colors";

import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { addNewPost } from "./postsSlice";

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

export default function CreatePost({ setShowCreatePost, showCreatePost }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [mediaName, setMediaName] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  const [uploading, setUploading] = useState("");
  // const [prevImage, setPreviewImage] = useState("");

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  // const canSave =
  //   [title, text, id, media].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = async (data) => {
    const { title, text } = data;
    // if (canSave) {
    try {
      setAddRequestStatus("pending");
      await Storage.put(mediaName, mediaInfo, {
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setUploading(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      const postInfo = { id: uuid(), title, text, media: mediaName };

      const resultAction = await dispatch(addNewPost(postInfo));
      unwrapResult(resultAction);
      reset({
        title: "",
        text: "",
      });
    } catch (err) {
      console.error("Failed to save the post: ", err);
    } finally {
      setAddRequestStatus("idle");
    }
    // }
  };

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

  return (
    <Section backgroundColor={darkGrey} color={lightGrey}>
      <Button>
        <p onClick={() => setShowCreatePost(!showCreatePost)}>
          Back to posts list
        </p>
      </Button>

      <ContentContainer>
        <TextContainer>
          <div>
            <p>Title</p>

            <InputTile
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
            />

            {errors.title && <p className="error-message">Title is required</p>}
          </div>

          <div>
            <p>Paragraph</p>
            <InputTextArea
              rows={6}
              type="text"
              placeholder="Paragraph"
              {...register("text", { required: true })}
            />

            {errors.text && (
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
      <Button onClick={handleSubmit(onSavePostClicked)}>
        <p>Save post</p>
      </Button>
    </Section>
  );
}
