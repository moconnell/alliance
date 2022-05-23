import styled from "styled-components";

export const MeetingCardContainer = styled.div`
  width: auto;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-color: #ff3864 transparent;
  padding: 0 10px 0 10px;

  // For Google Chrome
  &::-webkit-scrollbar {
    border: 1px solid #ff3864;
    border-radius: 26px;
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff3864;
    border-radius: 26px;
    padding: 0.5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  // For Internet Explorer
  & {
    scrollbar-face-color: #ff3864;
    scrollbar-track-color: transparent;
  }

  &::-moz-scrollbar {
    -moz-border: 1px solid #ff3864;
    border: 1px solid #ff3864;
    border-radius: 26px;
    width: 5px;
  }
  /* Track */

  &::-moz-scrollbar-track {
    background: transparent;
    border: 1px solid #ff3864;
    border-radius: 26px;
  }
  /* Handle */

  &::-moz-scrollbar-thumb {
    background: #ff3864;
    padding: 0.5px;
  }
`;

export const Container = styled.div`
padding: 15px 0;
display: flex;
flex-direction: column;
align-items: center;
height: 400px;
max-height: 400px;
max-width: 250px;
`;

export const SubText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-size: 0.8em;
  line-height: 1em;
  display: flex;
  align-items: center;
  color: #ffffff;
  margin: 1.1em 0 0 0;
`;
