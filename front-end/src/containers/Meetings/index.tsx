// import { Navigate } from "react-router-dom";
import MeetingCardList from "../../components/MeetingCardList";
import { useCalendar } from "../../hooks";
import Meeting from "../../types/meeting";
import { useEffect, useState } from "react";
import Calendar from "../../components/Calendar";
import { Container, Content } from "./styles";
import { Flex } from "@chakra-ui/react";

const Meetings = () => {
  const { getMeetings } = useCalendar();
  const [meetings, setMeetings] = useState([] as Meeting[]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    async function loadMeetings() {
      setMeetings(await getMeetings(date) ?? []);
    }

    loadMeetings();
  }, [date, getMeetings]);

  // if (!hasCalendar) return <Navigate to="/" />;

  return (
    <Container>
      <Content>
        <Flex
          h={{ base: "auto", md: "100%" }}
          py={10}
          direction={{ base: "column", md: "row" }}
        >
          <Calendar defaultValue={date} onChange={setDate} />
          <MeetingCardList meetings={meetings} />
        </Flex>
      </Content>
    </Container>
  );
};

export default Meetings;
