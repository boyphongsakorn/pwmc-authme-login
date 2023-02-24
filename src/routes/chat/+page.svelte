<script>
	// @ts-nocheck
	import {
		Styles,
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem,
		Container,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Button,
		Row,
		Col,
		Card
	} from 'sveltestrap';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Avatar from 'svelte-avatar';
	let isOpen = false;
    let messages = [];
    let messagesinfo = [];
    let users = [];
    let newMessage = '';

	/**
	 * @param {{ detail: { isOpen: boolean; }; }} event
	 */
	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}

	let open = false;
	const toggle = () => (open = !open);

    function sendMessage() {
        messages = [...messages, newMessage];
        newMessage = '';
    }

	console.log($page);

    onMount(async () => {
        await fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/chat/history/")
            .then(response => response.json())
            .then(data => {
                //ascending order data
                data.sort(function (a, b) {
                    return a.rowid - b.rowid;
                });
                //push each data.message to messages
                data.forEach(function (item) {
                    messages = [...messages, item.message];
                    messagesinfo = [...messagesinfo, item.user];
                });
            });
    });

    async function getplayerinfo(i) {
        let rowid = messagesinfo[i];
        const response = await fetch('https://cpsql.pwisetthon.com/user/find/id/'+rowid);
        const json = await response.json();
        //console.log(json);
        return json;
    }

    let innerWidth = 0
    let innerHeight = 0
    
    $: condition = innerWidth*1.33 <= innerHeight
</script>

<Styles />

<svelte:window bind:innerWidth bind:innerHeight />

<Navbar color="dark" dark expand="md">
    <Container sm class="d-flex justify-content-between">
        <NavbarBrand href="/">BP Minecraft Server</NavbarBrand>
        <NavbarToggler on:click={() => (isOpen = !isOpen)} />
        <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav navbar>
            <NavItem>
                <NavLink href="/">หน้าหลัก</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/chat">แชทในเกม</NavLink>
            </NavItem>
        </Nav>
        <Nav class="ms-auto" navbar>
            <!--NavItem>
            <NavLink href="#components/">Components</NavLink>
            </NavItem>
            <NavItem>
            <NavLink href="https://github.com/bestguy/sveltestrap">GitHub</NavLink>
            </NavItem>
            <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Options</DropdownToggle>
            <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
            </Dropdown-->
            {#if $page.data.props.disco_access_token === undefined || $page.data.props.disco_access_token === 'undefined' || $page.data.props.disco_access_token === null}
                <NavItem>
                <NavLink on:click={toggle}>ล็อกอินผ่านรหัสในเกม</NavLink>
                </NavItem>
                <NavItem>
                    <Button style="background-color: #5865F2;" href="https://discord.com/api/oauth2/authorize?client_id=625822290675892234&redirect_uri=https%3A%2F%2Fbpminecraft.com%2Fapi%2Fdiscordcallback&response_type=code&scope=identify%20guilds">ล็อกอินผ่าน Discord</Button>
                </NavItem>
            {:else}
                <NavItem>
                    <NavLink href="https://bpminecraft.com/profile">คุณ {$page.data.props.disco_name}</NavLink>
                </NavItem>
                <NavItem>
                    <Button style="background-color: #5865F2;" href="https://bpminecraft.com/api/discordlogout" rel="external">ออกจากระบบ</Button>
                </NavItem>
            {/if}
        </Nav>
        </Collapse>
    </Container>
</Navbar>

    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-9 h-25">
          <!-- Main chat display -->
          <div class="overflow-scroll overflow-x-auto" style="max-height: {innerHeight-100}px;">
            <!-- <ul class="list-unstyled"> -->
              {#each messages as message, i}
                <Card body>
                    <div class="d-inline">
                        {#await getplayerinfo(i) then test }
                            <img src="https://crafatar.com/renders/head/{test.uuid}" class="rounded-circle" width="30" height="30" />
                            {test.user} :
                        {/await}
                        {message}
                    </div>
                </Card>
                <!-- {message}<br> -->
              {/each}
            <!-- </ul> -->
          </div>
          <!-- Chat input form -->
          <form on:submit|preventDefault={sendMessage}>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Enter message..." bind:value={newMessage} />
              <div class="input-group-append">
                <button type="submit" class="btn btn-primary">Send</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-12 col-md-3 h-100">
          <!-- User list -->
          <div class="user-list h-100">
            <h5>Online Users:</h5>
            <ul class="list-unstyled">
              {#each users as user}
                <li>{user}</li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>