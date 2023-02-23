import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

export async function load({ url, cookies }) {
    //clear cookies
    cookies.set('disco_access_token', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev,
        maxAge: 0
    });
    cookies.set('disco_refresh_token', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev,
        maxAge: 0
    });
    cookies.set('disco_name', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev,
        maxAge: 0
    });
    //redirect to main page
    throw redirect(307, '/');
}