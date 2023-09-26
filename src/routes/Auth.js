import { useState } from 'react';

const Auth = () => {

  // 이메일과 비밀번호를 저장할 state를 생성
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // input 안의 들어갈 onChange 이벤트
  // event.target의 name을 통해 어느 state에 값을 저장할지 결정
  const onChange = (event) => {
    // const name = event.target.name;
    // const value = event.target.value;
    // const { name, value } = event.target;
    // 구조분해할당으로 event.target.name과 event.target.value를 풀어서 변수에 각각 할당함
    const { target: { name, value } } = event;

    console.log(name, value);
    if(name === 'email') {
      setEmail(value);
    } else if(name === 'password') {
      setPassword(value);
    }
  }

  // form의 onSubmit 이벤트로 주어지는 함수
  // form으로 인한 새로고침을 방지하기 위한 함수
  const onSubmit = (event) => {
    event.preventDefault();
  }

  return (
      <div>
        <form onSubmit={onSubmit}>
          <input type='text' name='email' placeholder='Email' required value={email} onChange={onChange}/>
          <input type='password' name='password' placeholder='Password' required value={password} onChange={onChange}/>
          <input type='submit' value="Log In" />
        </form>
        <div>
          <button>Continue with Google</button>
          <button>Continue with Github</button>
        </div>
      </div>
    )  
}

export default Auth;