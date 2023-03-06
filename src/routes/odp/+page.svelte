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
            Table,
			Alert,
            FormGroup,
            Label,
            Input
        } from 'sveltestrap';
        import { page } from '$app/stores';
        import { onMount } from 'svelte';
        import { goto } from '$app/navigation';
        import Avatar from "svelte-avatar";
        import { SvelteToast,toast } from '@zerodevx/svelte-toast'
        let isOpen = false;
        let event_id = '';
        let winner = '';
        let istoast = false;
    
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

        function monthtothai(month) {
            switch (month) {
                case 0:
                    return 'มกราคม';
                case 1:
                    return 'กุมภาพันธ์';
                case 2:
                    return 'มีนาคม';
                case 3:
                    return 'เมษายน';
                case 4:
                    return 'พฤษภาคม';
                case 5:
                    return 'มิถุนายน';
                case 6:
                    return 'กรกฎาคม';
                case 7:
                    return 'สิงหาคม';
                case 8:
                    return 'กันยายน';
                case 9:
                    return 'ตุลาคม';
                case 10:
                    return 'พฤศจิกายน';
                case 11:
                    return 'ธันวาคม';
                default:
                    return 'ไม่รู้จัก';
            }
        }

        function unixToDateTime(unix) {
            console.log(unix);
            var date = new Date(unix * 1000);
            console.log(date);
            //return day month year hour:minute:second
            return date.getDate() + ' ' + monthtothai(date.getMonth()) + ' ' + (date.getFullYear()+543) + ' เวลา ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            //return date.toLocaleString();
        }
    
        async function getmainserverinto() {
            const response = await fetch('https://api.mcsrvstat.us/2/playmc.pwisetthon.com');
            const json = await response.json();
            //console.log(json);
            return json;
        }
    
        async function getodpserverinto() {
            const response = await fetch('https://api.mcsrvstat.us/2/154.208.140.118');
            const json = await response.json();
            //console.log(json);
            return json;
        }

        async function getallevent() {
            const response = await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/oneday/allevent');
            const json = await response.json();
            json.forEach(element => {
                element.event_start_time = unixToDateTime(element.event_start);
            });
            //set event_id as first event
            event_id = json[0].id;
            //console.log(json);
            return json;
        }

        async function getdata(id) {
            const response = await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/oneday/damage/' + id);
            const json = await response.json();
            winner = json[0].name;
            //console.log(json);
            return json;
        }

        async function getnexttimerun() {
            const response = await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/oneday/allevent');
            const json = await response.json();
            //if last event is not waiting
            if (json[0].status != 'wait') {
                //set next event as first event
                let today = new Date();
                //get timeleft from now to 23:30:00
                let timeleft = (new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 30, 0, 0).getTime() - today.getTime()) / 1000;
                //convert to hour minute second
                let hour = Math.floor(timeleft / 3600);
                let minute = Math.floor((timeleft - hour * 3600) / 60);
                let second = Math.floor(timeleft - hour * 3600 - minute * 60);
                if (istoast == false) {
                    toast.push('Event ครั้งต่อไปจะเริ่มในอีก ' + hour + ' ชั่วโมง ' + minute + ' นาที ' + second + ' วินาที', {
                        theme: {
                            '--toastColor': 'mintcream',
                            '--toastBackground': 'rgba(255,69,0, 0.8)',
                            '--toastBarBackground': '#8B0000'
                        },
                        duration: 20000
                    })
                    istoast = true;
                }
                return 'เริ่มในอีก ' + hour + ' ชั่วโมง ' + minute + ' นาที ' + second + ' วินาที';
            } else {
                return 'เริ่มแล้วตอนนี้';
            }
            //console.log(json);
            // return json;
        }
    </script>

    <svelte:head>
        <title>BPMC - One Day Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </svelte:head>
    
    <Styles />
    
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

    {#await getallevent() then test }
        {#if test[0].status == 'wait' || test[0].status == 'start'}
            <Alert color="danger" class="mb-0 rounded-0" dismissible>
                <Container sm>
                    Event เริ่มแล้ว เข้าร่วมได้ที่ IP : 154.208.140.118
                </Container>
            </Alert>
        {/if}
    {/await}
    
    <Container fluid style="background-image: url('https://img.gs/fhcphvsghs/1920x1080,crop=left/https://imgul.teamquadb.in.th/images/2023/02/23/Survival_The_End.png');background-position: center center;background-repeat: no-repeat;background-size: cover;height: 500px;display: table; overflow: hidden;">
        <div style="display: table-cell; vertical-align: middle;text-align: center;color: white;">
            <div>
                <h1>One Day Project</h1>
                <h5>เอาชนะ Ender Dragon ภายใน 24 ชั่วโมง</h5>
            </div>
        </div>
    </Container>
    <Container sm style="display: none;">
        <Row>
            <!-- <Col>
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
            </Col> -->
            <Col>
                {#await getodpserverinto() then test }
                    <Card body>
                        <Row>
                            <!-- <Col xs="auto">
                                <Avatar name="{test.motd.clean[0]}" src="{test.icon}" />
                            </Col> -->
                            <Col class="d-flex align-items-center">
                                Event เริ่มแล้ว
                            </Col>
                            <Col xs="auto" class="my-auto">
                                {test.players.online}/50
                            </Col>
                            <!-- <Col xs="auto" class="my-auto">
                                Online
                            </Col> -->
                        </Row>
                    </Card>
                {/await}
            </Col>
        </Row>
    </Container>
    
    <!-- <Container sm>
        <Row>
            <Col class="d-flex justify-content-center">
                <img src="https://i.imgur.com/NUGzfyS.png" class="rounded-2 w-75 shadow my-2" alt="Log" />
            </Col>
            <Col class="text-center my-auto">
                <a href="https://log.bpminecraft.com" class="text-decoration-none"><h2>Log เซิฟเวอร์</h2></a>
                <p>เว็บไซต์ดู Log เซิฟเวอร์ การทุบบล็อก/วาง หรือ เปิดกล่อง</p>
            </Col>
        </Row>
    </Container>
    <Container sm>
        <Row>
            <Col class="text-center my-auto">
                <a href="https://map.bpminecraft.com" class="text-decoration-none"><h2>Map เซิฟเวอร์</h2></a>
                <p>เว็บไซต์ดู Map โลกของเซิฟเวอร์</p>
            </Col>
            <Col class="d-flex justify-content-center">
                <img src="https://screenshot-xi.vercel.app/api?url=https://map.bpminecraft.com&width=640&height=360" class="rounded-2 w-75 shadow my-2" alt="Map">
            </Col>
        </Row>
    </Container>
    <Container sm>
        <Row>
            <Col class="d-flex justify-content-center">
                <img src="https://img.gs/fhcphvsghs/quality=low/https://screenshot-xi.vercel.app/api?url=https://bpminecraft.com/chat&width=640&height=360" class="rounded-2 w-75 shadow my-2" alt="Chat">
            </Col>
            <Col class="text-center my-auto">
                <a href="https://log.bpminecraft.com" class="text-decoration-none"><h2>Chat เซิฟเวอร์</h2></a>
                <p>ระบบ Chat ในเซิฟเวอร์บนหน้าเว็บ</p>
            </Col>
        </Row>
    </Container> -->

    {#await getnexttimerun() then test }
        {#if test != "เริ่มแล้วตอนนี้"}
            <Container sm class="d-none">
                <Alert color="danger" dismissible fade>
                    <h4 class="alert-heading">Event จะเริ่มในอีก</h4>
                    <hr>
                    <p class="mb-0">{test}</p>
                </Alert>
                        <!-- <p>{test}</p> -->
            </Container>
            <SvelteToast />
        {/if}
    {/await}

    <Container sm>
        <Row>
            <Col class="text-center my-auto">
                <h2>Server เริ่ม 23:30 น. ทุกวัน</h2>
                <!-- <p>*แต่ Event เริ่ม 00:00 น. ทุกวัน</p> -->
                {#await getnexttimerun() then test }
                    <p>{test}</p>
                {/await}
            </Col>
            <Col class="d-flex justify-content-center">
                <img src="https://img.gs/fhcphvsghs/quality=low/https://imgul.teamquadb.in.th/images/2023/03/05/image.png" class="rounded-2 w-75 shadow my-2" alt="Minecraft">
            </Col>
        </Row>
    </Container>

    <Container sm>
        <Row>
            <Col class="d-flex justify-content-center">
                <img src="https://img.gs/fhcphvsghs/quality=low/https://imgul.teamquadb.in.th/images/2023/03/05/image3a87c256f2e1401e.png" class="rounded-2 w-75 shadow my-2" alt="Minecraft">
            </Col>
            <Col class="text-center my-auto">
                <h2>Event เริ่ม 00:00 น. ทุกวัน*</h2>
                <p>*ถ้า ไม่มีใครฆ่า Ender Dragon ได้ หรือจบหลัง 23:00 น. จะเว้นวันแล้วเริ่มใหม่ในวันต่อไป เช่น ถ้า Event เริ่มวันจันทร์ จะเริ่มใหม่ในวันพุธ</p>
            </Col>
        </Row>
    </Container>

    <Container sm>
        <Row>
            <Col class="text-center my-auto">
                <h2>15 นาทีแรก PVP จะทำการปิด*</h2>
                <p>*PVP คือ การโจมตีกัน ทำให้เกิดความเสียหายต่อผู้เล่นอื่นได้</p>
            </Col>
            <Col class="d-flex justify-content-center">
                <img src="https://img.gs/fhcphvsghs/quality=low/https://imgul.teamquadb.in.th/images/2023/03/05/imagefcb3ff56f8b33e46.png" class="rounded-2 w-75 shadow my-2" alt="Chat">
            </Col>
        </Row>
    </Container>

    <Container sm>
        <Row>
            <Col class="d-flex justify-content-center">
                <img src="https://img.gs/fhcphvsghs/quality=low/https://imgul.teamquadb.in.th/images/2023/03/05/image82a528ed86365039.png" class="rounded-2 w-75 shadow my-2" alt="Chat">
            </Col>
            <Col class="text-center my-auto">
                <h2>ผู้ชนะวัดจาก Damage ที่ทำให้ Ender Dragon*</h2>
                <p>*Damage นับจากการโจมตี Ender Dragon โดยใช้ ดาบ,ธูน หรือ อาวุธอื่นๆ (ได้ Damage เต็ม) หรือ นอนเตียง (คนที่ใกล้จุดเตียงระเบิดมากที่สุดจะได้ Damage)</p>
            </Col>
        </Row>
    </Container>

    <Container sm>
        <Row>
            <Col class="text-center my-auto">
                <h2>ประวัติ Event*</h2>
                <p>*แสดง 10 อันดับ Damage สูงสุด</p>
            </Col>
            <Col>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="exampleSelect">Event ทั้งหมด</Label>
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => {event_id = e.target.value;}}>
                                {#await getallevent() then test }
                                    {#each test as event}
                                        {#if event.status == 'start'}
                                            <option value="{event.id}">{event.event_start_time} (กำลังเล่น)</option>
                                        {:else if event.status == 'end'}
                                            <option value="{event.id}">{event.event_start_time} (จบแล้ว)</option>
                                        {:else}
                                            <option value="{event.id}">{event.event_start_time} (รอเริ่ม)</option>
                                        {/if}
                                    {/each}
                                {/await}
                              <!-- <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option> -->
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col>
                        <Card body>ผู้ชนะ : {winner}</Card>
                    </Col>
                </Row>
                <Table bordered>
                    <thead>
                      <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อ</th>
                        <th>ดาเมจที่ทำ
                      </tr>
                    </thead>
                    <tbody>
                        {#if event_id != ''}
                            {#await getdata(event_id) then test }
                                {#each test as event, i}
                                    {#if i == 0}
                                        <tr class="table-success">
                                            <th scope="row">{i+1}</th>
                                            <td>{event.name}</td>
                                            <td>{event.alldamage}</td>
                                        </tr>
                                    {:else}
                                        <tr>
                                            <th scope="row">{i+1}</th>
                                            <td>{event.name}</td>
                                            <td>{event.alldamage}</td>
                                        </tr>
                                    {/if}
                                {/each}
                            {/await}
                        {/if}
                      <!-- <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr> -->
                    </tbody>
                </Table>
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