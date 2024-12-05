/* eslint-disable no-unused-vars */
import Navbar from '@/Layout/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';


const Main = () => {
    return (
        <div className='relative max-w-[1900px] '>
            <Navbar/>
            <Outlet></Outlet>
            
        </div>
    );
};

export default Main;