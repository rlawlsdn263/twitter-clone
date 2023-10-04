const Tweet = ({ tweetObj, isOwner }) => {
  return (
    <div>
      <h4>{tweetObj.text}</h4>
      {
        // 트윗의 작성자만 트윗을 삭제, 수정할 수 있음
        isOwner && (
          <>
              <button>Delete Tweet</button>
              <button>Edit Tweet</button>   
          </>
        )
      }
    </div>
  )
}

export default Tweet;