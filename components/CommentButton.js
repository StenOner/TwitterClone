import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

const CommentButton = ({ profile, comments }) => {
    return (
        <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer rounded-md hover:bg-gray-100'>
            <ChatBubbleLeftIcon className='h-5' />
            <span className='hidden lg:flex'>Comment</span>
        </div>
    )
}

export default CommentButton