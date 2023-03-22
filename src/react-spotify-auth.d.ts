declare module 'react-spotify-auth' {
    import { ReactNode } from 'react';
  
    export interface SpotifyAuthProps {
      clientID: string;
      redirectUri: string;
      scopes?: string[];
      onAccessToken: (token: string) => void;
      noCookie?: boolean;
      title?: ReactNode;
      className?: string;
      btnClassName?: string;
      children?: ReactNode;
    }
  
    export default function SpotifyAuth(props: SpotifyAuthProps): JSX.Element;
  }
  