import { useState } from 'react';

const Home = () => {

  const [tweet, setTweet] = useState('');

  // 새로고침 방지용 함수
  const onSubmit = (event) => {
    event.preventDefault();
  }

  // state와 연동된 onChange 핸들러
  const onChange = (event) => {
    const { target: { value } } = event;

    setTweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="Tweet" />
      </form>
    </div>
  )
}

export default Home;