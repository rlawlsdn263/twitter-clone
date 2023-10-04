import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore"; 
import { dbService } from 'myFirebase';
import Tweet from 'components/Tweet';

const Home = ({userObj}) => {

  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

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
    // getTweets();
    
    // 파이어베이스 8버전
    // dbService.collection("tweets").onSnapshot((snapshot) => {
    //   const tweetsArray = snapshot.docs.map(doc => (
    //     {
    //       id: doc.id,
    //       ...doc.data()
    //     }
    //   ))
    //   console.log(tweetsArray)
    // })

    // onSnapshot을 활용해 tweets 안의 데이터 변동을 실시간으로 추적하고 반영한다
    const unsubscribe = onSnapshot(collection(dbService, "tweets"), (snapshot) => {
      const tweetsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));

      // tweets state 업데이트
      setTweets(tweetsArray);
    });

    // 클린업 함수로 구독취소
    return () => unsubscribe();
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // addDoc을 사용해 컬렉션을 만들고 그 안에 문서를 추가함
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        // userObj 안의 uid는 고유식별자 번호로 사용자룰 식별할 때 사용할 수 있음
        creatorId: userObj.uid
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
            // 기능 추가 및 업데이트를 위해 트윗 컴포넌트화
            // tweet 객체 안의 creatorId와 userObj의 uid를 비교해 트윗 작성자임을 판단함
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
          ))
        }
      </div>
    </div>
  )
}

export default Home;