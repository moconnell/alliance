import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 200px;
  max-width: 100%;
  flex-direction: column;
`;
export const ProfilePic = styled.img`
  width: 57px;
  height: 57px;
  border-radius: 6px;
`;
export const AddressText = styled.span`
  /* text-sm/lineHeight-5/font-normal */
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  margin-bottom: 2px;
`;
export const Username = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
`;
export const Description = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  margin-top: 8px;
  text-align: left;
`;

export const FlexContainer = styled.div`
  display: flex;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 8px;
`;
