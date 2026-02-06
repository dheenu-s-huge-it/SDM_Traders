// Next Imports
import { headers } from "next/headers";

import { Suspense } from "react";
// MUI Imports
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css";

// Component Imports

// HOC Imports

// Config Imports
import { i18n } from "../configs/i18n";

// Util Imports
import { getSystemMode } from "../@core/utils/serverHelpers";

// Style Imports
// import "@/app/globals.css";
import './globals.css'

import Providers from "../app/components/Providers";
// import BlankLayout from '@layouts/BlankLayout'

// Generated Icon CSS Imports
import "../assets/iconify-icons/generated-icons.css";

export const metadata = {
  title: "SDM",
  description: "SDM Flower Market",
};

const RootLayout = async (props) => {
  const params = await props.params;
  
  const { children } = props;

  // const headersList = headers();
  // const pathname = headersList.get("x-next-pathname") || "";

  // console.log(pathname,'pathname');
  

  // Vars
  const systemMode = await getSystemMode();

  return (
    <html
      id="__next"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="\images\icons\favicon.svg" /> 
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="flex is-full min-bs-full flex-auto flex-col" style={{width: "100%"}}>
        <Suspense>
          <InitColorSchemeScript attribute="data" defaultMode={systemMode} />
          <Providers >{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
