import Meeting from "../../types/meeting";
import {
  DateText,
  CardContainer,
  MeetingDescription,
  Attendee,
} from "./styles";

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard = ({
  meeting: { date, endDate, attendee, description },
}: MeetingCardProps) => (
  <CardContainer>
    <DateText>
      {`${date.toLocaleString({timeStyle: "short"})}-${endDate.toLocaleString({timeStyle: "short"})}`}
    </DateText>
    <Attendee>{attendee}</Attendee>
    <MeetingDescription>{description}</MeetingDescription>
  </CardContainer>
);

export default MeetingCard;
