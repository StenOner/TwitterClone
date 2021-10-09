import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import WithAuth from '../hocs/WithAuth'
import useHttpToken from '../hooks/use-http-token'
import Comment from './Comment'

const Comments = ({ profile, tweet, newComment }) => {
    const [comments, setComments] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!tweet?._id) return
        sendRequest({ url: `tweets-comments/tweets/${tweet._id}` }, ({ data }) => {
            setComments(data.tweetComments)
        })
    }, [tweet, sendRequest, setComments])

    useEffect(() => {
        if (!newComment) return
        setComments((prevState) => {
            return [newComment, ...prevState]
        })
    }, [setComments, newComment])

    return (
        <div className='flex flex-col w-full'>
            {comments?.map(comment => (
                <Comment key={uuidv4()} profile={profile} comment={comment} />
            ))}
        </div>
    )
}

export default WithAuth(Comments)
