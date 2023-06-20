import { Fragment, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GlobeAltIcon, PhotoIcon, UsersIcon } from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid'
import Loading from './Loading'
import useHttpToken from '@/hooks/use-http-token'
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const NewTweet = ({ profile, addTweet }) => {
    const [selectedReplyOption, setSelectedReplyOption] = useState({})
    const [replyOptions, setReplyOptions] = useState([])
    const tweetCommentRef = useRef()
    const fileRef = useRef()
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        sendRequest({ url: 'tweets-reply-options' }, ({ data }) => {
            setReplyOptions(data.tweetReplyOptions)
            setSelectedReplyOption(data.tweetReplyOptions[0])
        })
    }, [sendRequest, setReplyOptions, setSelectedReplyOption])

    const publishTweet = async () => {
        const comment = tweetCommentRef.current.value
        const tweetBody = {
            profileID: profile._id,
            tweetReplyOptionID: selectedReplyOption._id,
            content: comment,
            state: true
        }
        const { data } = await sendRequest({ method: 'POST', url: 'tweets', body: tweetBody })
        const tweet = tweetFromData(data.tweet)
        newTweetMediaContents(tweet.tweetID)
        addTweet(tweet)
        tweetCommentRef.current.value = ''
    }

    const tweetFromData = (tweet) => {
        const files = Array.from(fileRef.current.files)
        const mediaContents = files.map((file) => {
            return {
                content: URL.createObjectURL(file),
                createdAt: Date.now(),
                state: true,
                tweetID: tweet.tweetID._id,
                __v: 0,
                _id: '',
            }
        })
        return {
            ...tweet,
            mediaContents,
        }
    }

    const newTweetMediaContents = (tweetID) => {
        const files = fileRef.current.files
        for (const file of files) {
            const tweetMediaContentBody = {
                tweetID,
                state: true,
            }
            sendRequest({ method: 'POST', url: 'tweets-mediacontents', body: tweetMediaContentBody }, ({ data }) => {
                uploadFile(data.tweetMediacontent._id, file)
            })
        }
    }

    const uploadFile = (tweetMediacontentID, file) => {
        const formData = new FormData()
        formData.append('tweetMediaContentID', tweetMediacontentID)
        formData.append('tweetImage', file, file.name)
        sendRequest({ method: 'PUT', url: 'upload/tweet-image', body: formData, headers: { contentType: 'multipart/form-data' } }, ({ data }) => {
            console.log(data.message)
        })
    }

    return (
        <div className='flex flex-col w-full bg-white rounded-xl px-5 py-3'>
            <span className='font-semibold'>Tweet something</span>
            <hr className='my-2' />
            <div className='flex space-x-4'>
                <Suspense fallback={<Loading />}>
                    <ImageMediaContent
                        src={profile.picture ?? '/images/default_profile_normal.png'}
                        className='rounded-lg max-h-11'
                        alt='Profile image' />
                </Suspense>
                <div className='flex flex-col w-full space-y-1'>
                    <textarea ref={tweetCommentRef} className='w-full pl-2 pr-2 pt-1 pb-1 resize-none' rows={3} placeholder={`What's Happening`} />
                    <input ref={fileRef} type='file' multiple hidden accept={'.png,.jpg,.jpeg,.gif,.webp'} />
                    <div className='flex w-full items-center'>
                        <span className='text-blue-500 items-center cursor-pointer' onClick={() => fileRef.current.click()}>
                            <PhotoIcon className='h-8' />
                        </span>
                        <Menu as='div'>
                            <Menu.Button className='flex items-center space-x-1 cursor-pointer group'>
                                <span className='flex text-blue-500 items-center space-x-1 ml-2 cursor-pointer rounded-md hover:bg-gray-100'>
                                    {selectedReplyOption.content?.toLowerCase() === 'everyone' && (
                                        <GlobeAltIcon className='h-8' />
                                    )}
                                    {selectedReplyOption.content?.toLowerCase() === 'people you follow' && (
                                        <UsersIcon className='h-8' />
                                    )}
                                    <span className='hidden md:flex'>{selectedReplyOption.content} can reply</span>
                                </span>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <Menu.Items className='absolute top-[2.8rem] w-28 text-xs mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:w-56 md:text-base md:top-[3.35rem]'>
                                    <div className='p-1'>
                                        {(replyOptions.map((replyOption) => (
                                            <Menu.Item key={uuidv4()}>
                                                {({ active }) => (
                                                    <div className={`${active ? 'bg-blue-400 text-white' : 'text-gray-600'} group flex rounded-md w-full p-2 cursor-pointer`}>
                                                        <button className='flex items-center space-x-2' onClick={() => setSelectedReplyOption(replyOption)}>
                                                            {replyOption.content.toLowerCase() === 'everyone' && (
                                                                <GlobeAltIcon className='h-8' />
                                                            )}
                                                            {replyOption.content.toLowerCase() === 'people you follow' && (
                                                                <UsersIcon className='h-8' />
                                                            )}
                                                            <span>{replyOption.content}</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        )))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        <span className='hidden text-blue-500 items-center space-x-1 ml-2 cursor-pointer rounded-md hover:bg-gray-100'>
                            <GlobeAltIcon className='h-8' />
                            <span>Everyone can reply</span>
                        </span>
                        <button className='flex space-x-1 items-center ml-auto py-1 px-1 sm:px-2 md:px-6 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={publishTweet}>
                            Tweet
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default NewTweet
