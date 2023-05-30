import { memo, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Comment from './Comment'

const Comments = ({ profile, tweet, newComment }) => {
    const [comments, setComments] = useState([])

    useEffect(() => {
        setComments(tweet.comments)
    }, [tweet, setComments])

    useEffect(() => {
        if (!newComment) return
        setComments((prevState) => [newComment, ...prevState])
    }, [newComment, setComments])

    return (
        <div className='flex flex-col w-full'>
            {comments.map(comment => (
                <Comment key={uuidv4()} profile={profile} comment={comment} />
            ))}
        </div>
    )
}

export default memo(Comments)
