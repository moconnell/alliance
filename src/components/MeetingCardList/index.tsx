import Meeting from "../../types/meeting";
import MeetingCard from "../MeetingCard";
import { Container, MeetingCardContainer, SubText } from "./styles";

interface MeetingCardListProps {
  meetings: Meeting[];
}

const MeetingCardList = ({ meetings }: MeetingCardListProps) => {
  return (
    <Container>
      <MeetingCardContainer>
        {meetings.map((meeting, index) => (
          <MeetingCard key={index + "key"} meeting={meeting} />
        ))}
      </MeetingCardContainer>
      <SubText>Times shown in local time</SubText>
    </Container>
  );
};

export default MeetingCardList;
