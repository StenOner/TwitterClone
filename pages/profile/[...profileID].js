import { Suspense, lazy, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import useHttpToken from '@/hooks/use-http-token'
import withAuth from '@/hocs/withAuth'
const ProfileHead = lazy(() => import('@/components/ProfileHead'))
const ProfileBody = lazy(() => import('@/components/ProfileBody'))
const ProfilesModal = lazy(() => import('@/components/ProfilesModal'))

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

const Profile = ({ myProfile }) => {
    const [profile, setProfile] = useState(BASE_PROFILE)
    const [profileFollowers, setProfileFollowers] = useState([])
    const [profileFollowersMapped, setProfileFollowersMapped] = useState([])
    const [profileFollowing, setProfileFollowing] = useState([])
    const [profileFollowingMapped, setProfileFollowingMapped] = useState([])
    const [myProfileFollowing, setMyProfileFollowing] = useState([])
    const [followingModalIsOpen, setFollowingModalIsOpen] = useState(false)
    const [followersModalIsOpen, setFollowersModalIsOpen] = useState(false)
    const { isLoading, error, sendRequest } = useHttpToken()
    const router = useRouter()
    const profileID = router.query.profileID[0] ?? null

    useEffect(() => {
        sendRequest({ url: `profiles/${profileID}` }, ({ data }) => {
            setProfile((prevState) => {
                return {
                    ...prevState,
                    ...data.profile,
                }
            })
        })
        sendRequest({ url: `profiles-followers/${profileID}` }, ({ data }) => {
            setProfileFollowers(data.profileFollowers)
            setProfileFollowersMapped(data.profileFollowers.map((_profile) => {
                return {
                    createdAt: _profile.createdAt,
                    profileInfo: _profile.followerProfileID,
                    state: _profile.state,
                    _id: _profile._id,
                }
            }))
        })
        sendRequest({ url: `profiles-following/${profileID}` }, ({ data }) => {
            setProfileFollowing(data.profileFollowing)
            setProfileFollowingMapped(data.profileFollowing.map((_profile) => {
                return {
                    createdAt: _profile.createdAt,
                    profileInfo: _profile.followingProfileID,
                    state: _profile.state,
                    _id: _profile._id,
                }
            }))
        })
    }, [profileID, sendRequest, setProfile, setProfileFollowers, setProfileFollowersMapped, setProfileFollowing, setProfileFollowingMapped])

    useEffect(() => {
        if (!myProfile._id) return
        sendRequest({ url: `profiles-following/${myProfile._id}` }, ({ data }) => {
            setMyProfileFollowing(data.profileFollowing)
        })
    }, [myProfile, sendRequest, setMyProfileFollowing])

    const followProfileHandler = (followingID) => {
        const followProfileBody = {
            followingProfileID: followingID,
            followerProfileID: myProfile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'profiles-follows', body: followProfileBody }, ({ data }) => {
            if (profile._id === followingID) {
                setProfileFollowers((prevState) => [...prevState, data.profileFollow])
            }
            setMyProfileFollowing((prevState) => [...prevState, data.profileFollow])
        })
    }

    const unfollowProfileHandler = () => {
        const profileFollow = profileFollowers.find(profileFollow => profileFollow.followerProfileID._id === myProfile._id)
        sendRequest({ method: 'DELETE', url: `profiles-follows/${profileFollow._id}` }, ({ data }) => {
            if (profile._id === data.profileFollow.followingProfileID) {
                setProfileFollowers((prevState) => {
                    return prevState.filter(profileFollow => profileFollow.followerProfileID._id !== data.profileFollow.followerProfileID)
                })
            }
            setMyProfileFollowing((prevState) => {
                return prevState.filter(profileFollow => profileFollow.followingProfileID._id !== data.profileFollow.followingProfileID)
            })
        })
    }

    return (
        <>
            {followingModalIsOpen && (
                <Suspense fallback={<Loading />}>
                    <ProfilesModal myProfile={myProfile} title={`${profile.fullName} is following`} isOpen={followingModalIsOpen} closeModal={() => setFollowingModalIsOpen(false)} profiles={profileFollowingMapped} myProfileFollowing={myProfileFollowing} followProfile={followProfileHandler} />
                </Suspense >
            )}
            {followersModalIsOpen && (
                <Suspense fallback={<Loading />}>
                    <ProfilesModal myProfile={myProfile} title={`${profile.fullName} followers`} isOpen={followersModalIsOpen} closeModal={() => setFollowersModalIsOpen(false)} profiles={profileFollowersMapped} myProfileFollowing={myProfileFollowing} followProfile={followProfileHandler} />
                </Suspense>
            )}
            <div className='flex flex-col'>
                <Suspense fallback={<Loading />}>
                    <ProfileHead myProfile={myProfile} profile={profile} setProfile={setProfile} setFollowingModalIsOpen={setFollowingModalIsOpen} setFollowersModalIsOpen={setFollowersModalIsOpen} profileFollowers={profileFollowers} profileFollowing={profileFollowing} followProfile={followProfileHandler} unfollowProfile={unfollowProfileHandler} />
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <ProfileBody myProfile={myProfile} profile={profile} />
                </Suspense>
            </div>
        </>
    )
}

export default withAuth(Profile)

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