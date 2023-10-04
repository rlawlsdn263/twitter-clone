import { useEffect, useState } from 'react';
import { onAuthStateChanged  } from "firebase/auth";
import { authService } from 'myFirebase';
import AppRouter from 'components/Router';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 사용자를 기록하기 위한 state
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 사용자가 로그인하면 onAuthStateChanged가 실행된다
    onAuthStateChanged(authService, (user) => {
      if(user) {
        setIsLoggedIn(true);
        
        // 사용자가 로그인이 됐다면 userObj state에 user 정보를 넣음
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])


  return (
    <>
      { 
        // userObj를 AppRouter에 prop으로 전달함
        init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..." 
      }
      {/* <footer>&copy; Twitter { new Date().getFullYear() }</footer> */}
    </>
  );
}

export default App;
