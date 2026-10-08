import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export async function load({ cookies }) {
    // Clear SSO cookies
    for (const name of ['sso_user_id', 'sso_username', 'sso_avatar', 'sso_provider']) {
        cookies.set(name, '', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 0
        });
    }
    throw redirect(307, '/');
}
