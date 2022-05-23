import { Flex, Link } from "@chakra-ui/react";
import Button from "../Button";

export const Nav = () => {
  return (
    <Flex>
      <Flex position="fixed" top="1rem" right="1rem" align="center">
        {/* Desktop */}
        <Flex display={["none", "none", "flex", "flex"]}>
          <Link href="/">
            <Button aria-label="Home">Home</Button>
          </Link>

          <Link href="/about">
            <Button aria-label="About">About</Button>
          </Link>

          <Link href="/contact">
            <Button aria-label="Contact">Contact</Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
