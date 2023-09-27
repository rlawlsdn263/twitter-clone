import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import { dbService } from 'myFirebase';

const Home = () => {

  const [tweet, setTweet] = useState('');

  // 새로고침 방지용 함수
  const onSubmit = async (event) => {
    event.preventDefault();
    
    // addDoc을 사용해 컬렉션을 만들고 그 안에 문서를 추가함
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet,
        createdAt: Date.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet('');
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