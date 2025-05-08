"use client";

import React, { useState, useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <Box
            component="div"
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 2000,
            }}
        >
            {isVisible &&
                <Fab 
                    onClick={scrollToTop} 
                    sx={{ color: 'white', backgroundColor: '#6ca748', '&:hover': { backgroundColor: '#5a9b3e' } }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            }
        </Box>
    );
}

export default ScrollTop;
