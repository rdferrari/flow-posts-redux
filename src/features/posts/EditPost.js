import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Storage } from "aws-amplify";
import { useForm } from "react-hook-form";
import { lightGrey, darkGrey, action } from "../../styles/colors";

import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { editPost, selectPostById } from "./postsSlice";

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

const ContentImage = styled.img`
  display: inherit;
  height: 320px;
  margin-top: 50px;
  object-fit: cover;
  position: absolute;
  width: 260px;

  @media only screen and (min-width: 768px) {
    height: 400px;
    width: 630px;
  }

  @media only screen and (min-width: 1200px) {
    width: 500px;
  }
`;

const BoxLine = styled.div`
  border: 1px solid ${lightGrey};
  height: 318px;
  margin: 70px 0 0 20px;
  position: relative;
  width: 260px;

  @media only screen and (min-width: 768px) {
    height: 400px;
    width: 630px;
  }

  @media only screen and (min-width: 1200px) {
    width: 500px;
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

function EditPost({ setPosts, posts, postId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [mediaName, setMediaName] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  const [uploading, setUploading] = useState("");
  const [prevImage, setPreviewImage] = useState("");
  // const [editPost, setEditPost] = useState(false);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const post = useSelector((state) => selectPostById(state, postId));
  console.log(post);

  const dispatch = useDispatch();

  function onChangeFile(e) {
    e.persist();
    if (!e.target.files[0]) return;
    const media = {
      fileInfo: e.target.files[0],
      name: `${uuid()}_${e.target.files[0].name}`,
    };
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setMediaName(media.name);
    setMediaInfo(media.fileInfo);
  }

  async function savePost(data) {
    const { title, text } = data;
    // setSaving(true);
    try {
      // with media to update
      setAddRequestStatus("pending");
      if (mediaName && mediaInfo) {
        await Storage.put(mediaName, mediaInfo, {
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
            setUploading(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        });

        const postDataUpdated = {
          id: postId,
          title,
          text,
          media: mediaName,
        };

        // const resultAction = await dispatch(postUpdated(postDataUpdated));
        // unwrapResult(resultAction);

        dispatch(editPost(postDataUpdated));
      }
      const postDataUpdated = {
        id: postId,
        title,
        text,
      };

      // const resultAction = await dispatch(postUpdated(postDataUpdated));
      // unwrapResult(resultAction);

      dispatch(editPost(postDataUpdated));
    } catch (err) {
      console.log(err);
    } finally {
      setAddRequestStatus("idle");
    }
  }

  if (!post) return <p>Loading</p>;

  return (
    <Section backgroundColor={darkGrey} color={lightGrey} key={post.id}>
      <Link to="/posts">
        <Button>
          <p>Back to posts list</p>
        </Button>
      </Link>
      <ContentContainer>
        <TextContainer>
          <div>
            <p>Title</p>

            <InputTextArea
              type="text"
              placeholder="Title"
              defaultValue={post.title}
              {...register("title", { required: true })}
            />
            {console.log(post.title)}

            {errors.title && <p className="error-message">Title is required</p>}
          </div>

          <div>
            <p>Post</p>

            <InputTextArea
              rows={6}
              type="text"
              placeholder="Post"
              defaultValue={post.text}
              {...register("text", { required: true })}
            />

            {errors.code && (
              <p className="error-message">Paragraph is required</p>
            )}
          </div>
        </TextContainer>
        <div>
          {prevImage ? (
            <ContentImage alt="Uploaded" src={prevImage} />
          ) : (
            <ContentImage alt={post.title} src={post.media} />
          )}
          <BoxLine></BoxLine>
          <input type="file" onChange={onChangeFile} />

          {uploading && <p>{uploading}</p>}
        </div>
      </ContentContainer>
      <Button onClick={handleSubmit(savePost)}>
        <p>Save post</p>
      </Button>
    </Section>
  );
}

export default EditPost;
