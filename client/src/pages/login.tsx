import { useEffect, useState, useRef } from "react";
import { useLogin } from "@pankod/refine-core";
import { Container, Box } from "@pankod/refine-mui";
import { SpinnerCircular } from 'spinners-react';

// Logo
import { yariga } from "../assets";

import { CredentialResponse } from "../interfaces/google";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();
  
  const [loading, setLoading] = useState(false);

  const GoogleButton = ({handleClick}): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);
    
    const handleClick = () => {setLoading(true)}
    
    if(loading) {
      <SpinnerCircular />
    }

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
              setLoading(false);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []); // you can also add your client id as dependency here

    return <div ref={divRef} />;
  };

  return (
    <Box
      component="div"
      sx={{backgroundColor: '#FCFCFC'}}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img src={yariga} alt="Yariga Logo" />
          </div>
          <Box mt={4}>
            <GoogleButton onClick={handleClick()} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
