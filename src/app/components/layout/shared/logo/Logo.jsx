import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  overflow: "hidden",
  display: "block",
}));

const Logo = ({company}) => {
 
  return (
    <LinkStyled style={{display:"flex",alignItems:'center'}} href="/">
      <Image src="/images/icons/ICON_DARK.svg" alt="logo" height={20} width={100} priority />
    
    </LinkStyled>
  );
};

export default Logo;
