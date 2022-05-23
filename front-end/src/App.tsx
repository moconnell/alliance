import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import Book from "./containers/Book";
import Home from "./containers/Home";
import Header from "./components/Header";
import Preferences from "./containers/Preferences";
import Meetings from "./containers/Meetings";
import ErrorFallback from "./ErrorFallback";
import { Container, Content } from "./styles";
import { useToast } from "@chakra-ui/react";

const App = () => {
  const toast = useToast();

  return (
    <main
      style={{
        background: "#333333",
        width: "vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflowY: "scroll",
      }}
    >
      <Container>
        <Header />
        <Content>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(e) => {
              console.error(e);
              toast({
                title: "Error",
                description: e.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/book" element={<Book />}>
                  <Route path="/book/:calendarAddress" element={<Book />} />
                </Route>
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/profile" element={<Preferences />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </Content>
      </Container>
    </main>
  );
};

export default App;
