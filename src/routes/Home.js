import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore"; 
import { dbService } from 'myFirebase';
import Tweet from 'components/Tweet';

const Home = ({userObj}) => {

  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  /* const getTweets = async () => {
    // getDocs로 DB에 저장된 트윗을 가져옴
    const dbTweets = await getDocs(collection(dbService, "tweets"));

    const newTweets = dbTweets.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));

    setTweets(newTweets);
  } */

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(dbService, "tweets"), (snapshot) => {
      const tweetsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));

      setTweets(tweetsArray);
    });

    return () => unsubscribe();
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
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

  const onFileChange = (event) => {
    // event.target.files로 업로드된 이미지 파일에 접근함
    const { target: { files } } = event;

    // files는 배열이고 그것의 0번째 인덱스에 업로드된 이미지가 담긴다
    const theFile = files[0];
    
    // FileReader API를 사용해 FileReader 인스턴스 생성
    const reader = new FileReader();

    // FileReader 인스턴스한테 onloadend 이벤트 리스너를 추가해
    // 파일 로딩이 끝날 경우 finishedEvent 객체가 생성된다
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
    }

    // readAsDataURL을 사용해 데이터를 얻는다
    reader.readAsDataURL(theFile);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
      </form>

      <div>
        {
          tweets.map(tweet => (
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
          ))
        }
      </div>
    </div>
  )
}

export default Home;