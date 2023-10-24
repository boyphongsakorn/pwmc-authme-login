import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ cookies }) => {
    //console.log(event)
    //console.log(event.cookies.get('disco_access_token'))
    let disco_name = null
    let disco_id = null
    if (cookies.get('disco_access_token')) {
        const request = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${cookies.get('disco_access_token')}`
            }
        })
        const response = await request.json()
        //check status
        if (response.message === '401: Unauthorized') {
        } else {
            //get user
            disco_name = response.username
            disco_id = response.id
        }
        return {
            props: {
                disco_access_token: cookies.get('disco_access_token'),
                disco_refresh_token: cookies.get('disco_refresh_token'),
                disco_name: disco_name,
                disco_id: disco_id
            }
        }
    } else if (cookies.get('mc_username')) {
        return {
            props: {
                disco_access_token: null,
                disco_refresh_token: null,
                disco_name: null,
                disco_id: cookies.get('discord_id') ?? null,
                authmeaccount: cookies.get('mc_username')
            }
        }
    } else {
        return {
            props: {
                disco_access_token: null,
                disco_refresh_token: null,
                disco_name: null,
                disco_id: null
            }
        }
    }
    //pass to $app/stores
}