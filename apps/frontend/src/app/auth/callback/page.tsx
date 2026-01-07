'use client';

import { CircularProgress, Box, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppDispatch } from "@/store/hooks";
import { initializeAuth } from "@/store/authSlice";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/api/client";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            // Store tokens
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

            // Initialize auth state
            dispatch(initializeAuth());

            // Redirect to home or dashboard
            router.push('/');
        } else {
            // Handle error or missing tokens
            router.push('/login?error=auth_failed');
        }
    }, [router, searchParams, dispatch]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography>Authenticating...</Typography>
        </Box>
    );
}
