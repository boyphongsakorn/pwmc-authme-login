import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions, LayoutServerLoad } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

// export const load: PageServerLoad = async (event) => {
//     console.log(event)
//     console.log(event.cookies.get('disco_access_token'))
//     let disco_name = null
//     if (event.cookies.get('disco_access_token')) {
//         const request = await fetch('https://discord.com/api/users/@me', {
//             headers: {
//                 'Authorization': `Bearer ${event.cookies.get('disco_access_token')}`
//             }
//         })
//         const response = await request.json()
//         //check status
//         if (response.message === '401: Unauthorized') {
//         } else {
//             //get user
//             disco_name = response.username
//         }
//     }
//     //pass to $app/stores
//     return {
//         props: {
//             disco_access_token: event.cookies.get('disco_access_token'),
//             disco_refresh_token: event.cookies.get('disco_refresh_token'),
//             disco_name: disco_name
//         }
//     }
// }

//load for the page
export const load: LayoutServerLoad = async (event) => {
    console.log(event)
    console.log(event.cookies.get('disco_access_token'))
    let disco_name = null
    if (event.cookies.get('disco_access_token')) {
        const request = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${event.cookies.get('disco_access_token')}`
            }
        })
        const response = await request.json()
        //check status
        if (response.message === '401: Unauthorized') {
        } else {
            //get user
            disco_name = response.username
        }
    }
    //pass to $app/stores
    return {
        props: {
            disco_access_token: event.cookies.get('disco_access_token'),
            disco_refresh_token: event.cookies.get('disco_refresh_token'),
            disco_name: disco_name
        }
    }
}

export const prerender = false;