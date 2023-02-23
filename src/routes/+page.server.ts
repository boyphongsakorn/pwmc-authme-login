import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
// import { customResponse } from '$lib/utils';
// import { userRepository } from '$lib/Redis/dbRepository';
import * as bcrypt from 'bcrypt';
import { dev } from '$app/environment';

export const load: PageServerLoad = async (event) => {
    console.log(event)
    console.log(event.cookies.get('disco_access_token'))
    //pass to $app/stores
    return {
        props: {
            disco_access_token: event.cookies.get('disco_access_token'),
            disco_refresh_token: event.cookies.get('disco_refresh_token'),
        }
    }
}