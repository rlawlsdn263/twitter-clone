import { useState } from 'react';
import { doc, deleteDoc, updateDoc  } from "firebase/firestore";
import { dbService, storageService } from 'myFirebase';
import { ref, deleteObject } from 'firebase/storage';

const Tweet = ({ tweetObj, isOwner }) => {

  // editing state는 edit 버튼의 클릭 유무를 관리함 - 에디팅 모드임을 파악함
  const [editing, setEditing] = useState(false);

  // newTweet state는 tweet의 업데이트될 텍스트를 위한 state임
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  // editing state의 상태를 토글링하는 함수
  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    // form 초기화 방지
    event.preventDefault();

    // 트윗 update 함수
    await updateDoc(doc(dbService, "tweets", tweetObj.id), {
      text: newTweet
    });

    // 에디팅 모드 종료
    setEditing(false);
  }

  // newTweet 업데이트 함수
  const onChange = (event) => {
    const {target: { value }} = event;
    setNewTweet(value);
  }

  const onDeleteClick = async () => {
    // confirm은 윈도우 알림창을 띄어주고 해당 값의 true, false 값을 반환한다
    const ok = window.confirm("Are you sure you want to delete this newwet?");
    if(ok) {
      // deleteDoc()을 사용해 tweets 컬렉션 안의 tweetObj.id를 가진 문서를 삭제함
      await deleteDoc(doc(dbService, "tweets", tweetObj.id));

      const parsedUrl = new URL(tweetObj.attachmentURL); //url 파싱
      const urlPath = decodeURIComponent(parsedUrl.pathname.split("/o/")[1]); //url 경로 접근
      const filePath = ref(storageService, urlPath); //파일경로를 가진 ref 생성

      await deleteObject(filePath); //파일삭제
    }
  }

  return (
    <div>
      {
        // 트윗의 작성자만 트윗을 삭제, 수정할 수 있음
        // editing state가 true면 input을 보여주고, false면 Tweet 컴포넌트를 렌더링함
        editing ? (
          <>          
            <form onSubmit={onSubmit}>
              <input 
                type='text' 
                placeholder='Edit your tweet' 
                value={newTweet} 
                required 
                onChange={onChange}  
              />
              <input type="submit" value="Update Tweet" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </>
        ) :
        (
          <>          
            <h4>{tweetObj.text}</h4>
            { tweetObj.attachmentURL && <img alt="이미지" src={tweetObj.attachmentURL} width="50px" height="50px" /> }
            {
              // isOwner가 true면 삭제, 수정 버튼을 렌더링함
              isOwner && (
                <>
                    <button onClick={onDeleteClick}>Delete Tweet</button>
                    <button onClick={toggleEditing}>Edit Tweet</button>   
                </>
              )
            }
          </>
        )
      }
    </div>
  )
}

export default Tweet;