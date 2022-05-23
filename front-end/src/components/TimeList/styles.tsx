import styled from "styled-components";

export const TimeContainer = styled.div`
  width: 200px;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  height: auto;
  overflow-y: auto;
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

export const StyledSubtitle = styled.span`
  font-family: Inter;
  font-style: normal;
  font-size: 0.8em;
  line-height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  margin: 0 0 0.3em 0.3em;
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

export const Container = styled.div`
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  max-height: 400px;
  max-width: 250px;
`;

export const StyledTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  margin: 0 0 1.4em 0;
`;

export const InlineContainer = styled.div`
  margin: 2px 8px 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
