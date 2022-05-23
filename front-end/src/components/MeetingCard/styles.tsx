import styled from "styled-components";

export const CardContainer = styled.div`
  max-width: 200px;
  width: 196px;
  height: 170px;
  max-height: 200px;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  background: #ff3864;
  border: 1px solid #ff3864;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 6px;
`;
export const Attendee = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  overflow: hidden;
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MeetingDescription = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #fff;
`;

export const DateText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-size: 0.9rem;
  line-height: 28px;
  color: #fff;
`;
