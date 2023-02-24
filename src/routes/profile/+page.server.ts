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
    if (cookies.get('disco_access_token')) {
        const request = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${cookies.get('disco_access_token')}`
            }
        })
        const response = await request.json()
        console.log(response)
        //check status
        if (response.message === '401: Unauthorized') {
        } else {
            //get user
            disco_name = response.username
        }
        return {
            props: {
                disco_access_token: cookies.get('disco_access_token'),
                disco_refresh_token: cookies.get('disco_refresh_token'),
                disco_name: disco_name
            }
        }
    } else {
        return {
            props: {
                disco_access_token: null,
                disco_refresh_token: null,
                disco_name: null
            }
        }
    }
    //pass to $app/stores
}