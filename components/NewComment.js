import { Suspense, lazy, useRef } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import Loading from './Loading'
import useHttpToken from '@/hooks/use-http-token'
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const NewComment = ({ profile, tweet, addComment }) => {
    const commentInputRef = useRef()
    const fileRef = useRef()
    const { error, isLoading, sendRequest } = useHttpToken()

    const publishComment = (e) => {
        if (e.key !== 'Enter') return
        const commentBody = {
            tweetID: tweet.tweetID,
            profileID: profile._id,
            content: commentInputRef.current.value,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-comments', body: commentBody }, ({ data }) => {
            commentInputRef.current.value = ''
            newCommentMediaContents(data.tweetComment._id)
            addComment(data.tweetComment)
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
            <Suspense fallback={<Loading />}>
                <ImageMediaContent
                    src={profile.picture ?? '/images/default_profile_normal.png'}
                    className='rounded-lg max-h-11'
                    alt='Profile image' />
            </Suspense>
            <input ref={commentInputRef} className='w-full ml-4 pl-2 pr-2 pt-1 pb-1' placeholder='Tweet your reply' onKeyUp={publishComment} />
            <input ref={fileRef} type='file' multiple={true} accept={'.png,.jpg,.jpeg,.gif'} hidden={true} />
            <PhotoIcon className='h-6 ml-1 cursor-pointer' onClick={() => fileRef.current.click()} />
        </div>
    )
}

export default NewComment
