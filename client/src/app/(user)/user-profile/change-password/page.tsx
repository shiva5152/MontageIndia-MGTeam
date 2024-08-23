"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import instance from '@/utils/axios';
import Swal from 'sweetalert2';

const ChangePassword = ( { params }: { params: { id: string; }; } ) =>
{
    const [ oldPassword, setOldPassword ] = useState( '' );
    const [ newPassword, setNewPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const [ success, setSuccess ] = useState( '' );
    const [ showOldPassword, setShowOldPassword ] = useState( false );
    const [ showNewPassword, setShowNewPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );
    const router = useRouter();

    const togglePasswordVisibility = ( field: string ) =>
    {
        if ( field === 'oldPassword' )
        {
            setShowOldPassword( !showOldPassword );
        } else if ( field === 'newPassword' )
        {
            setShowNewPassword( !showNewPassword );
        } else if ( field === 'confirmPassword' )
        {
            setShowConfirmPassword( !showConfirmPassword );
        }
    };

    const handleChangePassword = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setError( '' );
        setSuccess( '' );

        if ( newPassword !== confirmPassword )
        {
            setError( 'New passwords do not match' );
            return;
        }

        if ( newPassword.length < 8 )
        {
            setError( 'New password must be at least 8 characters long' );
            return;
        }

        try
        {
            const response = await instance.patch(
                '/user/changePassword',
                {
                    id: params.id,
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log( "Password change success:", response );
            setSuccess( 'Password changed successfully. You will be redirected to the profile page soon.' );
            // notifySuccess( "PassWord changed successfully " );
            Swal.fire( {
                icon: 'success',
                title: 'Password changed successfully',
                text: 'You will be redirected to the profile page soon.',
                timer: 2000,
                showConfirmButton: false
            } );
            setTimeout( () =>
            {
                router.push( '/user-profile' );
            }, 5000 );

        } catch ( error: any )
        {
            console.error( 'Password change error:', error );
            setError( error.response?.data?.message || 'An error occurred while changing the password. Please try again.' );

        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div className="flex items-center mb-6 justify-center gap-3 rounded-lg">
                    <div className="w-48 h-14">
                        <img src={ '/images/logo.png' } alt="logo" />
                    </div>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Your Password</h2>
                </div>
                <form className="mt-8 space-y-8" onSubmit={ handleChangePassword }>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <label htmlFor="old-password" className="sr-only">Old Password</label>
                            <input
                                id="old-password"
                                name="oldPassword"
                                type={ showOldPassword ? "text" : "password" }
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="Old Password"
                                value={ oldPassword }
                                onChange={ ( e ) => setOldPassword( e.target.value ) }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={ () => togglePasswordVisibility( 'oldPassword' ) }
                            >
                                { showOldPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                ) }
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="new-password" className="sr-only">New Password</label>
                            <input
                                id="new-password"
                                name="newPassword"
                                type={ showNewPassword ? "text" : "password" }
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={ newPassword }
                                onChange={ ( e ) => setNewPassword( e.target.value ) }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={ () => togglePasswordVisibility( 'newPassword' ) }
                            >
                                { showNewPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                ) }
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={ showConfirmPassword ? "text" : "password" }
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="Confirm New Password"
                                value={ confirmPassword }
                                onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={ () => togglePasswordVisibility( 'confirmPassword' ) }
                            >
                                { showConfirmPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                ) }
                            </button>
                        </div>
                    </div>

                    { error && (
                        <div className="text-red-500 text-sm mt-2">{ error }</div>
                    ) }
                    { success && (
                        <div className="text-green-500 text-sm mt-2">{ success }</div>
                    ) }

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-webgreen hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;