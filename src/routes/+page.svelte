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
        Card,
        Alert
    } from 'sveltestrap';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Avatar from "svelte-avatar";
    let isOpen = false;

    /**
	 * @param {{ detail: { isOpen: boolean; }; }} event
	 */
    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    let open = false;
    const toggle = () => (open = !open);

    console.log($page);

    //create load
    export let data;
    console.log(data);

    //if url has code refresh page to /
    // if ($page.url.searchParams.get('code')) {
    //     //window.location.href = '/';
    //     goto('/');
    // }

    onMount(async () => {
        if ($page.url.searchParams.get('code')) {
            goto('/', { invalidateAll: true });
        }
    });

    async function getmainserverinto() {
        const response = await fetch('https://api.mcsrvstat.us/2/bpminecraft.com');
        const json = await response.json();
        //console.log(json);
        return json;
    }

    async function getodpserverinto() {
        const response = await fetch('https://api.mcsrvstat.us/2/odp.bpminecraft.com');
        const json = await response.json();
        //console.log(json);
        return json;
    }

    async function getnexttimerun() {
            const response = await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/oneday/allevent');
            const json = await response.json();
            json.sort(function (a, b) {
                return b.event_start - a.event_start;
            });
            //if last event is not waiting
            if (json[0].status != 'waiting' && json[0].status != 'start') {
                //set next event as first event
                let today = new Date();
                //get timeleft from now to 23:30:00
                let timeleft = (new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 30, 0, 0).getTime() - today.getTime()) / 1000;
                //convert to hour minute second
                let hour = Math.floor(timeleft / 3600);
                let minute = Math.floor((timeleft - hour * 3600) / 60);
                let second = Math.floor(timeleft - hour * 3600 - minute * 60);
                // if (istoast == false) {
                //     toast.push('Event ??????????????????????????????????????????????????? ' + hour + ' ????????????????????? ' + minute + ' ???????????? ' + second + ' ??????????????????', {
                //         theme: {
                //             '--toastColor': 'mintcream',
                //             '--toastBackground': 'rgba(255,69,0, 0.8)',
                //             '--toastBarBackground': '#8B0000'
                //         },
                //         duration: 20000
                //     })
                //     istoast = true;
                // }
                return '?????????????????????????????? ' + hour + ' ????????????????????? ' + minute + ' ???????????? ' + second + ' ??????????????????';
            } else {
                return '?????????????????????????????????????????????';
            }
            //console.log(json);
            // return json;
        }
</script>

<Styles />

<Navbar color="dark" dark expand="md">
    <Container sm class="d-flex justify-content-between">
        <NavbarBrand href="/">BP Minecraft Server</NavbarBrand>
        <NavbarToggler on:click={() => (isOpen = !isOpen)} />
        <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav navbar>
            <NavItem>
                <NavLink href="/">????????????????????????</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/chat">????????????????????????</NavLink>
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
                <NavLink on:click={toggle}>????????????????????????????????????????????????????????????</NavLink>
                </NavItem>
                <NavItem>
                    <Button style="background-color: #5865F2;" href="https://discord.com/api/oauth2/authorize?client_id=625822290675892234&redirect_uri=https%3A%2F%2Fbpminecraft.com%2Fapi%2Fdiscordcallback&response_type=code&scope=identify%20guilds">????????????????????????????????? Discord</Button>
                </NavItem>
            {:else}
                <NavItem>
                    <NavLink href="https://bpminecraft.com/profile">????????? {$page.data.props.disco_name}</NavLink>
                </NavItem>
                <NavItem>
                    <Button style="background-color: #5865F2;" href="https://bpminecraft.com/api/discordlogout" rel="external">??????????????????????????????</Button>
                </NavItem>
            {/if}
        </Nav>
        </Collapse>
    </Container>
</Navbar>

<Container fluid style="background-image: url('https://imgul.teamquadb.in.th/images/2023/02/23/Survival_The_End.png');background-position: center center;background-repeat: no-repeat;background-size: cover;height: 500px;">
</Container>
<Container sm>
    <Row>
        <Col>
            {#await getmainserverinto() then test }
                <Card body>
                    <Row>
                        <Col xs="auto">
                            <Avatar name="{test.motd.clean[0]}" src="{test.icon}" />
                        </Col>
                        <Col class="d-flex align-items-center">
                            Just A Normal Server
                        </Col>
                        <Col xs="auto" class="my-auto">
                            {test.players.online}/{test.players.max}
                        </Col>
                        <Col xs="auto" class="my-auto">
                            Online
                        </Col>
                    </Row>
                </Card>
            {/await}
        </Col>
        <Col>
            {#await getnexttimerun() then test }
                <a href="/odp" class="text-decoration-none text-dark">
                    {#if test != "?????????????????????????????????????????????"}
                        
                            <Card body>
                                <Row>
                                    <Col xs="auto">
                                        <Avatar name="One Day Project" src="https://imgul.teamquadb.in.th/images/2023/03/05/image97c2b1afb8011c29.png" />
                                    </Col>
                                    <Col class="d-flex align-items-center">
                                        One Day Project
                                    </Col>
                                    <Col xs="auto" class="my-auto">
                                        ??????{test}
                                    </Col>
                                </Row>
                            </Card>
                        
                    {:else}
                        {#await getodpserverinto() then test }
                            <Card body>
                                <Row>
                                    <Col xs="auto">
                                        <Avatar name="{test.motd.clean[0]}" src="https://imgul.teamquadb.in.th/images/2023/03/05/image97c2b1afb8011c29.png" />
                                    </Col>
                                    <Col class="d-flex align-items-center">
                                        One Day Project
                                    </Col>
                                    <Col xs="auto" class="my-auto">
                                        Event ??????????????????????????? ????????????????????????????????????????????????????????????????????? IP: odp.bpminecraft.com
                                    </Col>
                                    <Col xs="auto" class="my-auto">
                                        {test.players.online}/50
                                    </Col>
                                </Row>
                            </Card>
                        {/await}
                    {/if}
                </a>
            {/await}
        </Col>
    </Row>
</Container>

<Container sm>
    <Row>
        <Col class="d-flex justify-content-center">
            <img src="https://i.imgur.com/NUGzfyS.png" class="rounded-2 w-75 shadow my-2" alt="Log" />
        </Col>
        <Col class="text-center my-auto">
            <a href="https://log.bpminecraft.com" class="text-decoration-none"><h2>Log ???????????????????????????</h2></a>
            <p>?????????????????????????????? Log ??????????????????????????? ?????????????????????????????????/????????? ???????????? ???????????????????????????</p>
        </Col>
    </Row>
</Container>
<Container sm>
    <Row>
        <Col class="text-center my-auto">
            <a href="https://map.bpminecraft.com" class="text-decoration-none"><h2>Map ???????????????????????????</h2></a>
            <p>?????????????????????????????? Map ?????????????????????????????????????????????</p>
        </Col>
        <Col class="d-flex justify-content-center">
            <img src="https://img.gs/fhcphvsghs/quality=low/https://screenshot-xi.vercel.app/api?url=https://map.bpminecraft.com&width=640&height=360" class="rounded-2 w-75 shadow my-2" alt="Map">
        </Col>
    </Row>
</Container>
<Container sm>
    <Row>
        <Col class="d-flex justify-content-center">
            <img src="https://img.gs/fhcphvsghs/quality=low/https://screenshot-xi.vercel.app/api?url=https://bpminecraft.com/chat&width=640&height=360" class="rounded-2 w-75 shadow my-2" alt="Chat">
        </Col>
        <Col class="text-center my-auto">
            <a href="https://bpminecraft.com/chat" class="text-decoration-none"><h2>Chat ???????????????????????????</h2></a>
            <p>???????????? Chat ???????????????????????????????????????????????????????????????</p>
        </Col>
    </Row>
</Container>

<div>
<Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>Minecraft Authme Login</ModalHeader>
    <ModalBody>
      Coming Soon
    </ModalBody>
    <!-- <ModalFooter>
      <Button color="primary" on:click={toggle}>Do Something</Button>
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter> -->
  </Modal>
</div>