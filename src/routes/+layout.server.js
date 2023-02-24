export const load = async ({ request, locals, cookies }) => {
    console.log(cookies);
    return {
        session: locals.session
    };
};