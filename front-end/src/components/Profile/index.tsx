import { shortenAddress } from "../../utils/shortenAddress";
import ProfileInfo from "../../types/profileInfo";
import {
  AddressText,
  Container,
  Description,
  FlexContainer,
  TextContainer,
  ProfilePic,
  Username,
} from "./styles";

interface ProfileProps {
  profile: ProfileInfo;
}

const Profile = ({
  profile: { picture, email, username, description },
}: ProfileProps) => (
  <Container>
    <FlexContainer>
      <FlexContainer>
        <ProfilePic src={picture} />
      </FlexContainer>
      <TextContainer>
        <AddressText>{shortenAddress(email)}</AddressText>
        <Username>{username}</Username>
      </TextContainer>
    </FlexContainer>
    <Description>{description}</Description>
  </Container>
);

export default Profile;
