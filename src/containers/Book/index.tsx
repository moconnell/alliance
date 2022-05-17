import {
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Text,
  Tbody,
  Td,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { Fragment, useEffect, useState } from "react";
import Calendar from "../../components/Calendar";
import { useParams } from "react-router-dom";
import { useCalendar } from "../../hooks";
import DaysOfWeek from "../../types/daysOfWeek";
import { tomorrow } from "../../utils/timeUtils";
import ModalComponent from "../../components/Modal";
import LoadingTransaction from "../../components/Modal/components/LoadingTransaction";
import TimeList from "../../components/TimeList";
import { isAvailable } from "../../utils/daysOfWeekUtils";

enum BookingState {
  None,
  Requested,
  InProgress,
  Complete,
}

const Book = () => {
  const { calendarAddress } = useParams();
  const { address, bookMeeting, getProfileAvailability, getAvailableTimes } =
    useCalendar();
  const [selectedDate, setSelectedDate] = useState(tomorrow());
  const [selectedTime, setSelectedTime] = useState<DateTime | undefined>();
  const [durationMinutes] = useState(60);
  const [availableDays, setAvailableDays] = useState(DaysOfWeek.None);
  const [availableTimes, setAvailableTimes] = useState([] as DateTime[]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingState, setBookingState] = useState(BookingState.None);
  const toast = useToast();
  const now = new Date();

  useEffect(() => {
    const loadProfileAvailability = async () => {
      if (!calendarAddress) return;
      const profileAvailability = await getProfileAvailability(calendarAddress);
      if (profileAvailability) {
        const [
          { username, description },
          { availableDays, location, timeZone },
        ] = profileAvailability;
        if (availableDays) setAvailableDays(availableDays);
        if (location) setLocation(location);
        if (timeZone) setTimeZone(timeZone);
        if (username) setUsername(username);
        if (description) setDescription(description);
      }
    };

    loadProfileAvailability();
  }, [calendarAddress, getProfileAvailability]);

  useEffect(() => {
    const loadTimes = async () => {
      if (!calendarAddress) return;
      const availableTimes_ = await getAvailableTimes(
        calendarAddress,
        selectedDate,
        durationMinutes
      );
      if (availableTimes_) {
        setAvailableTimes(availableTimes_);
      }
    };

    loadTimes();
  }, [calendarAddress, selectedDate, durationMinutes, getAvailableTimes]);

  useEffect(() => {
    const doBooking = async () => {
      if (
        bookingState === BookingState.Requested &&
        calendarAddress &&
        selectedTime &&
        durationMinutes
      ) {
        try {
          await bookMeeting(calendarAddress, selectedTime, durationMinutes);
          setBookingState(BookingState.Complete);
        } catch (error) {
          toast({
            id: "booking-error",
            status: "error",
            title: "Booking Error",
            description: String(error),
            duration: 10,
            isClosable: true,
          });
          setBookingState(BookingState.None);
        }
      }
    };

    doBooking();
  }, [
    bookMeeting,
    bookingState,
    calendarAddress,
    selectedTime,
    durationMinutes,
    toast,
  ]);

  function handleCloseModal() {
    setShowModal(false);
  }

  if (!calendarAddress?.length || !durationMinutes)
    return (
      <Container data-testid="container:invalid-url" maxW="container.xl" p={1}>
        <Heading as="h1" color="raid.100" fontFamily="Mirza,serif">
          Hmm...
        </Heading>
        <Text fontFamily="Inter" color="#fff">
          That looks like an invalid link - please check and try again!
        </Text>
      </Container>
    );

  if (address === calendarAddress)
    return (
      <Container
        data-testid="container:invalid-calendar"
        maxW="container.xl"
        p={1}
      >
        <Heading as="h1" color="raid.100" fontFamily="Mirza,serif">
          Hey, that's you!
        </Heading>
        <Text fontFamily="Inter" color="#fff">
          Did you really want to book a meeting with yourself?
        </Text>
      </Container>
    );

  switch (bookingState) {
    case BookingState.Complete:
      return (
        <Container
          data-testid="container:booking-complete"
          maxW="container.xl"
          p={1}
        >
          <Heading as="h1" color="raid.100" fontFamily="Mirza,serif">
            Success!
          </Heading>
          <Text fontFamily="Inter" color="#fff">
            {`Your ${durationMinutes} minute meeting with ${username} is all
              booked for ${selectedTime
                ?.toLocal()
                .toLocaleString({ dateStyle: "full", timeStyle: "short" })}.`}
          </Text>
        </Container>
      );
    default:
      return (
        <Container data-testid="container:book" maxW="container.xl" p={1}>
          <Heading as="h1" color="raid.100" fontFamily="Mirza,serif">
            Book a {durationMinutes} minute meeting
            {username && ` with ${username}`}
            ...
          </Heading>
          <Flex
            h={{ base: "auto", md: "100%" }}
            py={10}
            direction={{ base: "column", md: "row" }}
          >
            {(location || timeZone || description) && (
              <Container data-testid="container:profile" paddingTop="24">
                <Table>
                  <Tbody fontFamily="Inter">
                    {location && (
                      <Tr>
                        <Th border={0} color="gray.500">
                          Location
                        </Th>
                        <Td border={0} color="gray.300" fontSize="sm">
                          {location}
                        </Td>
                      </Tr>
                    )}
                    {timeZone && (
                      <Tr>
                        <Th border={0} color="gray.500">
                          Time-Zone
                        </Th>
                        <Td border={0} color="gray.300" fontSize="sm">
                          {timeZone}
                        </Td>
                      </Tr>
                    )}
                    {description && (
                      <Tr>
                        <Th border={0} color="gray.500">
                          About
                        </Th>
                        <Td border={0} color="gray.300" fontSize="sm">
                          {description}
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Container>
            )}
            <Container p={0}>
              <Calendar
                onChange={setSelectedDate}
                defaultValue={selectedDate}
                tileDisabled={(date) =>
                  date < now || !isAvailable(date, availableDays)
                }
              />
            </Container>
            <Container p={4}>
              <TimeList
                selectedTime={selectedTime}
                onChange={setSelectedTime}
                times={availableTimes}
                duration={durationMinutes}
              />
            </Container>
          </Flex>
          <Container pr={10} maxW="xs">
            <Button
              data-testid="button:book-meeting"
              disabled={
                !selectedDate ||
                !selectedTime ||
                bookingState !== BookingState.None
              }
              onClick={() => setBookingState(BookingState.Requested)}
            >
              Book meeting
            </Button>
          </Container>
          <ModalComponent showModal={showModal} closeModal={handleCloseModal}>
            <LoadingTransaction />
          </ModalComponent>
        </Container>
      );
  }
};

export default Book;
