import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

export async function load({ url, cookies }) { //= {
    //default: async ({ request, cookies }) => {
        // const form = await request.formData();
        // const email = form.get('email');
        // const password = form.get('password');

        // if (!email || !password) return customResponse(400, false, 'Email and Password are required');

        // if (typeof email !== 'string' || typeof password !== 'string')
        //     return customResponse(400, false, 'Enter a valid email and password.');

        // const user = await userRepository.search().where('email').equals(email).return.first();
        // const passwordMatch = user && (await bcrypt.compare(password, user.password));

        // if (!user || !passwordMatch)
        //     return customResponse(400, false, 'You entered the wrong credentials.');
        // cookies.set('session', user.entityId, {
        //     path: '/',
        //     httpOnly: true,
        //     sameSite: 'strict',
        //     secure: !dev,
        //     maxAge: 60 * 60 * 24 * 30
        // });
        // // return customResponse(200, true, 'User loggedIn successfully');
        // throw redirect(307, '/dashboard');
        //get the code from the url
        const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
        const DISCORD_CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
        console.log(url)
        const code = url.searchParams.get('code');
        console.log(code);
        const dataObject = {
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: 'https://bpminecraft.com/api/discordcallback',
            code: code,
            scope: 'identify guilds'
          };

        const requestdis = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(dataObject),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const response = await requestdis.json();

        if (response.error) {
            console.log(response);
            return {
                status: 400,
                body: response
            };
        }

        const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
        const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        console.log('redirect to / with cookies');
        cookies.set('disco_access_token', response.access_token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30
        });
        cookies.set('disco_refresh_token', response.refresh_token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30
        });
        throw redirect(307, '/');
    //}
};