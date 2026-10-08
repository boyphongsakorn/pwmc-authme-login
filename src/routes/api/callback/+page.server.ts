import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
    const profileBase64 = url.searchParams.get('profile');

    if (!profileBase64) {
        console.error('No profile parameter found in callback');
        throw redirect(302, '/');
    }

    try {
        // Decode base64 profile data
        const decodedData = Buffer.from(profileBase64, 'base64').toString('utf-8');
        const userData = JSON.parse(decodedData);

        console.log('User data received from SSO:', userData);

        // Set cookies based on the userData
        // Following the existing pattern in discordcallback
        await cookies.set('sso_user_id', userData.id, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        await cookies.set('sso_username', userData.username, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30
        });

        // If the user is redirected from a specific app, you might want to handle it here
        // For now, redirect to home
        throw redirect(302, '/');
    } catch (error) {
        console.error('Failed to decode or parse profile data:', error);
        throw redirect(302, '/');
    }
};
