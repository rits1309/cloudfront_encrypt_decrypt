// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import VideoPlayer from "./playerjs/";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//import _ from "videojs-contrib-quality-levels";
//import qualitySelector from "videojs-hls-quality-selector";
import videojs from "video.js";
//import "./VideoJsPlayer.styles.css"; // styles
import "video.js/dist/video-js.css"; // videoJs Default Styles
import "videojs-contrib-quality-levels"; // videoJs Quality levels **
import "videojs-hls-quality-selector"; 

export default function Home(props) {
  console.log("HOME", props);

  console.log("HOME Toke", props.token);

  const username = props.username;
  const token = props.token;
  const playerRef = useRef(null);
//  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);

  const [videoURL, setvideoURL] = useState(
    "https://d2v0tuuxvuh4w3.cloudfront.net/c61e9598-6610-47ce-b0ec-6030d36f7c1c/hls/1080-video.m3u8"
  );
//  const [player] = useState(undefined);
  const videoJsOptions = {
    autoplay: "muted", //mute audio when page loads, but auto play video
    controls: true,
    responsive: true,
    fluid: true,
    width: 896,
    height: 504,
    token: token,
    sources: [
      {
        src: videoURL,
        type: "application/x-mpegURL",
      },
    ],
  };

  //useEffect(() => {
//  if (player) {
    //  player.hlsQualitySelector({ displayCurrentQuality: true });
  //  }
//  }, [player]);
  const handlePlayerReady = (player) => {
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });

    player.on("playing", () => {
      console.log("player playing");
    });

    playerRef.current = player;
  };

  const handlePlay = (e) => {
    e.preventDefault();
    console.log("New URL is", videoURL);
    playerRef.current.src(videoURL);
  };

  return username && token ? (
    <div className="container">
      <h1 className="title">HLS Player </h1>

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            className="form-custom"
            type="text"
            value={videoURL}
            onChange={(e) => setvideoURL(e.target.value)}
          />
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handlePlay(e)}
          >
            Play
          </Button>
        </Form.Group>
        <Form.Text className="text-muted">
          This need to be a HTTP video type, such as HLS, otherwise change the
          videoJsOptions
        </Form.Text>
      </Form>

      <div className="videoborder">
        <VideoPlayer
          className="video"
          options={videoJsOptions}
          onReady={handlePlayerReady}
        />
      </div>

      <div className="DebugBOX">
        <Table className="DebugTable" variant="dark" responsive="lg">
          <tbody>
            <tr>
              <th width={100}>HLS URL:</th>
              <td>{videoURL}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  ) : (
    <div>No username, or token</div>
  );
}
