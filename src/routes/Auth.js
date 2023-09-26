import { useState } from 'react';
import { authService } from 'myFirebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const Auth = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (event) => {

    const { target: { name, value } } = event;

    if(name === 'email') {
      setEmail(value);
    } else if(name === 'password') {
      setPassword(value);
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;
      if(newAccount) {
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  }

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  }

  // signInWithPopup은 Promise이기 때문에 async & await가 사용가능
  const onSocialClick = async (event) => {
    // name 속성으로 구분
    const { target: { name } } = event;

    // 써드파티 로그인은 Provider를 제공해야함
    let provider;

    if(name === "google") {
      // 구글 로그인일 때 GoogleAuthProvider 인스턴스 생성
      provider = new GoogleAuthProvider();
    } else if(name === "github") {
      // 깃헙 로그인일 때 GithubAuthProvider 인스턴스 생성
      provider = new GithubAuthProvider();
    }

    const data = await signInWithPopup(authService, provider);
    console.log(data);
  }

  return (
      <div>
        <form onSubmit={onSubmit}>
          <input type='email' name='email' placeholder='Email' required value={email} onChange={onChange}/>
          <input type='password' name='password' placeholder='Password' required value={password} onChange={onChange}/>
          <input type='submit' value={ newAccount ? "Create Account" : "Log In" } />

          { error }
          
        </form>
        <span onClick={toggleAccount}>{ newAccount ? "Sign In"  : "Create Account" }</span>
        <div>

          {/* name 속성 추가 */}
          <button name="google" onClick={onSocialClick}>Continue with Google</button>
          <button name="github" onClick={onSocialClick}>Continue with Github</button>
        </div>
      </div>
    )  
}

export default Auth;