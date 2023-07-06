import { HomeIcon, MagnifyingGlassIcon, BookmarkIcon, ChevronDownIcon, UserCircleIcon, UsersIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, Suspense, lazy, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Loading from './Loading'
import useHttpToken from '@/hooks/use-http-token'
import withAuth from '@/hocs/withAuth'
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const Header = ({ myProfile }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
        const refreshToken = localStorage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN)
        if (accessToken && refreshToken) setIsLoggedIn(true)
        else setIsLoggedIn(false)
    }, [setIsLoggedIn])

    const redirectToHandler = (route) => {
        router.push(route)
    }

    const logoutHandler = async () => {
        const refreshToken = localStorage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN)
        await sendRequest({ method: 'POST', url: `auth/logout`, body: { token: refreshToken } }, ({ data }) => {
            localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
            localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN)
            router.push('/login')
        })
    }

    return (
        <nav className='flex justify-between sticky bg-[#fff] bg-opacity-80 top-0 z-[1000] px-6 h-8 md:px-12 md:h-16'>
            <div className='flex'>
                <Link href='/' className='header__link'>
                    <picture className='flex items-center'>
                        <source media='(max-width: 767px)' srcSet='/images/tweeter-small.svg' width={30} />
                        <source media='(min-width: 768px)' srcSet='/images/tweeter.svg' width={120} />
                        <Suspense fallback={<Loading />}>
                            <ImageMediaContent
                                src='/images/tweeter.svg'
                                alt='Tweeter logo' />
                        </Suspense>
                    </picture>
                </Link>
            </div>
            <div className='hidden mt-1 items-center space-x-6 md:flex'>
                <Link href='/' className='header__link group'>
                    <HomeIcon className='nav__image h-4' />
                    <span className='nav__span'>Home</span>
                </Link>
                <Link href='/explore' className='header__link group'>
                    <MagnifyingGlassIcon className='nav__image h-4' />
                    <span className='nav__span'>Explore</span>
                </Link>
                <Link href='/bookmarks' className='header__link group'>
                    <BookmarkIcon className='nav__image h-4' />
                    <span className='nav__span'>Bookmarks</span>
                </Link>
            </div>
            <div className='flex mt-1 space-x-8 md:hidden'>
                <Link href='/' className='header__link group'>
                    <span className='nav__span'>
                        <HomeIcon className='h-4' />
                    </span>
                </Link>
                <Link href='/explore' className='header__link group'>
                    <span className='nav__span'>
                        <MagnifyingGlassIcon className='h-4' />
                    </span>
                </Link>
                <Link href='/bookmarks' className='header__link group'>
                    <span className='nav__span'>
                        <BookmarkIcon className='h-4' />
                    </span>
                </Link>
            </div>
            {!isLoggedIn && (
                <div className='flex items-center'>
                    <Link href='/signin' className='w-full px-2 py-2 bg-blue-400 text-white text-xl font-semibold rounded-full hover:cursor-pointer hover:bg-blue-500 transition-all duration-200'>
                        Make an account!
                    </Link>
                </div>
            )}
            {isLoggedIn && (
                <Menu as='div' className='flex'>
                    <Menu.Button className='flex items-center space-x-1 cursor-pointer group'>
                        <picture className='flex items-center mr-1'>
                            <source media='(max-width: 767px)' srcSet={myProfile.picture ? `${!/(^\/)|(^blob:)|(^https*:\/\/)/g.test(myProfile.picture) ? IMAGE_BASE_URL : ''}${myProfile.picture}` : '/images/default_profile_normal.png'} width={26} />
                            <source media='(min-width: 768px)' srcSet={myProfile.picture ? `${!/(^\/)|(^blob:)|(^https*:\/\/)/g.test(myProfile.picture) ? IMAGE_BASE_URL : ''}${myProfile.picture}` : '/images/default_profile_normal.png'} width={44} />
                            <Suspense fallback={<Loading />}>
                                <ImageMediaContent
                                    src={myProfile.picture ?? '/images/default_profile_normal.png'}
                                    className='rounded-full'
                                    alt='Profile image' />
                            </Suspense>
                        </picture>
                        <span className='hidden md:flex md:font-semibold capitalize md:group-hover:text-[#2F80ED]'>{myProfile.fullName || 'User'}</span>
                        <ChevronDownIcon className='nav__image h-3' />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className='absolute right-[0.1rem] top-[1.4rem] w-28 text-xs mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:w-56 md:text-base md:top-[3.35rem]'>
                            <div className='p-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className={`${active ? 'bg-blue-400 text-white' : 'text-gray-600'} group flex rounded-md w-full p-2 cursor-pointer`}
                                            onClick={redirectToHandler.bind(null, `/profile/${myProfile._id}`)}>
                                            <button className='flex items-center space-x-2'>
                                                <UserCircleIcon className='hidden md:flex md:h-5' />
                                                <span>My Profile</span>
                                            </button>
                                        </div>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className={`${active ? 'bg-blue-400 text-white' : 'text-gray-600'} group flex rounded-md w-full p-2 cursor-pointer`}
                                            onClick={redirectToHandler.bind(null, '/group-chat')}>
                                            <button className='flex items-center space-x-2'>
                                                <UsersIcon className='hidden md:flex md:h-5' />
                                                <span>Group Chat</span>
                                            </button>
                                        </div>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className={`${active ? 'bg-blue-400 text-white' : 'text-gray-600'} group flex rounded-md w-full p-2 cursor-pointer`}
                                            onClick={redirectToHandler.bind(null, '/settings')}>
                                            <button className='flex items-center space-x-2'>
                                                <CogIcon className='hidden md:flex md:h-5' />
                                                <span>Settings</span>
                                            </button>
                                        </div>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className={`${active ? 'bg-red-500 text-white' : 'text-red-500'} group flex rounded-md w-full p-2 cursor-pointer`}
                                            onClick={logoutHandler}>
                                            <button className='flex items-center space-x-2'>
                                                <ArrowLeftOnRectangleIcon className='hidden md:flex md:h-5' />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            )}
        </nav>
    )
}

export default withAuth(Header)
