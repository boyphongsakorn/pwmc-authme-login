import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

export async function load({ url, cookies }) {
    //clear cookies
    for (const name of ['disco_access_token', 'disco_refresh_token', 'disco_name', 'mc_username', 'sso_user_id', 'sso_username', 'sso_avatar', 'sso_provider']) {
        cookies.set(name, '', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: !dev,
            maxAge: 0
        });
    }
    //redirect to main page
    throw redirect(307, '/');
}