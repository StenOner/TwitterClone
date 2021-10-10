import { useRef } from 'react'
import { PhotographIcon } from '@heroicons/react/outline'
import WithAuth from '../hocs/WithAuth'
import useHttpToken from '../hooks/use-http-token'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const NewComment = ({ profile, tweet, addComment }) => {
    const commentInputRef = useRef()
    const fileRef = useRef()
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
            newCommentMediaContents(data.tweetComment._id)
            addComment(data.tweetComment)
            alert(data.message)
        })
    }

    const newCommentMediaContents = (tweetCommentID) => {
        const files = fileRef.current.files
        for (const file of files) {
            const tweetCommentMediaContentBody = {
                tweetCommentID,
                state: true,
            }
            sendRequest({ method: 'POST', url: 'tweets-comments-mediacontents', body: tweetCommentMediaContentBody }, ({ data }) => {
                uploadFile(data.tweetCommentMediacontent._id, file)
            })
        }
    }

    const uploadFile = (tweetCommentMediaContentID, file) => {
        const formData = new FormData()
        formData.append('tweetCommentMediaContentID', tweetCommentMediaContentID)
        formData.append('commentImage', file, file.name)
        sendRequest({ method: 'PUT', url: 'upload/comment-image', body: formData, headers: { contentType: 'multipart/form-data' } }, ({ data }) => {
            console.log(data.message)
        })
    }

    return (
        <div className='flex w-full items-center'>
            <img src={profile?.picture ? `${IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={36} />
            <input ref={commentInputRef} className='w-full ml-4' placeholder='Tweet your reply' onKeyPress={publishComment} />
            <input ref={fileRef} type='file' multiple={true} accept={'.png,.jpg,.jpeg,.gif'} hidden={true} />
            <PhotographIcon className='h-6 ml-auto cursor-pointer' onClick={() => fileRef.current.click()} />
        </div>
    )
}

export default WithAuth(NewComment)
