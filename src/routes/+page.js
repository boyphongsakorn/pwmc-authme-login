export function load({ params }) {
    console.log(params);
    return {
      post: {
        title: `Title for ${params.slug} goes here`,
        content: `Content for ${params.slug} goes here`
      },
      props: {
            disco_access_token: params.cookies.get('disco_access_token'),
            disco_refresh_token: params.cookies.get('disco_refresh_token'),
            disco_name: null
        }
    };
  }