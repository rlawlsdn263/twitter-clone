import { useEffect } from 'react';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { authService, dbService } from 'myFirebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const Profile = ({ userObj }) => {
  // 리디렉션
  let navigate = useNavigate();

  const onLogOutClick = async () => {
    try {
      // 로그아웃 기능
      const data = await signOut(authService);
      console.log(data);
      
      // 홈으로 리디렉션 
      navigate('/');
    } catch(err) {
      console.log(err.message);
    }
  }

  const getMyTweets = async () => {
    const tweetsRef = collection(dbService, "tweets"); //dbService 안의 collection 중 tweets의 경로에 접근
    const q = query(tweetsRef, where("creatorId", "==", userObj.uid)) //tweets 컬렉션 안에서 creatorId 키의 값이 userObj.uid와 동일한 것만 색출
    const querySnapshot = await getDocs(q); //getDocs를 사용해 해당 쿼리 즉, 조건에 맞는 데이터의 스냅샷을 가져옴
    querySnapshot.forEach((doc) => { //forEach문을 사용해 조건에 적합한 데이터 즉, 사용자가 만든 트윗만 호출함
      console.log(doc.data()); //doc.data()로 객체를 하나씩 불러냄
    });
  }

  useEffect(() => {
    getMyTweets();
  }, [])

  return (
    <>
    <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile;