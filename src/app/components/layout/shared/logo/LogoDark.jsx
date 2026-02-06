import Link from "next/link";
import { styled,Typography } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  // height: "64px",
  // width: "174px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image style={{marginTop:'10px'}} src="/images/logos/sai_legal_logo.png" alt="logo" height={50} width={130} priority />
    

    </LinkStyled>
  );
};

export default Logo;
