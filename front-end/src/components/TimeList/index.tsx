import TimeItem from "./components/TimeItem";
import {
  Container,
  InlineContainer,
  StyledSubtitle,
  StyledTitle,
  SubText,
  TimeContainer,
} from "./styles";
import { ReactComponent as Clock } from "../../assets/clock.svg";
import { DateTime } from "luxon";

interface TimeListProps {
  times: DateTime[];
  timeZone?: string;
  selectedTime?: DateTime;
  duration?: number;
  onChange?: (time: DateTime) => void;
}

const TimeList = ({
  times,
  timeZone,
  onChange,
  selectedTime,
  duration,
}: TimeListProps) => (
  <Container>
    {times?.length && (
      <>
        <StyledTitle>Select a time</StyledTitle>

        <InlineContainer>
          <InlineContainer>
            <Clock />
          </InlineContainer>

          {duration && <StyledSubtitle>{duration} mins</StyledSubtitle>}
        </InlineContainer>

        <TimeContainer>
          {times.map((value, index) => (
            <TimeItem
              active={value === selectedTime}
              onClick={(e) => {
                e.preventDefault();
                if (onChange) onChange(value);
              }}
              key={index + "key"}
              value={value.setZone(timeZone)}
            />
          ))}
        </TimeContainer>

        <SubText>Times shown in local time</SubText>
      </>
    )}
  </Container>
);

export default TimeList;
