process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const ViberBot = require('viber-bot').Bot;
const ViberBotEvents = require('viber-bot').Events;
const menu = require('./menu');
const fs = require('fs');

let botTelegramToken = '1141326307:AAEEoVSVl30uEa2vv44YNGMuzbC8YeK9PtQ';
let botViberToken = '4b444edb31a7d093-47870dc6a6c6337a-e6d832d092e7f86c';
let botViberServerUrl = 'https://help-doctor-sumy.herokuapp.com/';
let botViberServerPort = 80;
let botViberHttpsOptions;


let adminAccountViber = 'vVAaatkLsCNsT/8C2voaVUA==';
let adminAccountTelegram = 'vVAaatkLsCNsT/8C2voaVUA==';
let chatIdTelegram = -1001364789486;
let selectedMenus = {};
let dataRegistrationAccount = {};

// set local config
try {
	if (fs.statSync('./config-local.js').isFile()) {
		menu.log('load local config');
		const configLocal = require('./config-local');

		if (configLocal.botViberServerUrl !== undefined && configLocal.botViberServerUrl !== ''){
			botViberServerUrl = configLocal.botViberServerUrl;
			menu.log('load botViberServerUrl ' + botViberServerUrl);
		}
		if (configLocal.botViberServerPort !== undefined && configLocal.botViberServerPort !== 0){
			botViberServerPort = configLocal.botViberServerPort;
			menu.log('load botServerPort ' + botViberServerPort);
		}

		if (configLocal.botTelegramToken !== undefined && configLocal.botTelegramToken !== ''){
			botTelegramToken = configLocal.botTelegramToken;
			menu.log('load botTelegramToken ' + botTelegramToken);
		}
		if (configLocal.botViberToken !== undefined && configLocal.botViberToken !== ''){
			botViberToken = configLocal.botViberToken;
			menu.log('load botViberToken ' + botViberToken);
		}


		if (configLocal.adminAccountViber !== undefined && configLocal.adminAccountViber !== ''){
			adminAccountViber = configLocal.adminAccountViber;
			menu.log('load adminAccountViber ' + adminAccountViber);
		}
		if (configLocal.chatIdTelegram !== undefined && configLocal.chatIdTelegram !== ''){
			chatIdTelegram = configLocal.chatIdTelegram;
			menu.log('load chatIdTelegram ' + chatIdTelegram);
		}

		if (configLocal.botViberHttpsOptions !== undefined && configLocal.botViberHttpsOptions !== ''){
			httpsOptions = configLocal.botViberHttpsOptions;
			menu.log('load botViberHttpsOptions ' + botViberHttpsOptions);
		}
	}
} catch (e) {
	//menu.log(e);
	menu.log('no local config');
}


const botTelegram = new TelegramBot(botTelegramToken, { polling: true });
const botViber = new ViberBot({authToken: botViberToken,name: 'HelpDoctor Sumy',avatar: 'https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/7652/75d14a739654a1b4ad88cb7b61dcc803a236a0c59b604aa3b6e42b2d60467652.jpg'});

let arrayDoctors =  {};
let arrayDrivers =  {};

fs.readFile('doctors.json', 'utf8', function readFileCallback(err, data){if (err){console.log(err);} else {arrayDoctors = JSON.parse(data);}});
fs.readFile('drivers.json', 'utf8', function readFileCallback(err, data){if (err){console.log(err);} else {arrayDrivers = JSON.parse(data);}});

//----------------------------------------------------------------------------------------------------------------------
//------------ TELEGRAM EVENTS -----------------------------------------------------------------------------------------
botTelegram.onText(/\/drivers(.*)/, function (msg, match) {
	for (const driverId in arrayDrivers) {
		let messageSend = '';
		arrayDrivers[driverId].forEach(function (driverMsg) {
			if (!messageSend){
				messageSend = 'Водій @' + driverMsg.user + ' писав: \n';
			}
			messageSend += '*' + driverMsg.date + ' : ' + driverMsg.text + '\n\n';
		});
		botTelegram.sendMessage(msg.from.id, messageSend).then().catch();
	}
});

// выдать в личку список докторов
botTelegram.onText(/\/doctors(.*)/, function (msg, match) {
	for (const doctorId in arrayDoctors) {
		let messageSend = '';
		arrayDoctors[doctorId].forEach(function (doctorMsg) {
			if (!messageSend){
				messageSend = 'Медперсонал @' + doctorMsg.user + ' писав: \n';
			}
			messageSend += '*' + doctorMsg.date + ' : ' + doctorMsg.text + '\n\n';
		});
		botTelegram.sendMessage(msg.from.id, messageSend).then().catch();
	}
});

botTelegram.onText(/(.*)#(водитель|водій)(.+)/i, function (msg, match) {
	if (!msg.from.is_bot){
		if (!arrayDrivers.hasOwnProperty(msg.from.id)) {
			arrayDrivers[msg.from.id] = [];
		}
		arrayDrivers[msg.from.id].push(
			{
				'user' : msg.from.first_name + ' ( ' + msg.from.username + ' ) ',
				'fromId' : msg.from.id,
				'chatId' : msg.chat.id,
				'date' : new Date().toLocaleString(),
				'text' : match[1] + '\n' + match[3],
			});
		botTelegram.sendMessage(msg.from.id, 'Вас додано до бази даних водіїв: \n' + match[3]).then().catch();
		fs.writeFile('drivers.json', JSON.stringify(arrayDrivers), 'utf8', function(err) {if (err) throw err;console.log(err);});
	}
});

botTelegram.onText(/(.*)#(медработник|врач|лікар|медсестра)(.+)/i, function (msg, match) {
	if (!msg.from.is_bot){
		if (!arrayDoctors.hasOwnProperty(msg.from.id)) {
			arrayDoctors[msg.from.id] = [];
		}
		arrayDoctors[msg.from.id].push(
			{
				'user' : msg.from.first_name + ' ( ' + msg.from.username + ' ) ',
				'fromId' : msg.from.id,
				'chatId' : msg.chat.id,
				'date' : new Date().toLocaleString(),
				'text' : match[1] + '\n' + match[3],
			});
		botTelegram.sendMessage(msg.from.id, 'Вас додано до бази даних медперсоналу: \n' + match[3]).then().catch();
		fs.writeFile('doctors.json', JSON.stringify(arrayDoctors), 'utf8', function(err) {if (err) throw err;console.log(err);});
	}
});

// Простая команда без параметров
botTelegram.on('message', function (msg) {
	if (msg.text.match(/^#(водитель|водій)(.+)$/)) {
		// console.log(msg.text);
		// console.log(msg.from);
		// console.log(msg.chat);
	}
	// console.log(msg);
	// console.log(msg.text);
	// console.log(msg.from);
	// console.log(msg.chat);
});
//----------------------------------------------------------------------------------------------------------------------
//------------ VIBER EVENTS --------------------------------------------------------------------------------------------
botViber.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
	onFinish(menu.getStartMenu(), {
		saidThanks: true
	})
);

botViber.on(ViberBotEvents.MESSAGE_RECEIVED, (botMessage, botResponse) => {
	// set All input text - Unknown
	let fUnknownMessage = true;
	let botLogin = botResponse.userProfile.id;
	menu.log(botMessage.text, botLogin);
	// IF USER NOT REGISTERED
	if (!selectedMenus.hasOwnProperty(botLogin)) {
		selectedMenus[botLogin] = menu.c.MENU_HOME;
	}
	// CHECK TEXT IF MENU
	if (menu.checkMenu(botMessage.text)) {
		selectedMenus[botLogin] = botMessage.text;
		// если введенный текст - меню - не записываем текст как неизвестный
		fUnknownMessage = false;
	}
	// IN HOME MENU
	if (selectedMenus[botLogin] === menu.c.MENU_HOME || selectedMenus[botLogin] === menu.c.MENU_START) {
		botResponse.send(menu.t(menu.c.MSG_HOME_DESCRIPTION)).then(() => {
			botResponse.send(menu.t(menu.c.MSG_SELECT_BUTTON_DESCRIPTION)).then(() => {
				botResponse.send(menu.getMainMenu(botLogin === adminAccountViber));
			});
		});
	}

	// IN DRIVER MENU
	if (selectedMenus[botLogin] === menu.c.MENU_HOME_DRIVER) {
		botResponse.send(menu.t(menu.c.MSG_SELECT_BUTTON_DESCRIPTION)).then(() => {
			botResponse.send(menu.getDriverMenu());
		});
	}

	// IN DOCTOR MENU
	if (selectedMenus[botLogin] === menu.c.MENU_HOME_DOCTOR) {
		botResponse.send(menu.t(menu.c.MSG_SELECT_BUTTON_DESCRIPTION)).then(() => {
			botResponse.send(menu.getDoctorMenu());
		});
	}

	// IN REGISTER DOCTOR MENU
	if (selectedMenus[botLogin] === menu.c.MENU_REGISTER_MESSAGE_DOCTOR) {
		// if select menu - clear registration data
		let textSectors = '';
		menu.c.LIST_SECTORS_ACTIVE.forEach(item => textSectors += (textSectors ? ', ' : '' ) + item);
		if (botMessage.text === menu.c.MENU_REGISTER_MESSAGE_DOCTOR) {
			fUnknownMessage = false;
			dataRegistrationAccount[botLogin] = {};
			for (let key in  menu.queryRegisterMessage) {
				dataRegistrationAccount[botLogin][key] = menu.queryRegisterMessage[key];
			}
			botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__INFO)).then(() => {
				botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__FROM_SECTOR + '\n' + textSectors)).then(() => {
					botResponse.send(menu.getCancelMenu());
				});
			});
		}
		// if input text after select menu
		if (botMessage.text !== menu.c.MENU_REGISTER_MESSAGE_DOCTOR) {
			menu.log(dataRegistrationAccount[botLogin], botLogin);
			let messageToSend = menu.c.MSG_REGISTER_MESSAGE__FROM_SECTOR;
			if (dataRegistrationAccount[botLogin].from_sector === '' && dataRegistrationAccount[botLogin].from_address === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__FROM_DETAILS;
				dataRegistrationAccount[botLogin].from_sector = botMessage.text;
			} else if (dataRegistrationAccount[botLogin].from_sector !== '' && dataRegistrationAccount[botLogin].from_address === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__TO_SECTOR  + '\n' + textSectors;
				dataRegistrationAccount[botLogin].from_address = botMessage.text;
			} else if (dataRegistrationAccount[botLogin].from_address !== '' && dataRegistrationAccount[botLogin].to_sector === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__TO_DETAILS;
				dataRegistrationAccount[botLogin].to_sector = botMessage.text;
			} else if (dataRegistrationAccount[botLogin].to_sector !== '' && dataRegistrationAccount[botLogin].to_address === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__TIME;
				dataRegistrationAccount[botLogin].to_address = botMessage.text;
			} else if (dataRegistrationAccount[botLogin].to_address !== '' && dataRegistrationAccount[botLogin].time === '') {
				if (botMessage.text.match(/^[0-9]{2}-[0-9]{2}$/)) {
					fUnknownMessage = false;
					messageToSend = '';
					dataRegistrationAccount[botLogin].time = botMessage.text;
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__TIME_PERIOD)).then(() => {
						botResponse.send(menu.getTimePeriodMenu());
					});
				} else {
					messageToSend = menu.c.MENU_CONFIG_WRONG_INPUT_FORMAT + menu.c.MSG_REGISTER_MESSAGE__TIME;
				}
			} else if (dataRegistrationAccount[botLogin].time !== '' && dataRegistrationAccount[botLogin].time_period === '') {
				if (botMessage.text.indexOf(menu.c.MENU_REGISTER_MESSAGE__TIME_PERIOD) !== -1) {
					fUnknownMessage = false;
					messageToSend = menu.c.MSG_REGISTER_MESSAGE__PHONE;
					dataRegistrationAccount[botLogin].time_period = botMessage.text.substring(menu.c.MENU_REGISTER_MESSAGE__TIME_PERIOD.length);
				} else {
					messageToSend = '';
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__TIME_PERIOD)).then(() => {
						botResponse.send(menu.getTimePeriodMenu());
					});
				}
			} else if (dataRegistrationAccount[botLogin].time_period !== '' && dataRegistrationAccount[botLogin].phone === '') {
				if (botMessage.text.match(/^0[1-9][0-9]{8}$/)) {
					fUnknownMessage = false;
					messageToSend = '';
					dataRegistrationAccount[botLogin].phone = '+38' + botMessage.text;
					let messageSendToTelegram = 'Повідомлення з [Viber]:\n' +
						'👥 #Медпрацівник: ' + botResponse.userProfile.name + ' (' + dataRegistrationAccount[botLogin].phone + ')\n' +
						'👉 просить підвезти його з: #' + dataRegistrationAccount[botLogin].from_sector + ' (' + dataRegistrationAccount[botLogin].from_address + ')\n' +
						'➡ до: #' + dataRegistrationAccount[botLogin].to_sector + ' (' + dataRegistrationAccount[botLogin].to_address + ')\n' +
						'🕰 приблизно о: ' + dataRegistrationAccount[botLogin].time + ' (📆 ' + dataRegistrationAccount[botLogin].time_period + ')\n 🤳 Дякую.\n'
					if (!arrayDoctors.hasOwnProperty(botLogin)) {
						arrayDoctors[botLogin] = [];
					}
					arrayDoctors[botLogin].push(
						{
							'user' : botResponse.userProfile.name,
							'fromId' : botLogin,
							'chatId' : 'viber-BOT',
							'date' : new Date().toLocaleString(),
							'text' : messageSendToTelegram,
						});
					fs.writeFile('doctors.json', JSON.stringify(arrayDoctors), 'utf8', function(err) {if (err) throw err;console.log(err);});
					botTelegram.sendMessage(chatIdTelegram, messageSendToTelegram).then().catch();
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__SUCCESS)).then(() => {
						selectedMenus[botLogin] = menu.c.MENU_REGISTER_MESSAGE_DOCTOR;
						botResponse.send(menu.getDoctorMenu());
					});
				} else {
					messageToSend = menu.c.MENU_CONFIG_WRONG_INPUT_FORMAT + menu.c.MSG_REGISTER_MESSAGE__PHONE;
				}
			}
			menu.log(dataRegistrationAccount[botLogin], botLogin);
			if (messageToSend) {
				botResponse.send(menu.t(messageToSend)).then(() => {
					botResponse.send(menu.getCancelMenu());
				});
			}
		}

	}
	// IN REGISTER DRIVER MENU
	if (selectedMenus[botLogin] === menu.c.MENU_REGISTER_MESSAGE_DRIVER) {
		// if select menu - clear registration data
		let textSectors = '';
		menu.c.LIST_SECTORS_ACTIVE.forEach(item => textSectors += (textSectors ? ', ' : '' ) + item);
		if (botMessage.text === menu.c.MENU_REGISTER_MESSAGE_DRIVER) {
			fUnknownMessage = false;
			dataRegistrationAccount[botLogin] = {};
			for (let key in  menu.queryRegisterMessage) {
				dataRegistrationAccount[botLogin][key] = menu.queryRegisterMessage[key];
			}
			botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__INFO)).then(() => {
				botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__FROM_SECTOR  + '\n' + textSectors + '\n' + menu.c.MSG_REGISTER_MESSAGE_SECTOR_DESCRIPTION)).then(() => {
					botResponse.send(menu.getCancelMenu());
				});
			});
		}
		// if input text after select menu
		if (botMessage.text !== menu.c.MENU_REGISTER_MESSAGE_DRIVER) {
			menu.log(dataRegistrationAccount[botLogin], botLogin);
			let messageToSend = menu.c.MSG_REGISTER_MESSAGE__FROM_SECTOR;
			if (dataRegistrationAccount[botLogin].from_sector === '' && dataRegistrationAccount[botLogin].to_sector === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__TO_SECTOR + '\n' + textSectors + '\n' + menu.c.MSG_REGISTER_MESSAGE_SECTOR_DESCRIPTION;
				let sectorsToMessage = '';
				botMessage.text.split(',').forEach(item => sectorsToMessage += (sectorsToMessage ? ', ' : '' ) + '#' + item.trim());
				dataRegistrationAccount[botLogin].from_sector = sectorsToMessage;
			} else if (dataRegistrationAccount[botLogin].from_sector !== '' && dataRegistrationAccount[botLogin].to_sector === '') {
				fUnknownMessage = false;
				messageToSend = menu.c.MSG_REGISTER_MESSAGE__TIME;
				let sectorsToMessage = '';
				botMessage.text.split(',').forEach(item => sectorsToMessage += (sectorsToMessage ? ', ' : '' ) + '#' + item.trim());
				dataRegistrationAccount[botLogin].to_sector = sectorsToMessage;
			} else if (dataRegistrationAccount[botLogin].to_sector !== '' && dataRegistrationAccount[botLogin].time === '') {
				if (botMessage.text.match(/^[0-9]{2}-[0-9]{2}$/)) {
					fUnknownMessage = false;
					messageToSend = menu.c.MSG_REGISTER_MESSAGE__TIME_TO;
					dataRegistrationAccount[botLogin].time = botMessage.text;
				} else {
					messageToSend = menu.c.MENU_CONFIG_WRONG_INPUT_FORMAT + menu.c.MSG_REGISTER_MESSAGE__TIME;
				}
			} else if (dataRegistrationAccount[botLogin].time !== '' && dataRegistrationAccount[botLogin].time_to === '') {
				if (botMessage.text.match(/^[0-9]{2}-[0-9]{2}$/)) {
					fUnknownMessage = false;
					messageToSend = '';
					dataRegistrationAccount[botLogin].time_to = botMessage.text;
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__TIME_PERIOD)).then(() => {
						botResponse.send(menu.getTimePeriodMenu());
					});
				} else {
					messageToSend = menu.c.MENU_CONFIG_WRONG_INPUT_FORMAT + menu.c.MSG_REGISTER_MESSAGE__TIME_TO;
				}
			} else if (dataRegistrationAccount[botLogin].time !== '' && dataRegistrationAccount[botLogin].time_period === '') {
				if (botMessage.text.indexOf(menu.c.MENU_REGISTER_MESSAGE__TIME_PERIOD) !== -1) {
					fUnknownMessage = false;
					messageToSend = menu.c.MSG_REGISTER_MESSAGE__PHONE;
					dataRegistrationAccount[botLogin].time_period = botMessage.text.substring(menu.c.MENU_REGISTER_MESSAGE__TIME_PERIOD.length);
				} else {
					messageToSend = '';
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__TIME_PERIOD)).then(() => {
						botResponse.send(menu.getTimePeriodMenu());
					});
				}
			} else if (dataRegistrationAccount[botLogin].time_period !== '' && dataRegistrationAccount[botLogin].phone === '') {
				if (botMessage.text.match(/^0[1-9][0-9]{8}$/)) {
					fUnknownMessage = false;
					messageToSend = '';
					dataRegistrationAccount[botLogin].phone = '+38' + botMessage.text;
					let messageSendToTelegram = 'Повідомлення з [Viber]:\n' +
						'🚗 #Водій: ' + botResponse.userProfile.name + ' ( ' + dataRegistrationAccount[botLogin].phone + ' ) має можливість безкоштовно підвезти медпрацівника\n' +
						'👉 ' + dataRegistrationAccount[botLogin].from_sector + ' ➡ ' + dataRegistrationAccount[botLogin].to_sector + '\n' +
						'📆 ' + dataRegistrationAccount[botLogin].time_period + '\n' +
						'🕰 час: ' + dataRegistrationAccount[botLogin].time + ' по ' + dataRegistrationAccount[botLogin].time_to + '\n'
					if (!arrayDrivers.hasOwnProperty(botLogin)) {
						arrayDrivers[botLogin] = [];
					}
					arrayDrivers[botLogin].push(
						{
							'user' : botResponse.userProfile.name,
							'fromId' : botLogin,
							'chatId' : 'viber-BOT',
							'date' : new Date().toLocaleString(),
							'text' : messageSendToTelegram,
						});
					fs.writeFile('drivers.json', JSON.stringify(arrayDrivers), 'utf8', function(err) {if (err) throw err;console.log(err);});
					botTelegram.sendMessage(chatIdTelegram, messageSendToTelegram).then().catch();
					botResponse.send(menu.t(menu.c.MSG_REGISTER_MESSAGE__SUCCESS)).then(() => {
						selectedMenus[botLogin] = menu.c.MENU_REGISTER_MESSAGE_DRIVER;
						botResponse.send(menu.getDriverMenu());
					});
				} else {
					messageToSend = menu.c.MENU_CONFIG_WRONG_INPUT_FORMAT + menu.c.MSG_REGISTER_MESSAGE__PHONE;
				}
			}
			menu.log(dataRegistrationAccount[botLogin], botLogin);
			if (messageToSend) {
				botResponse.send(menu.t(messageToSend)).then(() => {
					botResponse.send(menu.getCancelMenu());
				});
			}
		}

	}
	// SHOW DOCTORS
	if (botMessage.text === menu.c.MENU_LIST_MESSAGES_DOCTORS) {
		let arrayDoctorsCount = 0;
		for (const doctorId in arrayDoctors) {
			let messageSend = '';
			let messageUser = '';
			let ifLastMessage = arrayDrivers.length >= arrayDoctorsCount;
			arrayDoctorsCount++;
			arrayDoctors[doctorId].forEach(function (doctorMsg) {
					if (!messageUser){
						messageUser = 'Медперсонал @' + doctorMsg.user + ' писав: \n';
					}
					if (new Date(new Date(doctorMsg.date).getTime() + 86400000).toLocaleDateString('fr-CA') >= new Date().toLocaleDateString('fr-CA')){
						messageSend += '*' + doctorMsg.date + ' : ' + doctorMsg.text + '\n\n';
					}
			});
			if (messageSend || ifLastMessage){
				if (!messageSend) messageSend = menu.c.MSG_SELECT_BUTTON_DESCRIPTION; else messageSend = messageUser + messageSend;
				botResponse.send(menu.t(messageSend)).then(() => {
					if (ifLastMessage)	botResponse.send(menu.getDriverMenu());
				});
			}
		}
	}

	// SHOW DRIVERS
	if (botMessage.text === menu.c.MENU_LIST_MESSAGES_DRIVERS) {
		let arrayDriversCount = 0;
		for (const driverId in arrayDrivers) {
			let messageSend = '';
			let messageUser = '';
			let ifLastMessage = arrayDrivers.length >= arrayDriversCount;
			arrayDriversCount++;
			arrayDrivers[driverId].forEach(function (driverMsg) {
					if (!messageUser){
						messageUser = 'Водій @' + driverMsg.user + ' писав: \n';
					}
					if (new Date(new Date(driverMsg.date).getTime() + 86400000).toLocaleDateString('fr-CA') >= new Date().toLocaleDateString('fr-CA')){
						messageSend += '*' + driverMsg.date + ' : ' + driverMsg.text + '\n\n';
					}
			});
			if (messageSend || ifLastMessage){
				if (!messageSend) messageSend = menu.c.MSG_SELECT_BUTTON_DESCRIPTION; else messageSend = messageUser + messageSend;
				botResponse.send(menu.t(messageSend)).then(() => {
					if (ifLastMessage)	botResponse.send(menu.getDoctorMenu());
				});
			}
		}
	}

	if (fUnknownMessage){
		menu.log('INPUT ERROR TEXT', botLogin);
	}
	menu.log('selected menu: ' + selectedMenus[botLogin], botLogin);
	//console.log(botMessage);
	//console.log(botResponse);
	//console.log(botResponse.userProfile);
});

if (botViberHttpsOptions !== undefined){
	const http = require('https');
	//http.createServer(botViberHttpsOptions, botViber.middleware()).listen(botViberServerPort, () => botViber.setWebhook(botViberServerUrl));
} else {
	const http = require('http');
	//http.createServer(botViber.middleware()).listen(botViberServerPort, () => botViber.setWebhook(botViberServerUrl));
}
