import styled from "styled-components";

export const Container = styled.div`
  width: 710px;
  height: 234px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #3c3d44;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`;

export const TextAndIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

export const Text = styled.span`
  font-family: Inter;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  align-self: flex-end;
  margin-top: auto;
`;
