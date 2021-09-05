import axios from 'axios'
import Link from 'next/link'
import jwtDecode from 'jwt-decode'
import { HomeIcon, SearchIcon, BookmarkIcon, ChevronDownIcon, UserCircleIcon, UsersIcon, CogIcon, LogoutIcon } from '@heroicons/react/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Header = () => {
    const [profile, setProfile] = useState({})
    const router = useRouter()

    useEffect(async () => {
        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
            const { _id } = jwtDecode(token)
            const { data: profileData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}profile-by-user/${_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setProfile(profileData.profile)
        } catch ({ response }) {
            alert(response?.data.message)
        }
    }, [setProfile])

    const redirectTo = (route) => {
        router.push(route)
    }

    const logout = async () => {
        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN)
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}logout`, { token })
            localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
            localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN)
            router.push('/login')
        } catch ({ response }) {
            alert(response.data.message)
        }
    }

    return (
        <nav className='flex justify-between sticky bg-[#fff] bg-opacity-80 top-0 z-[1000] px-6 h-8 md:px-12 md:h-16'>
            <div className='flex'>
                <Link href='/'>
                    <a className='header__link'>
                        <picture className='flex items-center'>
                            <source media='(min-width: 768px)' srcSet='/images/tweeter.svg' width={100} />
                            <img src='/images/tweeter-small.svg' alt='Tweeter logo' width={32} />
                        </picture>
                    </a>
                </Link>
            </div>
            <div className='hidden mt-1 items-center space-x-6 md:flex'>
                <Link href='/'>
                    <a className='header__link group'>
                        <HomeIcon className='nav__image h-4' />
                        <span className='nav__span'>Home</span>
                    </a>
                </Link>
                <Link href='/explore'>
                    <a className='header__link group'>
                        <SearchIcon className='nav__image h-4' />
                        <span className='nav__span'>Explore</span>
                    </a>
                </Link>
                <Link href='/bookmarks'>
                    <a className='header__link group'>
                        <BookmarkIcon className='nav__image h-4' />
                        <span className='nav__span'>Bookmarks</span>
                    </a>
                </Link>
            </div>
            <div className='flex mt-1 space-x-8 md:hidden'>
                <Link href='/'>
                    <a className='header__link group'>
                        <span className='nav__span'>
                            <HomeIcon className='h-4' />
                        </span>
                    </a>
                </Link>
                <Link href='/explore'>
                    <a className='header__link group'>
                        <span className='nav__span'>
                            <SearchIcon className='h-4' />
                        </span>
                    </a>
                </Link>
                <Link href='/bookmarks'>
                    <a className='header__link group'>
                        <span className='nav__span'>
                            <BookmarkIcon className='h-4' />
                        </span>
                    </a>
                </Link>
            </div>
            <Menu as='div' className='flex'>
                <Menu.Button className='flex items-center space-x-1 cursor-pointer group'>
                    <picture className='flex items-center mr-1'>
                        <source media='(min-width: 768px)' srcSet='/images/default_profile_normal.png' width={44} />
                        <img src='/images/default_profile_normal.png' alt='Default profile image' className='rounded-full' width={26} />
                    </picture>
                    <span className='hidden md:flex md:font-semibold capitalize md:group-hover:text-[#2F80ED]'>{profile.fullName || 'User'}</span>
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
                                        onClick={redirectTo.bind(null, `/profile/${profile._id}`)}>
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
                                        onClick={redirectTo.bind(null, '/group-chat')}>
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
                                        onClick={redirectTo.bind(null, '/settings')}>
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
                                        onClick={logout}>
                                        <button className='flex items-center space-x-2'>
                                            <LogoutIcon className='hidden md:flex md:h-5' />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </nav>
    )
}

export default Header
