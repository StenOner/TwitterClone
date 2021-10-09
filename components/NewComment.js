import { useRef } from 'react'
import { PhotographIcon } from '@heroicons/react/outline'
import WithAuth from '../hocs/WithAuth'
import useHttpToken from '../hooks/use-http-token'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const NewComment = ({ profile, tweet, addComment }) => {
    const commentInputRef = useRef()
    const { error, isLoading, sendRequest } = useHttpToken()

    const publishComment = (e) => {
        if (e.key !== 'Enter') return
        const commentBody = {
            tweetID: tweet._id,
            profileID: profile._id,
            content: commentInputRef.current.value,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-comments', body: commentBody }, ({ data }) => {
            commentInputRef.current.value = ''
            addComment(data.tweetComment)
            alert(data.message)
        })
    }

    return (
        <div className='flex w-full items-center'>
            <img src={profile?.picture ? `${IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={36} />
            <input ref={commentInputRef} className='w-full ml-4' placeholder='Tweet your reply' onKeyPress={publishComment} />
            <PhotographIcon className='h-6 ml-auto cursor-pointer' />
        </div>
    )
}

export default WithAuth(NewComment)
