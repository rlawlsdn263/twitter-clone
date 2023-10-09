import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore"; 
import { ref, uploadString  } from "firebase/storage";
import { dbService, storageService } from 'myFirebase';
import { v4 as uuidv4 } from 'uuid';

import Tweet from 'components/Tweet';

const Home = ({userObj}) => {

  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  // 이미지 파일의 URL을 담아둘 state를 만든다
  const [attachment, setAttachment] = useState(null);

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
      // 사진이 있다면 먼저 올리고, 그 다음에 트윗을 올림(파일 URL을 가진 트윗을 만듦)
      // const docRef = await addDoc(collection(dbService, "tweets"), {
      //   text: tweet,
      //   createdAt: Date.now(),
      //   creatorId: userObj.uid
      // });
      // console.log("Document written with ID: ", docRef.id);
      
      // 파이어베이스 스토리지에 uid/uuid로 경로 설정 - 레퍼런스 생성
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      console.log(response);
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
      // result에 이미지 파일의 URL이 담음
      const { currentTarget: { result } } = finishedEvent;

      // attachment state에 result를 업데이트
      setAttachment(result);
    }

    // readAsDataURL을 사용해 데이터를 얻음
    reader.readAsDataURL(theFile);
  }

  // 이미지를 지워버리는 함수
  const onClearAttachmentClick = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {
          // attachment state에 값이 있으면 이미지 태그를 렌더링함
          attachment && (
            // img의 src에 attachment state를 넣어 이미지를 렌더링함
            // button의 onClick에 onClearAttachmentClick 함수를 넣어 클릭하면 image를 지워버림
            <div>
              <img alt="Thumnail" src={attachment} width='50px' height='50px' />
              <button onClick={onClearAttachmentClick}>Clear</button>
            </div>
          )
        }
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