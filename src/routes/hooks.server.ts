import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ request, resolve }) => {
    const response = await resolve(request)
    if (response.status === 404) {
        response.status = 307
        response.headers['location'] = '/'
    }
    return response
}