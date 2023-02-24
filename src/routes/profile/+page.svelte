<script>
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
        Form,
        FormGroup,
        Input,
        Alert,
        CardBody,
        Card,
        Row,
        Col,
        CardHeader,
        CardTitle,
        CardSubtitle,
        CardText,
        CardFooter
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

    let linkmcsuccess = null;
    let minecraftname = null;
    let minecraftuuid = null;

    onMount(async () => {
        if ($page.data.props.disco_access_token === undefined || $page.data.props.disco_access_token === 'undefined' || $page.data.props.disco_access_token === null) {
            goto('/', { invalidateAll: true });
        } else {
            fetch("https://cpsql.pwisetthon.com/discordsrv_accounts/checklink?discordid=" + $page.data.props.disco_id)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {
                        linkmcsuccess = true;
                        minecraftuuid = result.minecraftid;
                    } else {
                        linkmcsuccess = false;
                    }
                })
                .catch(error => console.log('error', error));
        }
    });

    function linkminecraft() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": "boyphongsakorn",
            "password": "team1556th"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw        
        };

        fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/authme/check", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.result === 'Login success') {
                    linkmcsuccess = true;
                } else {
                    linkmcsuccess = false;
                }
            })
            .catch(error => {
                console.log('error', error);
                linkmcsuccess = false;
            });
    }
</script>

<Styles />

<Navbar color="dark" dark expand="md">
    <Container sm class="d-flex justify-content-between">
        <NavbarBrand href="/">BP Minecraft Server</NavbarBrand>
        <NavbarToggler on:click={() => (isOpen = !isOpen)} />
        <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
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
            {#if $page.data.props.disco_access_token !== undefined && $page.data.props.disco_access_token !== 'undefined' && $page.data.props.disco_access_token !== null}
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

<Container sm class="text-center">
    <!-- {#if $page.data.props.disco_access_token !== undefined && $page.data.props.disco_access_token !== 'undefined' && $page.data.props.disco_access_token !== null}
    
    {/if} -->
    <h1>Profile</h1>
    <Row>
        <Col>
            <p>คุณ {$page.data.props.disco_name}</p>
            <Avatar name="{$page.data.props.disco_name}" src="{$page.data.props.disco_img}" size="60px" />
            <Button style="background-color: #5865F2;" on:click={toggle}>ลิงก์บัญชี Discord กับบัญชีเกม</Button>
        </Col>
        <Col>
            <Card class="mb-3">
                <CardHeader>
                  <CardTitle>ชื่อในเกม : {minecraftname}</CardTitle>
                </CardHeader>
                <CardBody>
                  <!-- <CardSubtitle>Card subtitle</CardSubtitle>
                  <CardText>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                  </CardText> -->
                  <img src="https://crafatar.com/renders/body/{minecraftuuid}" />
                  <!-- <Button>Button</Button> -->
                </CardBody>
                <CardFooter>
                    {#if linkmcsuccess !== null}
                        {#if linkmcsuccess === true}
                            คุณได้ลิงก์บัญชีกับบัญชีเกมแล้ว (ผ่านในเกม)
                        {/if}
                    {/if}
                </CardFooter>
            </Card>
        </Col>
    </Row>
</Container>

<div>
    <Modal isOpen={open} {toggle}>
        <ModalHeader {toggle}>ลิงก์บัญชี Discord กับบัญชีเกม</ModalHeader>
        <ModalBody>
            <Form>
                <FormGroup floating label="ชื่อในเกม">
                    <Input placeholder="Enter your Minecraft username" />
                </FormGroup>
                <FormGroup floating label="รหัสผ่าน">
                    <Input placeholder="Enter your Minecraft password" type="password" />
                </FormGroup>
            </Form>
        </ModalBody>
        <ModalFooter>
            {#if linkmcsuccess !== null}
                {#if linkmcsuccess === true}
                    <Alert color="success">ลิงก์บัญชีสำเร็จ</Alert>
                {/if}
                {#if linkmcsuccess === false}
                    <Alert color="danger">ลิงก์บัญชีไม่สำเร็จ</Alert>
                {/if}
            {/if}
          <Button color="success" on:click={linkminecraft}>ลิงก์บัญชี</Button>
        </ModalFooter>
      </Modal>
    </div>