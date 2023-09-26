import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { authService } from 'myFirebase';

const Profile = () => {
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

  return (
    <>
    <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile;