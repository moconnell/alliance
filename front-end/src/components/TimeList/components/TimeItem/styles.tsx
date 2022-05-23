import styled from "styled-components";

export const TimeButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px;
  font-size: 0.9em;
  font-weight: bold;
  border: 1px solid #ff3864;
  box-sizing: border-box;
  border-radius: 6px;
  color: #fff;
  margin-bottom: 10px;

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;
