import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs  } from "firebase/firestore"; 
import { dbService } from 'myFirebase';

const Home = () => {

  const [tweet, setTweet] = useState('');

  // tweets state에는 DB에 저장된 데이터가 들어온다
  const [tweets, setTweets] = useState([]);

  // 매번 setTweets()가 실행되기 때문에 불필요한 추가가 너무 많이 발생한다.
  // 매번 하는 것보다 한 번만 하는 게 좋다.

  /* 
    const getTweets = async () => {

      // getDocs로 DB에 저장된 트윗을 가져옴
      const dbTweets = await getDocs(collection(dbService, "tweets"));
      
      dbTweets.forEach((doc) => {
        
        // doc 안의 든 트윗들을 배열에 추가해줌
        const tweetObject = {
          // 구조분해할당으로 doc.data()의 모든 걸 풀어서 추가한다
          ...doc.data(),
          id: doc.id
        }
        setTweets(prev => [tweetObject, ...prev])
      });
    } 
  */

  const getTweets = async () => {
    // getDocs로 DB에 저장된 트윗을 가져옴
    const dbTweets = await getDocs(collection(dbService, "tweets"));

    // docs를 map으로 순환해 새로운 배열을 만듦
    const newTweets = dbTweets.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));

    // 만든 배열을 setTweets에 넣음으로 업데이트함
    setTweets(newTweets);
}


  // useEffect 안에서 getTweets()를 실행해 트윗을 가져옴
  useEffect(() => {
    getTweets();
  }, [])

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

      <div>
        {
          tweets.map(tweet => (
            <div key={tweet.id}>
              <h4>{tweet.tweet}</h4>
            </div>  
          ))
        }
      </div>
    </div>
  )
}

export default Home;