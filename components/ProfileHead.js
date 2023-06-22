import { PencilIcon } from '@heroicons/react/24/outline'
import { CheckIcon, Cog6ToothIcon, UserMinusIcon, UserPlusIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import Loading from './Loading'
import useHttpToken from '@/hooks/use-http-token'
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const BASE_PROFILE = {
    _id: '',
    fullName: '',
    picture: '',
    banner: '',
    bio: '',
    birthDate: new Date(),
    createdAt: new Date(),
    state: true,
    userID: {},
}

const ProfileHead = ({ myProfile, profile, setProfile, setFollowingModalIsOpen, setFollowersModalIsOpen, profileFollowers, profileFollowing, followProfile, unfollowProfile }) => {
    const [updatedProfile, setUpdatedProfile] = useState(BASE_PROFILE)
    const fullNameInputRef = useRef()
    const bioTextareaRef = useRef()
    const bannerFileRef = useRef()
    const pictureFileRef = useRef()
    const { error, isLoading, sendRequest } = useHttpToken()
    const router = useRouter()
    const profileID = router.query.profileID[0] ?? null
    const isEditMode = router.query.profileID.includes('edit')
    let biographyTimeout = undefined

    const pushEditRouteHandler = () => {
        router.push(`/profile/${profileID}/edit`, null, { scroll: false, shallow: true })
    }

    const cancelEditModeHandler = () => {
        router.push(`/profile/${profileID}`, null, { scroll: false, shallow: true })
    }

    useEffect(() => {
        setUpdatedProfile(profile)
    }, [profile, setUpdatedProfile])

    useEffect(() => {
        if (isEditMode && myProfile._id !== profile._id) cancelEditModeHandler()
    }, [isEditMode, myProfile._id, profile._id, cancelEditModeHandler])

    const updateFullnameHandler = () => {
        clearTimeout(biographyTimeout)
        biographyTimeout = setTimeout(() => setUpdatedProfile((prevState) => {
            return {
                ...prevState,
                fullName: fullNameInputRef.current.value,
            }
        }), 300)
    }

    const updateBiographyHandler = () => {
        clearTimeout(biographyTimeout)
        biographyTimeout = setTimeout(() => setUpdatedProfile((prevState) => {
            return {
                ...prevState,
                bio: bioTextareaRef.current.value,
            }
        }), 300)
    }

    const updateProfileBannerHandler = () => {
        if (bannerFileRef.current.files.length <= 0) return
        setUpdatedProfile((prevState) => {
            return {
                ...prevState,
                banner: URL.createObjectURL(bannerFileRef.current.files[0]),
            }
        })
    }

    const updateProfilePictureHandler = () => {
        if (pictureFileRef.current.files.length <= 0) return
        setUpdatedProfile((prevState) => {
            return {
                ...prevState,
                picture: URL.createObjectURL(pictureFileRef.current.files[0]),
            }
        })
    }

    const updateProfileHandler = async () => {
        const response = await sendRequest({ method: 'PUT', url: `profiles/${profileID}`, body: updatedProfile })
        if (!response) return
        if (bannerFileRef.current.files.length > 0) uploadFile('BANNER', bannerFileRef.current.files[0])
        if (pictureFileRef.current.files.length > 0) uploadFile('PICTURE', pictureFileRef.current.files[0])
        setProfile(updatedProfile)
        cancelEditModeHandler()
    }

    const uploadFile = (uploadType, file) => {
        let url = ''
        const formData = new FormData()
        formData.append('profileID', profileID)
        switch (uploadType.toUpperCase()) {
            case 'BANNER':
                url = 'upload/profile-banner'
                formData.append('profileBanner', file, file.name)
                break
            case 'PICTURE':
                url = 'upload/profile-picture'
                formData.append('profilePicture', file, file.name)
                break
            default:
                console.log('uploadType not supported!')
                return
        }
        sendRequest({ method: 'PUT', url, body: formData, headers: { contentType: 'multipart/form-data' } }, ({ data }) => {
            console.log(data.message)
        })
    }

    return (
        <>
            <div className='max-h-[7.5rem] sm:max-h-[10rem] md:max-h-[15rem] lg:max-h-[22.5rem]'>
                {(!isEditMode && (
                    <Suspense fallback={<Loading />}>
                        <ImageMediaContent
                            src={profile.banner ?? '/images/default_banner.png'}
                            className='max-h-80 w-full'
                            alt='Profile banner' />
                    </Suspense>
                )) || (isEditMode && (
                    <>
                        <Suspense fallback={<Loading />}>
                            <ImageMediaContent
                                src={updatedProfile.banner ?? '/images/default_banner.png'}
                                className='max-h-80 w-full'
                                alt='Profile banner editing' />
                        </Suspense>
                        <div className='absolute w-12 h-12 p-2 top-2 left-2 rounded-full text-white opacity-80 cursor-pointer hover:bg-white transition-colors duration-200 hover:text-blue-400' onClick={() => bannerFileRef.current.click()}>
                            <PencilIcon className='w-full' />
                        </div>
                        <input ref={bannerFileRef} type='file' multiple={false} accept={'.png,.jpg,.jpeg,.gif,.webp'} hidden onChange={updateProfileBannerHandler} />
                    </>
                ))}
            </div>
            <div className='absolute left-[50%] top-[2.5rem] h-[6rem] w-[6rem] z-10 sm:left-[12%] sm:top-[5rem] sm:h-[6rem] sm:w-[6rem] md:left-[12%] md:top-[9rem] md:h-[7.5rem] md:w-[7.5rem] lg:left-[12%] lg:top-[10rem] lg:h-[10.5rem] lg:w-[10.5rem] xl:left-[10%] xl:top-[10rem]'>
                {(!isEditMode && (
                    <Suspense fallback={<Loading />}>
                        <ImageMediaContent
                            src={profile.picture ?? '/images/default_profile_normal.png'}
                            className='rounded-lg max-h-full w-full relative left-[-42%] sm:left-0'
                            alt='Profile picture editing' />
                    </Suspense>
                )) || (isEditMode && (
                    <>
                        <Suspense fallback={<Loading />}>
                            <ImageMediaContent
                                src={updatedProfile.picture ?? '/images/default_profile_normal.png'}
                                className='rounded-lg max-h-full w-full relative left-[-42%] sm:left-0'
                                alt='Profile picture editing' />
                        </Suspense>
                        <div className='absolute w-10 h-10 p-2 top-2 left-2 rounded-full text-white opacity-80 cursor-pointer hover:bg-white transition-colors duration-200 hover:text-blue-400' onClick={() => pictureFileRef.current.click()}>
                            <PencilIcon className='w-full' />
                        </div>
                        <input ref={pictureFileRef} type='file' multiple={false} accept={'.png,.jpg,.jpeg,.gif,.webp'} hidden onChange={updateProfilePictureHandler} />
                    </>
                ))}
            </div>
            <div className='flex py-2 bg-white rounded-lg w-[85%] self-center min-h-[15rem] sm:mt-[-2.5rem] md:mt-[-3.5rem] lg:mt-[-5rem]'>
                <div className='flex flex-col w-full space-y-2 items-center mt-12 sm:items-start sm:mt-0 sm:mr-10 sm:py-4 sm:ml-36 md:ml-44 lg:ml-[17rem]'>
                    <div className='flex justify-center w-full md:justify-start'>
                        <div className='flex items-center'>
                            {(!isEditMode && (
                                <span className='capitalize font-bold text-lg '>
                                    {profile.fullName}
                                </span>
                            )) || (isEditMode && (
                                <input ref={fullNameInputRef} className='block p-2 w-[17rem] capitalize font-bold text-lg rounded-lg bg-[#f7f7f7] border-gray-300 focus:ring-blue-500 focus:border-blue-500' defaultValue={updatedProfile.fullName} onChange={updateFullnameHandler} />
                            ))}
                            {!isEditMode && (
                                <>
                                    <span className='hidden ml-6 cursor-pointer sm:block' onClick={() => setFollowingModalIsOpen(true)}>
                                        <b>{profileFollowing.length}</b> following
                                    </span>
                                    <span className='hidden ml-6 cursor-pointer sm:block' onClick={() => setFollowersModalIsOpen(true)}>
                                        <b>{profileFollowers.length}</b> followers
                                    </span>
                                </>
                            )}
                        </div>
                        {profile._id !== myProfile._id && (
                            <div className='hidden ml-auto sm:block'>
                                {(!profileFollowers.some(_profile => (_profile.followerProfileID._id ?? _profile.followerProfileID) === myProfile._id) && (
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profile._id)}>
                                        <UserPlusIcon className='h-5' />
                                        <span>Follow</span>
                                    </button>
                                )) || (profileFollowers.some(_profile => (_profile.followerProfileID._id ?? _profile.followerProfileID) === myProfile._id) && (
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-red-400 text-white rounded-sm hover:cursor-pointer hover:bg-red-500 transition-all duration-200' onClick={unfollowProfile}>
                                        <UserMinusIcon className='h-5' />
                                        <span>Unfollow</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {profile._id === myProfile._id && (!router.query.profileID.includes('edit') && (
                            <div className='hidden ml-5 sm:block'>
                                <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={pushEditRouteHandler}>
                                    <Cog6ToothIcon className='h-5' />
                                    <span>Edit</span>
                                </button>
                            </div>
                        )) || (router.query.profileID.includes('edit') && (
                            <div className='flex ml-5 space-x-4'>
                                <div className='hidden sm:block my-auto'>
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={updateProfileHandler}>
                                        <CheckIcon className='h-5' />
                                        <span className='hidden lg:block'>Save</span>
                                    </button>
                                </div>
                                <div className='hidden sm:block my-auto'>
                                    <button className='flex space-x-1 items-center sm:px-2 md:px-8 py-1 bg-red-400 text-white rounded-sm hover:cursor-pointer hover:bg-red-500 transition-all duration-200' onClick={cancelEditModeHandler}>
                                        <XCircleIcon className='h-5' />
                                        <span className='hidden lg:block'>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='hidden sm:flex flex-col w-full px-10 sm:pl-0'>
                        {(!isEditMode && (
                            <span className='text-center text-gray-500 sm:text-left '>
                                {profile.bio}
                            </span>
                        )) || (isEditMode && (
                            <textarea ref={bioTextareaRef} className='block p-2.5 w-full text-gray-900 resize-none rounded-lg bg-[#f7f7f7] border-gray-300 focus:ring-blue-500 focus:border-blue-500' rows={6} defaultValue={updatedProfile.bio} onChange={updateBiographyHandler} />
                        ))}
                    </div>
                    {/* PHONE VIEW */}
                    <div className='flex flex-col w-full sm:hidden'>
                        <div className='flex justify-center space-x-4 w-full'>
                            <span className='cursor-pointer' onClick={() => setFollowingModalIsOpen(true)}>
                                <b>{profileFollowing.length}</b> following
                            </span>
                            <span className='cursor-pointer' onClick={() => setFollowersModalIsOpen(true)}>
                                <b>{profileFollowers.length}</b> followers
                            </span>
                        </div>
                        <div className='flex flex-col w-full px-10 sm:pl-0'>
                            {!isEditMode && (
                                <span className='text-center text-gray-500 sm:text-left '>
                                    {profile.bio}
                                </span>
                            )}
                            {isEditMode && (
                                <textarea className='block p-2.5 w-full text-gray-900 resize-none rounded-lg bg-[#f7f7f7] border-gray-300 focus:ring-blue-500 focus:border-blue-500' rows={6} defaultValue={updatedProfile.bio} />
                            )}
                        </div>
                        {profile._id !== myProfile._id && (
                            <div className='flex m-auto'>
                                {(!profileFollowers.some(_profile => (_profile.followerProfileID._id ?? _profile.followerProfileID) === myProfile._id) && (
                                    <button className='flex space-x-1 items-center px-10 py-2 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={followProfile.bind(null, profile._id)}>
                                        <UserPlusIcon className='h-5' />
                                        <span>Follow</span>
                                    </button>
                                )) || (profileFollowers.some(_profile => (_profile.followerProfileID._id ?? _profile.followerProfileID) === myProfile._id) && (
                                    <button className='flex space-x-1 items-center px-10 py-2 bg-red-400 text-white rounded-md hover:cursor-pointer hover:bg-red-500 transition-all duration-200' onClick={unfollowProfile}>
                                        <UserMinusIcon className='h-5' />
                                        <span>Unfollow</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {profile._id === myProfile._id && (!router.query.profileID.includes('edit') && (
                            <div className='flex mx-auto my-4'>
                                <button className='flex space-x-1 items-center px-10 py-2 bg-blue-400 text-white rounded-md hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={pushEditRouteHandler}>
                                    <Cog6ToothIcon className='h-5' />
                                    <span>Edit</span>
                                </button>
                            </div>
                        )) || (router.query.profileID.includes('edit') && (
                            <div className='flex mx-auto my-4 space-x-4'>
                                <div className='block my-auto'>
                                    <button className='flex space-x-1 items-center px-5 py-2 bg-blue-400 text-white rounded-sm hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' onClick={updateProfileHandler}>
                                        <CheckIcon className='h-5' />
                                        <span>Save</span>
                                    </button>
                                </div>
                                <div className='block my-auto'>
                                    <button className='flex space-x-1 items-center px-5 py-2 bg-red-400 text-white rounded-sm hover:cursor-pointer hover:bg-red-500 transition-all duration-200' onClick={cancelEditModeHandler}>
                                        <XCircleIcon className='h-5' />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileHead