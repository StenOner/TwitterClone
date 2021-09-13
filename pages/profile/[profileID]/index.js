import jwtDecode from 'jwt-decode'
import { RefreshIcon, UserAddIcon, XIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'
import useHttpToken from '../../../hooks/use-http-token'
import ReactModal from 'react-modal'

const BASE_PROFILE = {
    _id: '',
    fullName: '',
    picture: '',
    banner: '',
    bio: '',
    birthDate: new Date(),
    createdAt: new Date(),
    state: true
}
const PROFILE_IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

ReactModal.defaultStyles.overlay.zIndex = 1000
ReactModal.defaultStyles.overlay.backgroundColor = 'hls(0, 0%, 100%)'

const Profile = ({ profileID }) => {
    const [myProfile, setMyProfile] = useState(BASE_PROFILE)
    const [profile, setProfile] = useState(BASE_PROFILE)
    const [myProfileFollowing, setMyProfileFollowing] = useState([])
    const [profileFollowers, setProfileFollowers] = useState([])
    const [profileFollowing, setProfileFollowing] = useState([])
    const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false)
    const [followersModalIsOpen, setFollowersModalIsOpen] = useState(false)
    const { isLoading, error, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profileID) return
        sendRequest({ url: `profile/${profileID}` }, ({ data }) => {
            setProfile(data.profile)
        })
    }, [profileID, setProfile])

    useEffect(() => {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
        const { _id: userID } = jwtDecode(token)
        sendRequest({ url: `profile-by-user/${userID}` }, ({ data }) => {
            setMyProfile(data.profile)
        })
    }, [setMyProfile])

    useEffect(() => {
        if (!profileID) return
        sendRequest({ url: `profile-followers/${profileID}` }, ({ data }) => {
            setProfileFollowers(data.profileFollowers)
        })
        sendRequest({ url: `profile-following/${profileID}` }, ({ data }) => {
            setProfileFollowing(data.profileFollowing)
        })
    }, [profileID, setProfileFollowers, setProfileFollowing])

    useEffect(() => {
        if (!myProfile._id) return
        sendRequest({ url: `profile-following/${myProfile._id}` }, ({ data }) => {
            setMyProfileFollowing(data.profileFollowing)
        })
    }, [myProfile._id, setMyProfileFollowing])

    const followProfile = (followingID) => {
        sendRequest({ method: 'POST', url: 'profile-follow/new', body: { followingProfileID: followingID, followerProfileID: myProfile._id, state: true } }, ({ data }) => {
            if (profile._id === myProfile._id) {
                setProfileFollowing((prevState) => {
                    return [...prevState, data.profileFollow]
                })
            }
            if (profile._id === followingID) {
                setProfileFollowers((prevState) => {
                    return [...prevState, data.profileFollow]
                })
            }
            alert(data.message)
        })
    }

    return (
        <>
            <ReactModal
                className='absolute flex flex-col items-center w-3/4 p-4 max-h-[50%] overflow-y-auto bg-white rounded-lg'
                isOpen={followingModalIsOpen}
                contentLabel='Modal for following profiles'
                ariaHideApp={false}
            >
                <div className='flex w-full mb-2'>
                    <span className='font-semibold'>
                        {profile.fullName} is following
                    </span>
                    <span className='ml-auto cursor-pointer' onClick={() => setFollowingModalIsOpen(false)}>
                        <XIcon className='h-6' />
                    </span>
                </div>
                <div className='flex flex-col w-full'>
                    {profileFollowing.map(({ followingProfileID }) => (
                        <div key={uuidv4()} className='flex mt-2'>
                            <div className='self-start max-w-[3rem]'>
                                <img src={followingProfileID.picture ? `${PROFILE_IMAGE_BASE_URL}${followingProfileID.picture}` : '/images/default_profile_normal.png'} className='rounded-lg max-h-full relative left-[-42%] sm:left-0' width='100%' />
                            </div>
                            <div className='flex flex-col ml-4 justify-between'>
                                <Link href={`/profile/${followingProfileID._id}`}>
                                    <a className='font-semibold'>
                                        {followingProfileID.fullName}
                                    </a>
                                </Link>
                                <span className='text-xs'>
                                    x followers
                                </span>
                            </div>
                            <div className='ml-auto'>
                                {myProfileFollowing.filter(profile => profile._id === followingProfileID._id).length > 0 && myProfile._id !== followingProfileID._id && (
                                    <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, followingProfileID._id)}>
                                        <UserAddIcon className='h-5' />
                                        <span>Follow</span>
                                    </button>
                                )}
                                {myProfileFollowing.filter(profile => profile._id === followingProfileID._id).length <= 0 && myProfile._id !== followingProfileID._id && (
                                    <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                                        <span>Following</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ReactModal>
            <ReactModal
                className='absolute flex flex-col items-center w-3/4 p-4 max-h-[50%] overflow-y-auto bg-white rounded-lg'
                isOpen={followersModalIsOpen}
                contentLabel='Modal for followers profiles'
                ariaHideApp={false}
            >
                <div className='flex w-full mb-2'>
                    <span className='font-semibold'>
                        {profile.fullName} followers
                    </span>
                    <span className='ml-auto cursor-pointer' onClick={() => setFollowersModalIsOpen(false)}>
                        <XIcon className='h-6' />
                    </span>
                </div>
                <div className='flex flex-col w-full'>
                    {profileFollowers.map(({ followerProfileID }) => (
                        <div key={uuidv4()} className='flex mt-2'>
                            <div className='self-start max-w-[3rem]'>
                                <img src={followerProfileID.picture ? `${PROFILE_IMAGE_BASE_URL}${followerProfileID.picture}` : '/images/default_profile_normal.png'} className='rounded-lg max-h-full relative left-[-42%] sm:left-0' width='100%' />
                            </div>
                            <div className='flex flex-col ml-4 justify-between'>
                                <Link href={`/profile/${followerProfileID._id}`}>
                                    <a className='font-semibold'>
                                        {followerProfileID.fullName}
                                    </a>
                                </Link>
                                <span className='text-xs'>
                                    x followers
                                </span>
                            </div>
                            <div className='ml-auto'>
                                {myProfileFollowing.filter(_profile => _profile._id === followerProfileID._id).length > 0 && myProfile._id !== followerProfileID._id && (
                                    <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, followerProfileID._id)}>
                                        <UserAddIcon className='h-5' />
                                        <span>Follow</span>
                                    </button>
                                )}
                                {myProfileFollowing.filter(_profile => _profile._id === followerProfileID._id).length <= 0 && myProfile._id !== followerProfileID._id && (
                                    <button className='flex space-x-1 items-center px-4 py-[0.125rem] bg-blue-400 text-white text-xs rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                                        <span>Following</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ReactModal>
            <div className='flex flex-col'>
                <div className='max-h-[7.5rem] sm:max-h-[10rem] md:max-h-[15rem] lg:max-h-[22.5rem]'>
                    <img src={profile.banner ? `${PROFILE_IMAGE_BASE_URL}${profile.banner}` : '/images/default_banner.png'} className='max-h-full' width='100%' />
                </div>
                <div className='absolute left-[50%] top-[2.5rem] h-[6rem] w-[6rem] z-10 sm:left-[12%] sm:top-[5rem] sm:h-[6rem] sm:w-[6rem] md:left-[12%] md:top-[9rem] md:h-[7.5rem] md:w-[7.5rem] lg:left-[12%] lg:top-[14rem] lg:h-[10.5rem] lg:w-[10.5rem]'>
                    <img src={profile.picture ? `${PROFILE_IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} className='rounded-lg max-h-full relative left-[-42%] sm:left-0' width='100%' />
                </div>
                <div className='flex py-2 bg-white rounded-lg w-[85%] self-center sm:mt-[-2.5rem] md:mt-[-3.5rem] lg:mt-[-5rem]'>
                    <div className='flex flex-col w-full space-y-2 items-center mt-12 sm:items-start sm:mt-0 sm:mr-10 sm:py-4 sm:ml-36 md:ml-44 lg:ml-[17rem]'>
                        <div className='flex justify-center w-full md:justify-start'>
                            <div className='flex items-center'>
                                <span className='capitalize font-bold text-lg '>
                                    {profile.fullName}
                                </span>
                                <span className='hidden ml-6 cursor-pointer sm:block' onClick={() => setFollowingModalIsOpen(true)}>
                                    <b>{profileFollowing.length}</b> following
                                </span>
                                <span className='hidden ml-6 cursor-pointer sm:block' onClick={() => setFollowersModalIsOpen(true)}>
                                    <b>{profileFollowers.length}</b> followers
                                </span>
                            </div>
                            <div className='hidden ml-auto sm:block'>
                                {myProfileFollowing.filter(_profile => _profile._id === profile._id).length > 0 && myProfile._id !== profile._id && (
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profile._id)}>
                                        <UserAddIcon className='h-5' />
                                        <span>Follow</span>
                                    </button>
                                )}
                                {myProfileFollowing.filter(_profile => _profile._id === profile._id).length <= 0 && myProfile._id !== profile._id && (
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                                        <span>Following</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-evenly px-10 w-full sm:hidden'>
                            <span className='cursor-pointer' onClick={() => setFollowingModalIsOpen(true)}>
                                <b>{profileFollowing.length}</b> following
                            </span>
                            <span className='cursor-pointer' onClick={() => setFollowersModalIsOpen(true)}>
                                <b>{profileFollowers.length}</b> followers
                            </span>
                        </div>
                        <div className='flex px-10 text-center text-gray-500 sm:text-left sm:pl-0'>
                            Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                            Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                            Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                            Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                            Nostrud nisi Lorem non voluptate reprehenderit ex ullamco consequat cillum Lorem fugiat aliqua ut.
                        </div>
                        <div className='flex sm:hidden'>
                            {myProfileFollowing.filter(_profile => _profile._id === profile._id).length > 0 && myProfile._id !== profile._id && (
                                <button className='flex space-x-1 items-center px-10 py-2 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profile._id)}>
                                    <UserAddIcon className='h-5' />
                                    <span>Follow</span>
                                </button>
                            )}
                            {myProfileFollowing.filter(_profile => _profile._id === profile._id).length <= 0 && myProfile._id !== profile._id && (
                                <button className='flex space-x-1 items-center px-10 py-2 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                                    <span>Following</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex self-center mt-4 w-[85%] flex-col sm:flex-row'>
                    <div className='flex flex-col justify-evenly p-4 mr-4 bg-white rounded-lg h-52 w-full sm:w-1/4'>
                        <div>
                            Tweets
                        </div>
                        <div>
                            Tweets & Replies
                        </div>
                        <div>
                            Media
                        </div>
                        <div>
                            Likes
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex space-x-2 text-sm text-gray-400'>
                            <RefreshIcon className='h-5' />
                            <span>{profile.fullName} Retweeted</span>
                        </div>
                        <div className='flex flex-col'>
                            {/** TWEETS */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export async function getStaticProps({ params }) {
    return {
        props: {
            profileID: params.profileID
        },
        revalidate: 10
    }
}