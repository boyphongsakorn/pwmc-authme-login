export const load = async ({ request, locals, cookies }) => {
    console.log(cookies);
    console.log(request.headers.cookie);
    console.log(request.headers);
    console.log(cookies.get('disco_access_token'));
    return {
        session: locals.session
    };
};