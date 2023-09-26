import { useState } from 'react';
import { authService } from 'myFirebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const Auth = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event) => {

    const { target: { name, value } } = event;

    if(name === 'email') {
      setEmail(value);
    } else if(name === 'password') {
      setPassword(value);
    }
  }

  // createUserWithEmailAndPassword와 signInWithEmailAndPassword은 Promise를 반환하기 때문에 asyn&await을 사용
  const onSubmit = async (event) => {
    event.preventDefault();

    // async&await은 try... catch와 보통 같이 사용된다
    try {
      let data;
      if(newAccount) {
        // 새로운 계정 생성 + 자동 로그인
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        // 로그인
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
      <div>
        <form onSubmit={onSubmit}>
          <input type='email' name='email' placeholder='Email' required value={email} onChange={onChange}/>
          <input type='password' name='password' placeholder='Password' required value={password} onChange={onChange}/>
          <input type='submit' value={ newAccount ? "Create Account" : "Log In" } />
        </form>
        <div>
          <button>Continue with Google</button>
          <button>Continue with Github</button>
        </div>
      </div>
    )  
}

export default Auth;