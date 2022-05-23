import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled.div`
  height: 100%;
  width: 100%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Main = styled.div`
  width: 36%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 60px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
`;

export const DescriptionText = styled.p`
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #c4c4c4;
  text-align: center;
  margin-bottom: 33px;
`;
