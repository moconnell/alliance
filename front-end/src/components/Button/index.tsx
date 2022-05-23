import React from "react";
import { Container, ButtonComponent } from "./styles";

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  disabled?: boolean;
  testId?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
}

const Button = ({
  children,
  disabled,
  title,  
  testId = "button",
  type = "button",
  onClick,
}: ButtonProps) => {
  return (
    <Container aria-disabled={disabled}>
      <ButtonComponent data-testid={testId} disabled={disabled} title={title} onClick={onClick} type={type}>
        {children}
      </ButtonComponent>
    </Container>
  );
};

export default Button;
