const KeyboardMessage = require('viber-bot').Message.Keyboard;
const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const UrlMessage = require('viber-bot').Message.Url;

const CONSTANT = {
    MSG_SELECT_BUTTON_DESCRIPTION: 'Для подальшої роботи оберіть необхідний пункт меню',
    MSG_HOME_DESCRIPTION: 'Бот для групи [Help Doctor Sumy] - група допомоги мердпрацівникам м.Суми.',

    MENU_START: 'ПОЧАТИ РОБОТУ',
    MENU_HOME: 'ГОЛОВНЕ МЕНЮ',
    MENU_HOME_DRIVER: 'Я - ВОДІЙ',
    MENU_HOME_DOCTOR: 'Я - МЕДПЕРСОНАЛ',

    MENU_REGISTER_MESSAGE_DRIVER: 'ЗАРЕЕСТРУВАТИ ПОВІДОМЛЕННЯ ЯК ВОДІЯ',
    MENU_REGISTER_MESSAGE_DOCTOR: 'ЗАРЕЕСТРУВАТИ ПОВІДОМЛЕННЯ ЯК МЕДИКА',
    MENU_LIST_MESSAGES_DRIVERS: 'ПЕРЕГЛЯНУТИ ПОВІДОМЛЕННЯ ВОДІЇВ',
    MENU_LIST_MESSAGES_DOCTORS: 'ПЕРЕГЛЯНУТИ ПОВІДОМЛЕННЯ МЕДПЕРСОНАЛУ',
    MENU_ADMIN: 'АДМИНКА',

    LIST_SECTORS_ACTIVE: [
        'БАСЫ',
        'БЕЛОПОЛЬСКАЯ',
        'ВЕРЕТИНОВКА',
        'МЕТАЛЛУРГОВ',
        'КОВПАКА',
        'КУРСКАЯ',
        'КОСОВЩИНА',
        'ЛУШПЫ',
        'ПЕСЧАНОЕ',
        'ПРОКОФЬЕВА',
        'РОМЕНСКАЯ',
        'ТОПОЛЯ',
        'ЦЕНТР',
        'ЧЕРЕПИНА',
        'ХИМГОРОДОК',
        'ХАРЬКОВСКАЯ',
        'ЦЕНТР',
    ],
    LIST_SECTORS_ALL: [
        'АННОВКА',
        'АВТОВОКЗАЛ',
        'БАСЫ',
        'БАРАНОВКА',
        'БЕЛОПОЛЬСКАЯ',
        'ВЕРЕТИНОВКА',
        'ВАВИЛОВА',
        'ГАЛИЦКАЯ',
        'ДОБРОВОЛЬНАЯ',
        'ИЛЬИНСКАЯ',
        'КОВПАКА',
        'КУРСКАЯ',
        'КИРОВА',
        'КОСОВЩИНА',
        'КРИНИЧНАЯ',
        'ЛУКА',
        'ЛУШПЫ',
        'ЛИНЕЙНАЯ',
        'ЛИПНЯК',
        'МЕТАЛЛУРГОВ',
        'ПЕСЧАНОЕ НИЖНЕЕ',
        'ПЕСЧАНОЕ ВЕРХНЕЕ',
        'ПРОКОФЬЕВА',
        'ПРИШИБ',
        'ПРОСПЕКТ',
        'РОМЕНСКАЯ',
        'РАДЬКОВКА',
        'САД',
        'СКД',
        'СТЕЦКОВКА',
        'СТЕПАНОВКА',
        'ТОКАРИ',
        'ТОПОЛЯ',
        'ТОРОПИЛОВКА',
        'ТРОИЦКАЯ',
        'ЧЕРЕПИНА',
        'ХИМГОРОДОК',
        'ХИМПРОМ',
        'ХАРЬКОВСКАЯ',
        'ЦГБ',
        'ЦЕНТР',
        'ЧЕРНЕТЧИНА',
    ],
    MSG_REGISTER_MESSAGE__INFO: 'З метою уникнення ситуацій із внесенням завідома некоректних даних - будь ласка, вводьте їх відповідно до підказок.',
    MSG_REGISTER_MESSAGE__FROM_SECTOR: 'Введіть РАЙОН ПОЧАТКУ МАРШРУТУ, наприклад: ',
    MSG_REGISTER_MESSAGE_SECTOR_DESCRIPTION: 'Якщо бажаєте ввести декілька секторів - вводьте через кому. Якщо по всьму городу - ПОМІСТУ. Хештеги не треба - додадуться автоматично',
    MSG_REGISTER_MESSAGE__FROM_SECTOR_ALL: 'ПОМІСТУ',
    MSG_REGISTER_MESSAGE__FROM_DETAILS: 'Введіть ДЕТАЛЬНУ АДРЕСУ або ОРИЄНТИР початку маршруту',
    MSG_REGISTER_MESSAGE__TO_SECTOR: 'Введіть РАЙОН ЗАВЕРШЕННЯ МАРШРУТУ, наприклад: ',
    MSG_REGISTER_MESSAGE__TO_DETAILS: 'Введіть ДЕТАЛЬНУ АДРЕСУ  або ОРИЄНТИР завершення маршруту',
    MSG_REGISTER_MESSAGE__TIME: 'Введіть ПРИБЛИЗНИЙ ЧАС виїзду (наприклад 07-10)',
    MSG_REGISTER_MESSAGE__TIME_TO: 'Введіть ПРИБЛИЗНИЙ ЧАС завершення (наприклад 22-10)',
    MSG_REGISTER_MESSAGE__TIME_PERIOD: 'Виберіть ПЕРІОДИЧНІСТЬ',
    MSG_REGISTER_MESSAGE__PHONE: 'Введіть НОМЕР ТЕЛЕФОНУ\n(у форматі 09911112233)',
    MSG_REGISTER_MESSAGE__SUCCESS: 'Повідомлення додано в базу та надіслано в группу',
    MENU_REGISTER_MESSAGE__TIME_PERIOD_TODAY: 'ЛИШЕ СЬОГОДНІ',
    MENU_REGISTER_MESSAGE__TIME_PERIOD_TOMORROW: 'ЛИШЕ ЗАВТРА',
    MENU_REGISTER_MESSAGE__TIME_PERIOD_EVERYDAY: 'КОЖЕН ДЕНЬ',

    MENU_REGISTER_MESSAGE__TIME_PERIOD: 'MENU_REGISTER_MESSAGE__TIME_PERIOD:',

    MENU_API_RESPONSE_WAIT: 'Обробка даних. Будь-ласка, зачекайте...',
    MENU_API_RESPONSE_ERROR: 'Виникла непередбачувана помилка сервісу. Повторіть спробу трохи пізніше',
    MENU_CONFIG_WRONG_INPUT_FORMAT: 'Некоректне значення. \n',

    MENU_ACCOUNTS: 'ОСОБОВІ РАХУНКИ',
    MENU_ADMIN_SEND_MESSAGE_ALL_USERS: 'ВІДПРАВИТИ ВСІМ ПОВІДОМЛЕННЯ',
    MENU_ADMIN_SEND_MESSAGE_ALL_USERS_DESCRIPTION: 'Введіть текст повідомлення, який бажаєте відправити всім користувачам цього бота \n (картинка - url до 1М та jpg)',
    MENU_SERVICES_BILLING: 'ПОТОЧНІ НАРАХУВАНЯ',
    MENU_SERVICES_PAYMENT_HISTORY: 'ІСТОРІЯ ОПЛАТ',
    MENU_DEVICES_INDICATION: 'ПОКАЗАННЯ ЛІЧИЛЬНИКІВ',
    MENU_CONFIG: 'НАЛАШТУВАННЯ',
    MENU_CONFIG_ADD_ACCOUNT: 'ДОДАТИ ОСОБОВИЙ РАХУНОК',
    MENU_CONFIG_REMOVE_ACCOUNT: 'ВИДАЛИТИ ОСОБОВИЙ РАХУНОК',
    MENU_STATUS_GLOBAL: 'СТАН',
    MENU_PAYMENTS_PAY: 'СПЛАТИТИ',
    MENU_ACCOUNT_PREFIX: 'РАХУНОК: ',
    MENU_ACCOUNT_SERVICE_PREFIX: 'ПОСЛУГА: ',
    MENU_DEVICE_INDICATION_SET_PREFIX: 'ПЕРЕДАТИ ПОКАЗАННЯ ДЛЯ: ',
    MENU_DEVICE_INDICATION_SET_ACTION: 'DEVICE_INDICATION_SET:',
    MENU_ACCOUNT_PAYMENT_PREFIX: 'ІСТОРІЯ ОПЛАТ ЗА: ',
    MENU_DIALOG_CONFIRM_YES: 'DIALOG_CONFIRM_YES:',
    MENU_DIALOG_CANCEL: 'СКАСУВАТИ',
};

module.exports.c = CONSTANT;
let queryRegisterMessage = {
    from_sector : '',
    from_address : '',
    to_sector : '',
    to_address : '',
    time : '',
    time_from : '',
    time_to : '',
    time_period : '',
    phone : '',
};

module.exports.queryRegisterMessage = queryRegisterMessage;

module.exports.t = function (text) {
    return new TextMessage(text);
};

module.exports.tPicture = function (url) {
    return new PictureMessage(url);
};

module.exports.tUrl = function (url) {
    return new UrlMessage(url);
};

module.exports.checkMenu = function (menu) {
    return (
        menu === CONSTANT.MENU_START ||
        menu === CONSTANT.MENU_HOME ||
        menu === CONSTANT.MENU_ADMIN ||
        menu === CONSTANT.MENU_HOME_DRIVER ||
        menu === CONSTANT.MENU_HOME_DOCTOR ||
        menu === CONSTANT.MENU_REGISTER_MESSAGE_DRIVER ||
        menu === CONSTANT.MENU_REGISTER_MESSAGE_DOCTOR ||
        menu === CONSTANT.MENU_CONFIG
    )
};

module.exports.getStartMenu = function () {
    return renderMenu([
        CONSTANT.MENU_START,
    ]);
};

module.exports.getMainMenu = function (ifAdmin = false) {
    let menu = [];
    menu.push(CONSTANT.MENU_HOME_DRIVER);
    menu.push(CONSTANT.MENU_HOME_DOCTOR);
    if (ifAdmin){
        menu.push(CONSTANT.MENU_ADMIN);
    }
    return renderMenu(menu);
};

module.exports.getDriverMenu = function () {
    return renderMenu([
        CONSTANT.MENU_REGISTER_MESSAGE_DRIVER,
        CONSTANT.MENU_LIST_MESSAGES_DOCTORS,
        CONSTANT.MENU_HOME,
    ]);
};

module.exports.getDoctorMenu = function () {
    return renderMenu([
        CONSTANT.MENU_REGISTER_MESSAGE_DOCTOR,
        CONSTANT.MENU_LIST_MESSAGES_DRIVERS,
        CONSTANT.MENU_HOME,
    ]);
};

module.exports.getConfigMenu = function () {
    return renderMenu([
        CONSTANT.MENU_CONFIG_ADD_ACCOUNT,
        CONSTANT.MENU_CONFIG_REMOVE_ACCOUNT,
        CONSTANT.MENU_HOME,
    ]);
};

module.exports.getAdminMenu = function () {
    return renderMenu([
        CONSTANT.MENU_ADMIN_SEND_MESSAGE_ALL_USERS,
        CONSTANT.MENU_HOME,
    ]);
};

module.exports.getEmptyMenu = function () {
    return renderMenu([
        CONSTANT.MENU_HOME,
    ]);
};

module.exports.getTimePeriodMenu = function () {
    let menu = [];

    menu.push({
        name: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD_TODAY,
        color: '#f7d7dd',
        action: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD + 'СЬОГОДНІ ( #' + new Date().toLocaleDateString('fr-CA') + ' )',
        columns: 6
    });
    menu.push({
        name: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD_TOMORROW,
        color: '#f7ebca',
        action: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD + 'ЗАВТРА ( #' + new Date(new Date().getTime() + 86400000).toLocaleDateString('fr-CA') + ' )',
        columns: 6
    });
    menu.push({
        name: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD_EVERYDAY,
        color: '#ccf7bb',
        action: CONSTANT.MENU_REGISTER_MESSAGE__TIME_PERIOD + '#КОЖЕНДЕНЬ',
        columns: 6
    });
    menu.push(CONSTANT.MENU_DIALOG_CANCEL);
    return renderMenu(menu);
};

module.exports.getUserAccountServicesMenu = function () {
    let menu = [];
    menu.push(CONSTANT.MENU_SERVICES_PAYMENT_HISTORY);
    menu.push(CONSTANT.MENU_DEVICES_INDICATION);
    menu.push(CONSTANT.MENU_ACCOUNTS);
    return renderMenu(menu);
};

module.exports.getUserAccountDevicesMenu = function (devices) {
    let menu = [];
    for (const deviceId in devices) {
        menu.push({
            name: CONSTANT.MENU_DEVICE_INDICATION_SET_PREFIX + devices[deviceId],
            color: '#bbc7f7',
            action: CONSTANT.MENU_DEVICE_INDICATION_SET_ACTION + deviceId + ':' + devices[deviceId],
            columns: 6
        });
    }
    menu.push(CONSTANT.MENU_SERVICES_BILLING);
    menu.push(CONSTANT.MENU_ACCOUNTS);
    return renderMenu(menu);
};

module.exports.getCancelMenu = function (menuCancel = CONSTANT.MENU_HOME) {
    let menu = [];
    menu.push({
        name: CONSTANT.MENU_DIALOG_CANCEL,
        color: '#f791a4',
        action: menuCancel,
        columns: 6
    });
    return renderMenu(menu);
};

module.exports.getConfirmMenu = function (confirmId, menuCancel = CONSTANT.MENU_HOME) {
    let menu = [];
    menu.push({
        name: 'Так',
        color: '#f791a4',
        action: CONSTANT.MENU_DIALOG_CONFIRM_YES + confirmId,
        columns: 3
    });
    menu.push({
        name: 'Ні',
        color: '#bfd6f7',
        action: menuCancel,
        columns: 3
    });
    return renderMenu(menu);
};

function renderMenu (menuArray) {
    let menuObject = {
        'Type': 'keyboard',
        'Buttons': []
    };
    menuArray.forEach(function (menuItem) {
        let menuName = '';
        let menuAction = '';
        let menuColumns = 6;
        let bgColor = '#bfd6f7';

        if (typeof menuItem === 'object'){
            menuName = menuItem.name;
            if (menuItem.columns !== undefined){
                menuColumns = menuItem.columns;
            }
            if (menuItem.color !== undefined){
                bgColor = menuItem.color;
            }
            if (menuItem.action !== undefined){
                menuAction = menuItem.action;
            }
        } else {
            menuName = menuItem;
            menuAction = menuItem;
        }
        if (menuName === CONSTANT.MENU_CONFIG) bgColor = '#f76766';
        if (menuName === CONSTANT.MENU_HOME) bgColor = '#efa5f7';
        if (menuName === CONSTANT.MENU_HOME_DOCTOR) bgColor = '#9ff7a4';
        if (menuName === CONSTANT.MENU_LIST_MESSAGES_DOCTORS) bgColor = '#9ff7a4';
        if (menuName === CONSTANT.MENU_CONFIG_REMOVE_ACCOUNT) bgColor = '#f791a4';
        if (menuName === CONSTANT.MENU_DIALOG_CANCEL) bgColor = '#f791a4';
        if (menuName === CONSTANT.MENU_ACCOUNTS) bgColor = '#f7bb3f';
        if (menuName === CONSTANT.MENU_LIST_MESSAGES_DRIVERS) bgColor = '#f7bb3f';
        menuObject.Buttons.push({
            'Columns': menuColumns,
            'Rows': 1,
            'Text': '<font color="#494E67">' + menuName + '</font>',
            'TextSize': 'large',
            'TextHAlign': 'center',
            'TextVAlign': 'middle',
            'ActionType': 'reply',
            'ActionBody': menuAction,
            'BgColor': bgColor,
        });
    });
    return new KeyboardMessage(menuObject);
}

module.exports.log = function (messageText, userId) {
    //console.log(typeof messageText);
    console.log(
        new Date().toLocaleString()
        + ( userId !== undefined ?  ' [USER:'+ userId + ']>' : '>' )
        +  ( ( typeof messageText === 'string' ||  typeof messageText === 'number' ) ? messageText : '')
    );
    if (typeof messageText === 'object') {
        if (messageText.hasOwnProperty('request') && messageText.hasOwnProperty('response')){
            // api error response
            console.log(
                '***** REQUEST ERROR: ' + messageText.response.statusText + ' [' + messageText.response.status + ']\n'
                + '>' + messageText.response.config.method + ' ' + messageText.response.config.url
            );
            console.log('ERROR API:');
            console.log(messageText.response.data);
            console.log('RESPONSE DATA:');
            console.log(messageText.response.config.data);
            console.log('RESPONSE HEADERS:');
            console.log(messageText.response.config.headers);
            console.log('*****\n');
        } else {
            console.log(messageText);
        }
    }
};
