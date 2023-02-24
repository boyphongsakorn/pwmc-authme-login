export function load({ params }) {
    console.log(params);
    return {
      post: {
        title: `Title for ${params.slug} goes here`,
        content: `Content for ${params.slug} goes here`
      },
      props: {
            disco_access_token: null,
            disco_refresh_token: null,
            disco_name: null
        }
    };
  }