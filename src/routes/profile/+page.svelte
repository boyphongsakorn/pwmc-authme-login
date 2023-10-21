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
        CardFooter,
        Table,
        Label,
        FormText,
        InputGroup,
        InputGroupText
    } from 'sveltestrap';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Avatar from "svelte-avatar";
    import * as skinview3d from "skinview3d";
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faSpinner } from '@fortawesome/free-solid-svg-icons'
    let isOpen = false;

    /**
	 * @param {{ detail: { isOpen: boolean; }; }} event
	 */
    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    function handleUploadSkin(event) {
        console.log(event);
        isuploadskin = event.target.checked;
        textureurl = '';
    }

    function handleSkinName(event) {
        console.log(event);
        skinname = event.target.value;
        fetch("https://anywhere.pwisetthon.com/https://minecraft-api.com/api/skins/"+skinname+"/body/10.5")
            .then(response => response.text())
            .then(result => {
                //console.log(result);
                //get src 
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, "text/html");
                var img = doc.getElementsByTagName("img")[0];
                textureurl = img.src;
            })
    }

    const handleUploadSkinFile = async (e) =>{
        var formdata = new FormData();
        formdata.append("file", e.target.files[0]);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        await fetch("https://api.mineskin.org/generate/upload", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                texturevalue = result.data.texture.value;
                texturesignature = result.data.texture.signature;
                textureurl = result.data.texture.url;
                let skinViewer = new skinview3d.SkinViewer({
                    canvas: document.getElementById("skin_container"),
                    width: 300,
                    height: 400,
                    skin: result.data.texture.url
                });
            })
            .catch(error => console.log('error', error));
    }

    async function confirmUploadSkinChange() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            Nick: minecraftname,
            Value: texturevalue,
            Signature: texturesignature
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw        
        };

        await fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/skinsrestorer/addskin", requestOptions)
            .then(response => response.json())
            .then(result => {
            })
            .catch(error => console.log('error', error))
    }

    let open = false;
    const toggle = () => (open = !open);

    console.log($page);

    let isdiscordlinkmc = null;
    let linkmcsuccess = null;
    let minecraftname = null;
    let minecraftuuid = null;
    let ismccrack = null;
    let minecraftuser = null;
    let minecraftpass = null;
    let islinkfromweb = null;
    let co_user_id = null;
    let chat_history = null;
    let isimpossible = false;
    let isuploadskin = false;
    let texturevalue = '';
    let texturesignature = '';
    let textureurl = '';
    let skinname = '';
    let itchangeskin = false;
    let skinlink = '';
    let skinchangeurl = '';

    onMount(async () => {
        if (($page.data.props.disco_access_token === undefined || $page.data.props.disco_access_token === 'undefined' || $page.data.props.disco_access_token === null) && $page.data.props.authmeaccount === null) {
            goto('/', { invalidateAll: true });
        } else {
            await fetch("https://cpsql.pwisetthon.com/discordmclink/checklink?discordid=" + $page.data.props.disco_id)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {
                        isdiscordlinkmc = true;
                        minecraftuuid = result.minecraftid;
                        islinkfromweb = true;
                    } else {
                        isdiscordlinkmc = false;
                    }
                })
                .catch(error => {
                    isdiscordlinkmc = false;
                });
            if (isdiscordlinkmc == false) {
                await fetch("https://cpsql.pwisetthon.com/discordsrv_accounts/checklink?discordid=" + $page.data.props.disco_id)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === 200) {
                            isdiscordlinkmc = true;
                            minecraftuuid = result.minecraftid;
                            islinkfromweb = false;
                        } else {
                            isdiscordlinkmc = false;
                        }
                    })
                    .catch(error => console.log('error', error));
            }
            if (minecraftuuid != null) {
                let uuidnotfound = false;
                await fetch("https://api.minetools.eu/uuid/"+minecraftuuid)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === 'OK') {
                            minecraftname = result.name;
                            ismccrack = false;
                        } else {
                            //minecraftname = 'ไม่สามารถดึงข้อมูลได้ (อาจเป็นบัญชี Crack หรือ API ขัดข้อง)';
                            //ismccrack = true;
                            uuidnotfound = true;
                            ismccrack = true;
                        }
                    })
                    .catch(error => {
                        minecraftname = 'ไม่สามารถดึงข้อมูลได้ (API ขัดข้อง)';
                    });
                if (uuidnotfound == true){
                    await fetch("https://cpsql.pwisetthon.com/user/find/uuid/"+minecraftuuid)
                        .then(response => response.json())
                        .then(result => {
                            //if (result.status === 200) {
                                co_user_id = result.userid;
                                if (ismccrack == true) {
                                    minecraftname = result.user;
                                }
                            //} else {
                            //    co_user_id = null;
                            //}
                        })
                        .catch(error => {
                            co_user_id = null;
                        });
                    if (co_user_id == null) {
                        await fetch("https://cpsql.pwisetthon.com/user_log/log/uuid/"+minecraftuuid)
                            .then(response => response.json())
                            .then(result => {
                                //if (result.status === 200) {
                                    minecraftname = result.user;
                                    isimpossible = true;
                                    //ismccrack = true;
                                //} else {
                                //    minecraftname = 'ไม่สามารถดึงข้อมูลได้ (อาจเป็นบัญชี Crack หรือ API ขัดข้อง)';
                                //    ismccrack = true;
                                //}
                            })
                            .catch(error => {
                                minecraftname = 'ไม่สามารถดึงข้อมูลได้ (อาจเป็นบัญชี Crack หรือ API ขัดข้อง)';
                                ismccrack = true;
                            });
                    }
                }else{
                    await fetch("https://cpsql.pwisetthon.com/user/find/uuid/"+minecraftuuid)
                        .then(response => response.json())
                        .then(result => {
                            //if (result.status === 200) {
                                co_user_id = result.userid;
                                if (ismccrack == true) {
                                    minecraftname = result.user;
                                }
                            //} else {
                            //    co_user_id = null;
                            //}
                        })
                        .catch(error => {
                            co_user_id = null;
                        });
                }
                if (isimpossible == true) {
                    await fetch("https://cpsql.pwisetthon.com/user/find/user/"+minecraftname.replace(' (ผู้เล่น Crack)', '').replace(' (ตัวละคร Crack)', ''))
                        .then(response => response.json())
                        .then(result => {
                            //if (result.status === 200) {
                                co_user_id = result.userid;
                            //} else {
                            //    co_user_id = null;
                            //}
                        })
                        .catch(error => {
                            co_user_id = null;
                        });
                }
                await fetch("https://cpsql.pwisetthon.com/chat/history/"+co_user_id)
                    .then(response => response.json())
                    .then(result => {
                        //if (result.status === 200) {
                            chat_history = result;
                            console.log(chat_history);
                        //} else {
                        //    chat_history = null;
                        //}
                    }).catch(error => {
                        chat_history = null;
                    });
                await fetch("https://cpsql.pwisetthon.com/skinsrestorer/skinlink/"+minecraftname)
                    .then(response => response.json())
                    .then(result => {
                        if (result.Nick != result.Skin) {
                            itchangeskin = true;
                            skinlink = result.Skin;
                        }
                    }).catch(error => {
                        itchangeskin = false;
                    });
                if (itchangeskin == true) {
                    await fetch("https://cpsql.pwisetthon.com/skinsrestorer/getskin/"+skinlink)
                        .then(response => response.json())
                        .then(result => {
                            //decode base64 of result.Value
                            var decoded = atob(result.Value);
                            decoded = JSON.parse(decoded);
                            console.log(decoded);
                            skinchangeurl = decoded.textures.SKIN.url;
                            let skinViewer = new skinview3d.SkinViewer({
                                canvas: document.getElementById("skin_change_container"),
                                width: 300,
                                height: 400,
                                skin: skinchangeurl
                            });
                        })
                        .catch(error => {
                            skinlink = 'ไม่สามารถดึงข้อมูลได้ (API ขัดข้อง)';
                        });
                }
            }
        }
    });

    async function linkminecraft() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": minecraftuser,
            "password": minecraftpass
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw        
        };

        let uuidsearch = "";

        await fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/authme/check", requestOptions)
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
        await fetch("https://api.minetools.eu/uuid/"+minecraftuser)
            .then(response => response.json())
            .then(result => {
                if (result.status === 'OK') {
                    uuidsearch = result.id;
                } else {
                    uuidsearch = null;
                }
            })
            .catch(error => {
                uuidsearch = null;
            });
        if (linkmcsuccess == true) {
            raw = JSON.stringify({
                "discordid": $page.data.props.disco_id,
                "minecraftid": uuidsearch,
                "authme_id": minecraftuser,
                "uuidfrom": "official"
            });

            requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw        
            };

            await fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/discordmclink/link", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {
                        linkmcsuccess = true;
                        goto('/profile', { invalidateAll: true });
                    } else {
                        linkmcsuccess = false;
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    linkmcsuccess = false;
                });
        }
    }

    function convertUnixTime(unix_timestamp) {
      var date = new Date(unix_timestamp * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
      //convert getMonth() to thai month
      var month = date.getMonth();
      var day = date.getDate();
      var year = date.getFullYear();
      var thaiMonth = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      var thaiDate = day + " " + thaiMonth[month] + " " + (year + 543);
      return thaiDate + " เวลา " + formattedTime;
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
            {#if ($page.data.props.disco_access_token !== undefined && $page.data.props.disco_access_token !== 'undefined' && $page.data.props.disco_access_token !== null) || $page.data.props.authmeaccount !== null}
                <NavItem>
                    <NavLink href="https://bpminecraft.com/profile">คุณ {$page.data.props.disco_name ?? $page.data.props.authmeaccount}</NavLink>
                </NavItem>
                <NavItem>
                    <Button style="background-color: #5865F2;" href="https://bpminecraft.com/api/discordlogout" rel="external">ออกจากระบบ</Button>
                </NavItem>
            {/if}
        </Nav>
        </Collapse>
    </Container>
</Navbar>

<Container sm>
    <!-- {#if $page.data.props.disco_access_token !== undefined && $page.data.props.disco_access_token !== 'undefined' && $page.data.props.disco_access_token !== null}
    
    {/if} -->
    <!-- <h1>Profile</h1> -->
    <Row>
        <Col>
            <h1>Profile</h1>
        </Col>
        <!-- <Col xs="3" class="my-auto">
            <p>คุณ {$page.data.props.disco_name}</p>
        </Col>
        <Col xs="2">
            <Avatar name="{$page.data.props.disco_name}" src="{$page.data.props.disco_img}" size="60px" />
        </Col> -->
        {#if $page.data.props.disco_name}
            <Col xs="auto" class="my-auto text-right">
                <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" width="30px" /> เข้าสู่ระบบด้วยบัญชี Discord
            </Col>
        {:else if $page.data.props.authmeaccount}
            <Col xs="auto" class="my-auto text-right">
                <img src="https://preview.redd.it/you-have-an-ugly-gray-creeper-instead-of-a-minecraft-icon-v0-y83ppc5i6r4b1.png?width=1024&format=png&auto=webp&s=12576cea991cd7c24bd277c1c43800e81ea0e73a" width="30px" /> เข้าสู่ระบบด้วยบัญชี Minecraft
            </Col>
        {/if}
    </Row>
    <Row>
        <Col>
            <Row class="d-none">
                <!-- <Col xs="3" class="my-auto">
                    <p>คุณ {$page.data.props.disco_name}</p>
                </Col>
                <Col xs="2">
                    <Avatar name="{$page.data.props.disco_name}" src="{$page.data.props.disco_img}" size="60px" />
                </Col> -->
                {#if $page.data.props.disco_name}
                    <Col xs="auto" class="my-auto">
                        <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" width="30px" /> เข้าสู่ระบบด้วยบัญชี Discord
                    </Col> 
                {/if}
            </Row>
            <center>ประวัติการใช้จ่าย</center>
            <!-- <Table bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
            </Table> -->
            <Alert color="primary" class="text-center">Coming Soon</Alert>
            <Card class="mb-3">
                <CardHeader>
                  <CardTitle class="text-center">ประวัติแชท</CardTitle>
                </CardHeader>
                {#if chat_history !== null}
                    <CardBody class="text-left">
                        {#each chat_history as chat}
                            <img src="https://crafatar.com/renders/head/{minecraftuuid}" width="30px" />
                            <p class="d-inline"> {minecraftname.replace(' (ตัวละคร Crack)', '')} พูดว่า "{chat.message}" เมื่อ {convertUnixTime(chat.time)}</p><br>
                            <!-- } : {chat.message} (เวลา {convertUnixTime(chat.time)})</p><br> -->
                        {/each}
                        
                        <!-- <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </CardText>
                        <Button>Button</Button> -->
                    </CardBody>
                {/if}
                <!-- <CardFooter>Footer</CardFooter> -->
            </Card>
        </Col>
        <Col>
            <Card class="mb-3">
                <CardHeader>
                    {#if minecraftuuid !== null}
                        {#if minecraftname !== null}
                            <CardTitle class="text-center">ชื่อในเกม : {minecraftname}</CardTitle>
                        {:else}
                            <CardTitle class="text-center">ชื่อในเกม : กำลังโหลด <Fa icon={faSpinner} size="lg" pulse /></CardTitle>
                        {/if}
                    {:else}
                        {#if $page.data.props.authmeaccount !== null}
                            <CardTitle class="text-center">ชื่อในเกม : {$page.data.props.authmeaccount} (ยังไม่ได้เชื่อมบัญชี)</CardTitle>
                        {:else}
                            <CardTitle class="text-center">ชื่อในเกม : ยังไม่ได้เชื่อมบัญชี</CardTitle>
                        {/if}
                    {/if}
                </CardHeader>
                {#if minecraftuuid !== null || $page.data.props.authmeaccount !== null}
                    <CardBody class="text-center">
                        <!-- <CardSubtitle>Card subtitle</CardSubtitle>
                        <CardText>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                        </CardText> -->
                        {#if itchangeskin !== true}
                            <img src="https://crafatar.com/renders/body/{minecraftuuid ?? '0110b237-1102-4d74-81d4-5a1df9d14ca7'}" />
                        {:else}
                            <canvas id="skin_change_container"></canvas>
                        {/if}
                        <!-- <Button>Button</Button> -->
                        <br>
                        {#if minecraftuuid !== null}
                        <Alert color="secondary">
                            <h5 class="text-center">เปลี่ยนสกิน</h5>
                            <FormGroup class="d-inline-block">
                                <Input type="switch" label="อัพโหลดสกินเอง" value={isuploadskin} on:change={handleUploadSkin} />
                            </FormGroup>
                            {#if isuploadskin === false}
                                <FormGroup floating label="ชื่อสกินที่ต้องการเปลี่ยน">
                                    <Input placeholder="Enter a value" value={skinname} on:input={(e) => handleSkinName(e)} />
                                </FormGroup>
                                <!-- <iframe src="https://minecraft-api.com/api/skins/{skinname}/body/10.5" width="100%" height="450px"></iframe> -->
                                <img src={textureurl} />
                            {:else}
                                <FormGroup>
                                    <!-- <Label for="exampleFile">File</Label> -->
                                        <Input type="file" name="file" id="exampleFile" on:change={(e) => handleUploadSkinFile(e)} />
                                    <!-- <FormText color="muted">
                                        This is some placeholder block-level help text for the above input. It's a
                                        bit lighter and easily wraps to a new line.
                                    </FormText> -->
                                </FormGroup>
                                <InputGroup class="mb-3">
                                    <InputGroupText>Texture Value</InputGroupText>
                                    <Input placeholder="Texture Value" disabled value={texturevalue}/>
                                </InputGroup>
                                <InputGroup class="mb-3">
                                    <InputGroupText>Texture Signature</InputGroupText>
                                    <Input placeholder="Texture Signature" disabled value={texturesignature}/>
                                </InputGroup>
                                <!-- <img src={textureurl} /> -->
                                <canvas id="skin_container"></canvas><br>
                                <Button color="primary" on:click={confirmUploadSkinChange}>ยืนยันการเปลี่ยนสกิน</Button>
                            {/if}
                        </Alert>
                        {/if}
                    </CardBody>
                {/if}
                <CardFooter class="text-center">
                    {#if isdiscordlinkmc !== null}
                        {#if isdiscordlinkmc === true}
                            {#if ismccrack === true && isimpossible === false}
                                คุณได้ลิงก์บัญชีกับบัญชีเกมแล้ว (ผ่านในเกม) แต่บัญชีเกมของคุณเป็นบัญชี Crack
                                <br>ไม่ใช่? ลองเข้าเกมแล้วลิงก์บัญชีใหม่ หรือกดลิงก์<a on:click={toggle} class="text-primary">ที่นี่</a>
                            {:else if ismccrack === true && isimpossible === true}
                                คุณได้ลิงก์บัญชีกับบัญชีเกมแล้ว (ผ่านในเกม) แต่บัญชีเกมของคุณเป็นบัญชี Crack จึงไม่สามารถดึงข้อมูลบ้างอย่างได้
                                <br>ถ้าตอนนี้คุณเลิกใช้บัญชี Crack แล้ว ลองลิงก์ใหม่<a on:click={toggle} class="text-primary">ที่นี่</a>
                            {:else}
                                {#if islinkfromweb === true}
                                    คุณได้ลิงก์บัญชีกับบัญชีเกมแล้ว (ผ่านเว็บ)
                                {:else}
                                    คุณได้ลิงก์บัญชีกับบัญชีเกมแล้ว (ผ่านในเกม)
                                {/if}
                            {/if}
                        {:else}
                            {#if $page.data.props.authmeaccount !== null}
                                <Button style="background-color: #5865F2;" href="https://discord.com/api/oauth2/authorize?client_id=625822290675892234&redirect_uri=https%3A%2F%2Fbpminecraft.com%2Fapi%2Fdiscordcallback&response_type=code&scope=identify%20guilds">ลิงก์บัญชี บัญชีเกม กับ Discord</Button>
                            {:else}
                                <Button style="background-color: #5865F2;" on:click={toggle}>ลิงก์บัญชี Discord กับบัญชีเกม</Button>
                            {/if}
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
                    <Input placeholder="Enter your Minecraft username" bind:value={minecraftuser} />
                </FormGroup>
                <FormGroup floating label="รหัสผ่าน">
                    <Input placeholder="Enter your Minecraft password" bind:value={minecraftpass} type="password" />
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