<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        if ($page.url.searchParams.get('profile')) {
            goto('/', { invalidateAll: true });
        } else {
            goto('/');
        }
    });
</script>

<p>กำลังเข้าสู่ระบบ กรุณารอสักครู่...</p>
