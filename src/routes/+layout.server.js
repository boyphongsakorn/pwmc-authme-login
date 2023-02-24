export const load = async ({ request, locals, cookies }) => {

    return {
        session: locals.session
    };
};