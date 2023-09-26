import { useEffect, useState } from 'react';
import { onAuthStateChanged  } from "firebase/auth";
import { authService } from 'myFirebase';
import AppRouter from 'components/Router';

function App() {
  // Firebase init을 위한 state
  const [init, setInit] = useState(false);

  // currentUser만으로는 로그인 상태를 파악하는 게 어렵다.
  // Firebase를 통해 사용자 로그인을 파악하는 건 시간이 걸리는 일이다.
  // 그래서 어플리케이션이 먼저 로드된 다음 사용자 로그인을 파악한다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // onAuthStateChanged를 사용하면 사용자의 로그인 상태를 추적할 수 있다
    onAuthStateChanged(authService, (user) => {
      if(user) {
        // 로그인된 상태
        setIsLoggedIn(true);
      } else {
        // 로그아웃된 상태
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])


  return (
    <>
      { init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..." }
      <footer>&copy; Twitter { new Date().getFullYear() }</footer>
    </>
  );
}

export default App;
