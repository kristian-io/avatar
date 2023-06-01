import './App.css';
import RouteComponent from './components/Routes';
import RootLayout from './Layout';
import { AuthProvider } from 'react-auth-kit';


export default function App() {




  return (
    <>
      <AuthProvider authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === "https:"}>
        <RootLayout>
          <RouteComponent />
        </RootLayout>
      </AuthProvider>
    </>

  )
}

