import type { Handle } from '@sveltejs/kit'


export const handle: Handle = async ({ event, resolve }) => {
    //console.log(event);
    const session = event.cookies.get('disco_access_token');
    if (session) {
        //console.log('session exists');
        //console.log(session);
        event.locals.session = session;
    }

    return resolve(event);
};