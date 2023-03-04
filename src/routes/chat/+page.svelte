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
		CardBody,
		CardHeader,
		CardTitle
	} from 'sveltestrap';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Avatar from 'svelte-avatar';
	import Swal from "sweetalert2";

	let isOpen = false;
	let messages = [];
	let messagesinfo = [];
	let users = [];
	let newMessage = '';
	let headimgurl = '';

	/**
	 * @param {{ detail: { isOpen: boolean; }; }} event
	 */
	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}

	let open = false;
	const toggle = () => (open = !open);

	async function sendMessage() {
		const ogmessage = newMessage;
		let discordid = '';
		let user = 0;
		const thaibadwordapi = await fetch(
			'https://raw.githubusercontent.com/chucknorris-io/swear-words/master/th'
		);
		const thaibadwordtext = await thaibadwordapi.text();
		const engbadwordapi = await fetch(
			'https://raw.githubusercontent.com/chucknorris-io/swear-words/master/en'
		);
		const engbadwordtext = await engbadwordapi.text();
		const thaibadword = thaibadwordtext.split('\n').slice(0, -1);
		const engbadword = engbadwordtext.split('\n').slice(0, -1);
		//if have bad word
		if (
			thaibadword.some((word) => newMessage.includes(word)) ||
			engbadword.some((word) => newMessage.includes(word))
		) {
			//replace bad word with ***
			for (let i = 0; i < thaibadword.length; i++) {
				newMessage = newMessage.replace(thaibadword[i], '***');
			}
			for (let i = 0; i < engbadword.length; i++) {
				newMessage = newMessage.replace(engbadword[i], '***');
			}
		}
		newMessage = '(Guest จากเว็บ) : ' + newMessage;
		if (ogmessage.trim() !== '') {
			if (
				$page.data.props.disco_access_token != undefined &&
				$page.data.props.disco_access_token !== 'undefined' &&
				$page.data.props.disco_access_token !== null
			) {
				newMessage =
					$page.data.props.disco_name + ' (จากเว็บ) : ' + newMessage.replace('(Guest จากเว็บ) : ', '');
				messagesinfo = [...messagesinfo, 'wc'+$page.data.props.disco_id];
				discordid = $page.data.props.disco_id;
				user = 1;
			} else {
				messagesinfo = [...messagesinfo, 'wc0'];
			}
			messages = [...messages, ogmessage];
			//rcon.send('จากหน้าเว็บ' + newMessage);
			// await fetch(
			// 	'https://anywhere.pwisetthon.com/https://localpost.teamquadb.in.th/sendrcon?message=' +
			// 		newMessage
			// )
			// 	.then((response) => response.text())
			// 	.then((data) => {
			// 		console.log(data);
			// 		document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
			// 	})
			// 	.catch((error) => {
			// 		document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
			// 	});

			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				"name": "",
				"message": newMessage
			});

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			await fetch("https://anywhere.pwisetthon.com/https://map.bpminecraft.com/up/sendmessage", requestOptions)
				.then(response => response.text())
				.then(async (result) => {
					console.log(result);
					//get unix time now
					var unixtime = Math.round(+new Date() / 1000);

					var myHeaders = new Headers();
					myHeaders.append('Content-Type', 'application/json');

					const raw = JSON.stringify({
						time: unixtime,
						user: user,
						discord: discordid,
						message: ogmessage
					});

					const requestOptions = {
						method: 'POST',
						headers: myHeaders,
						body: raw
					};

					await fetch(
						'https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/webchat/newchat/',
						requestOptions
					)
						.then((response) => response.json())
						.then((result) => {
							// if (result.result === 'Login success') {
							//     linkmcsuccess = true;
							// } else {
							//     linkmcsuccess = false;
							// }
						})
						.catch((error) => {
							console.log('error', error);
							// linkmcsuccess = false;
						});
					document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
				})
				.catch(error => {
					console.log('error', error);
					Swal.fire({
						position: 'top-end',
						icon: 'error',
						title: 'Server ข้อความไม่ตอบสนอง หรือ มีปัญหา กรุณาลองใหม่อีกครั้ง',
						showConfirmButton: false,
						timer: 500
					})
					document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
				});

		}else{
			Swal.fire({
				position: 'top-end',
				icon: 'error',
				title: 'ข้อความไม่ถูกต้อง',
				showConfirmButton: false,
				timer: 500
			})
		}
		newMessage = '';
	}

	async function getuuidbyname(i) {
		let uuid = '';
		var myHeaders = new Headers();
		myHeaders.append('key', 'change_me');

		var requestOptions = {
			method: 'GET',
			headers: myHeaders
		};

		await fetch('https://jnsinfo.bpminecraft.com/v1/players', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				//find displayName is same as i
				result.forEach(function (item) {
					if (item.displayName === i) {
						//if found, push uuid to users
						uuid = item.uuid;
					}
				});
			})
			.catch((error) => console.log('error', error));

		return uuid;
	}

	console.log($page);

	onMount(async () => {
		let allchat;
		await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/chat/history/')
			.then((response) => response.json())
			.then((data) => {
				data.sort(function (a, b) {
					return a.rowid - b.rowid;
				});
				allchat = data;
				//ascending order data
				// data.sort(function (a, b) {
				//     return a.rowid - b.rowid;
				// });
				// //push each data.message to messages
				// data.forEach(function (item) {
				//     messages = [...messages, item.message];
				//     messagesinfo = [...messagesinfo, item.user];
				// });
				// //scroll to bottom
				// setTimeout(() => {
				//     document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
				// }, 100);
			});
		await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/webchat/history')
			.then((response) => response.json())
			.then((data) => {
				//add each user with text wc
				data.forEach(function (item) {
					if (item.user === 0 || item.discord === null) {
						item.user = 'wc' + item.user;
					} else {
						item.user = 'wc' + item.discord;
					}
				});
				//add data to allchat
				allchat = [...allchat, ...data];
				//ascending order data
				// data.sort(function (a, b) {
				//     return a.rowid - b.rowid;
				// });
				// //push each data.message to messages
				// data.forEach(function (item) {
				//     messages = [...messages, item.message];
				//     messagesinfo = [...messagesinfo, item.user];
				// });
				// //scroll to bottom
				// setTimeout(() => {
				//     document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
				// }, 100);
			});
		if (allchat.length > 0) {
			//order by time
			allchat.sort(function (a, b) {
				return a.time - b.time;
			});
			//remove blank message
			allchat = allchat.filter((item) => item.message !== '');
			//remove duplicate message or same message
			// allchat = allchat.filter((item, index, self) => {
			// 	return (
			// 		index ===
			// 		self.findIndex((t) => {
			// 			return t.message === item.message;
			// 		})
			// 	);
			// });
			allchat.forEach(function (item) {
				messages = [...messages, item.message];
				messagesinfo = [...messagesinfo, item.user];
			});
			setTimeout(() => {
				document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
			}, 100);
		}
		var myHeaders = new Headers();
		myHeaders.append('key', 'change_me');

		var requestOptions = {
			method: 'GET',
			headers: myHeaders
		};

		await fetch('https://jnsinfo.bpminecraft.com/v1/players', requestOptions)
			.then((response) => response.json())
			.then((result) => {
				//push every displayName to users
				result.forEach(function (item) {
					users = [...users, item.displayName];
				});
			})
			.catch((error) => console.log('error', error));
		
		await fetch('https://crafatar.com/renders/head/0c0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c')
			.then((response) => response.json())
			.then((result) => {
				headimgurl = 'https://crafatar.com/renders/head/';
			})
			.catch((error) => {
				headimgurl = 'https://minotar.net/cube/user/';
			});
	});

	let nonewmessage = 0;
	setInterval(async () => {
		if (messages.length > 0) {
			if ((nonewmessage > 10 && nonewmessage % 10 == 0) || nonewmessage <= 10) {
				// await fetch("https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/chat/history/")
				//     .then(response => response.json())
				//     .then(data => {
				//         //ascending order data
				//         data.sort(function (a, b) {
				//             return a.rowid - b.rowid;
				//         });
				//         //push each data.message to messages
				//         if (data.length > messages.length) {
				//           messages = [];
				//           messagesinfo = [];
				//           data.forEach(function (item) {
				//               messages = [...messages, item.message];
				//               messagesinfo = [...messagesinfo, item.user];
				//           });
				//           setTimeout(() => {
				//               document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
				//               nonewmessage = 0;
				//           }, 100);
				//         } else {
				//           console.log('no new message');
				//         }
				//     });
				let allchat;
				await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/chat/history/')
					.then((response) => response.json())
					.then((data) => {
						data.sort(function (a, b) {
							return a.rowid - b.rowid;
						});
						allchat = data;
						//ascending order data
						// data.sort(function (a, b) {
						//     return a.rowid - b.rowid;
						// });
						// //push each data.message to messages
						// data.forEach(function (item) {
						//     messages = [...messages, item.message];
						//     messagesinfo = [...messagesinfo, item.user];
						// });
						// //scroll to bottom
						// setTimeout(() => {
						//     document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
						// }, 100);
					});
				await fetch('https://anywhere.pwisetthon.com/https://cpsql.pwisetthon.com/webchat/history')
					.then((response) => response.json())
					.then((data) => {
						data.forEach(function (item) {
							if (item.user === 0 || item.discord === null) {
								item.user = 'wc' + item.user;
							} else {
								item.user = 'wc' + item.discord;
							}
						});
						//add data to allchat
						allchat = [...allchat, ...data];
						//ascending order data
						// data.sort(function (a, b) {
						//     return a.rowid - b.rowid;
						// });
						// //push each data.message to messages
						// data.forEach(function (item) {
						//     messages = [...messages, item.message];
						//     messagesinfo = [...messagesinfo, item.user];
						// });
						// //scroll to bottom
						// setTimeout(() => {
						//     document.getElementById('cbbox').scrollTop = document.getElementById('cbbox').scrollHeight;
						// }, 100);
					});
				//remove blank message
				allchat = allchat.filter((item) => item.message !== '');
				//remove duplicate message or same message
				// allchat = allchat.filter((item, index, self) => {
				// 	return (
				// 		index ===
				// 		self.findIndex((t) => {
				// 			return t.message === item.message;
				// 		})
				// 	);
				// });
				if (allchat.length > messages.length) {
					//order by time
					allchat.sort(function (a, b) {
						return a.time - b.time;
					});
					messages = [];
					messagesinfo = [];
					allchat.forEach(function (item) {
						messages = [...messages, item.message];
						messagesinfo = [...messagesinfo, item.user];
					});
					setTimeout(() => {
						document.getElementById('cbbox').scrollTop =
							document.getElementById('cbbox').scrollHeight;
						nonewmessage = 0;
					}, 100);
				}
			}
			nonewmessage++;
		}
	}, 1000);

	async function getplayerinfo(i) {
		let rowid = messagesinfo[i];
		console.log(messagesinfo);
		if (isNaN(rowid) || rowid == 0) {
			//if front rowid is wc
			if (rowid.includes('wc') && rowid != 'wc0') {
				// const headers = {
				//   'Authorization': 'Bot ' + import.meta.env.VITE_DISCORD_BOT_TOKEN
				// };
				let name;
				let avatar;
				await fetch(
					'https://discordlookup.mesavirep.xyz/v1/user/' +
						rowid.replace('wc', '') /*, { headers: headers }*/
				)
					.then((response) => response.json())
					.then((data) => {
						name = data.tag;
						//find inded of last # in tag
						let index = name.lastIndexOf('#');
						//remove last # and everything after it
						name = name.substring(0, index);
						avatar = data.avatar.link;
					});
				return { user: name + ' (จากเว็บ)', uuid: 'discord-' + avatar };
			}
			return { user: 'Guest (จากเว็บ)', uuid: '00000000-0000-0000-0000-000000000000' };
		}
		const response = await fetch('https://cpsql.pwisetthon.com/user/find/id/' + rowid);
		const json = await response.json();
		//console.log(json);
		return json;
	}

	let innerWidth = 0;
	let innerHeight = 0;

	$: condition = innerWidth * 1.33 <= innerHeight;
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
						<Button
							style="background-color: #5865F2;"
							href="https://discord.com/api/oauth2/authorize?client_id=625822290675892234&redirect_uri=https%3A%2F%2Fbpminecraft.com%2Fapi%2Fdiscordcallback&response_type=code&scope=identify%20guilds"
							>ล็อกอินผ่าน Discord</Button
						>
					</NavItem>
				{:else}
					<NavItem>
						<NavLink href="https://bpminecraft.com/profile"
							>คุณ {$page.data.props.disco_name}</NavLink
						>
					</NavItem>
					<NavItem>
						<Button
							style="background-color: #5865F2;"
							href="https://bpminecraft.com/api/discordlogout"
							rel="external">ออกจากระบบ</Button
						>
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
			<div
				class="overflow-scroll overflow-x-auto"
				style="max-height: {innerHeight - 100}px;"
				id="cbbox"
			>
				<!-- <ul class="list-unstyled"> -->
				{#each messages as message, i}
					<Card body>
						<div class="d-inline">
							{#await getplayerinfo(i) then test}
								{#if test.uuid.includes('discord-')}
									<img
										src={test.uuid.replace('discord-', '')}
										class="rounded-circle"
										width="30"
										height="30"
										alt="discord avatar"
									/>
								{:else}
									<img
										src="{headimgurl}{test.uuid}"
										class="rounded-circle"
										width="30"
										height="30"
										alt="minecraft avatar"
									/>
								{/if}
								<!-- <img
									src="https://crafatar.com/renders/head/{test.uuid}"
									class="rounded-circle"
									width="30"
									height="30"
								/> -->
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
					<input
						type="text"
						class="form-control"
						placeholder="Enter message..."
						bind:value={newMessage}
					/>
					<div class="input-group-append">
						<button type="submit" class="btn btn-primary">Send</button>
					</div>
				</div>
			</form>
		</div>
		<div class="col-12 col-md-3 h-100">
			<!-- User list -->
			<div class="user-list h-100">
				<!-- <h5>Online Users:</h5> -->
				<!-- <ul class="list-unstyled"> -->
				<Card>
					<CardHeader>
						<h5>Online Users:</h5>
					</CardHeader>
					{#if users.length === 0}
						<CardBody>ไม่มีผู้เล่นออนไลน์</CardBody>
					{:else}
						{#each users as user}
							<!-- <li>{user}</li> -->
							<CardBody>
								{#await getuuidbyname(user) then test}
									<img
										src="{headimgurl}{test}"
										class="rounded-circle"
										width="30"
										height="30"
										alt="minecraft avatar"
									/>
								{/await}
								{user}
							</CardBody>
						{/each}
					{/if}
				</Card>
				<!-- </ul> -->
			</div>
		</div>
	</div>
</div>
