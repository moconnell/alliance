import React from "react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";

interface ModalComponentProps {
  children?: React.ReactNode;
  showModal?: boolean;
  closeModal(): void;
  maxWidth?: string | number;
}

const ModalComponent = ({
  showModal = false,
  closeModal,
  maxWidth = "710px",
  children,
}: ModalComponentProps) => (
  <Modal isOpen={showModal} isCentered onClose={closeModal}>
    <ModalOverlay />
    <ModalContent maxW={maxWidth}>{children}</ModalContent>
  </Modal>
);

export default ModalComponent;
