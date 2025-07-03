import React from 'react';
import './UserInfo.css'
import { FaPhoneAlt } from 'react-icons/fa';

const UserInfo = ({ user }) => {
    const isAdmin = user.role === 'admin';
    const isPLMNAdmin = user.role === 'plmn_admin';

    return (
        <div className='userInfo-container'>
            <div className='userInfo-phonenumber'>
                <FaPhoneAlt style={{marginRight: '8px', color: '#00e6e'}}/>
                <span>{user.phone_number}</span>
            </div>
            <div style={{
                fontWeight: isAdmin ? 'bold' : 'normal',
                color: isAdmin ? 'var(--color-primary)' : '#aaa'
            }} className='userInfo-role'>
                {isAdmin && (
                    <span className='userInfo-admin'/> 
                )}
                {user.role?.toUpperCase()} {isPLMNAdmin && (user.plmn)}
            </div>
        </div>
    )
};

export default UserInfo; 