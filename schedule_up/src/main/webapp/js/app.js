var MENU_STATES = {
    COLLAPSED: 0,
    EXPANDED: 1
};
var menuState = MENU_STATES.COLLAPSED;

var userData = null;
var companyData = null;

var menuActions = function (id) {

    switch (id) {
        case "company":
            companyView.selectPanel();
            break;
        case "building":
            buildingView.selectPanel();
            break;
        case "note":
            noteView.selectPanel();
            break;
        case "settings":
            companySettingsView.selectPanel();
            break;
        case "room":
            roomView.selectPanel();
            break;
        case "gear":
            gearView.selectPanel();
            break;
        case "logger":
            loggerView.selectPanel();
            break;
        case "dashboard":
            dashboardView.selectPanel();
            break;
    }
};

var menuSuperAdmin = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    }
];

var menuAdmin = [
    {
        id: "dashboard",
        value: "Početna",
        icon: "home"
    },
    {
        id: "building",
        value: "Zgrade",
        icon: "building"
    },
    {
        id: "note",
        value: "Oglasi",
        icon: "sticky-note"
    },
    {
        id: "settings",
        value: "Podešavanja",
        icon: "cog"
    },
    {
        id: "room",
        value: "Sale",
        icon: "cube"
    },
    {
        id: "gear",
        value: "Oprema",
        icon: "wrench"
    }, {
        id: "logger",
        value: "Logovi",
        icon: "history"
    }
];

var menuAdvancedUser = [
    {
        id: "dashboard",
        value: "Početna",
        icon: "home"
    },
];

var menuUser = [
    {
        id: "dashboard",
        value: "Početna",
        icon: "home"
    },
];

var panel = {id: "empty"};
var rightPanel = null;

var init = function () {
    if (!webix.env.touch && webix.ui.scrollSize) webix.CustomScroll.init();
    webix.ui(panel);
    panel = $$("empty");
    webix.ajax("user/state", {
        error: function (text, data, xhr) {
            if (xhr.status == 403) {
                showLogin();
            }
        },
        success: function (text, data, xhr) {
            if (xhr.status == "200") {
                if (data.json() != null && data.json().id != null) {
                    userData = data.json();
                    webix.ajax().get("company/" + userData.companyId, {
                        success: function (text, data, xhr) {
                            var company = data.json();
                            if (company != null) {
                                companyData = company;
                                companyData.deleted = 0;
                                showApp();
                            } else {
                                connection.reload();

                            }
                        },
                        error: function (text, data, xhr) {
                            connection.reload();

                        }
                    });
                }
                else {
                    //TODO SHOW ERROR MESSAGE
                }
            } else {
                //TODO ERROR LOGIN
            }
        }
    });
};

var loginLayout = {
    id: "login",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [
                {},
                {
                    height: 60,
                    view: "label",
                    label: "Schedule Up",
                    css: "appNameLabel"
                }
            ]

        },
        {
            cols: [
                {},
                {
                    view: "form",
                    id: "loginForm",
                    width: 400,
                    elementsConfig: {
                        labelWidth: 140,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            id: "username",
                            name: "username",
                            view: "text",
                            label: "Korisničko ime",
                            invalidMessage: "Korisničke ime je obavezno!",
                            required: true
                        },
                        {
                            id: "password",
                            name: "password",
                            view: "text",
                            type: "password",
                            label: "Lozinka",
                            invalidMessage: "Lozinka je obavezna!",
                            required: true
                        },
                        {
                            id: "companyName",
                            name: "companyName",
                            view: "text",
                            label: "Kompanija"
                        }, {
                            margin: 5,
                            cols: [{}, {
                                id: "loginBtn",
                                view: "button",
                                value: "Prijavite se",
                                type: "form",
                                click: "login",
                                hotkey: "enter",
                                width: 150
                            }]
                        }
                    ]
                }
                ,
                {}
            ]
        }
    ]
};

var login = function () {

    console.log($$("loginForm").getValues());
    if ($$("loginForm").validate()) {
        webix.ajax().headers({
            "Content-type": "application/json"
        }).post("user/login", $$("loginForm").getValues(), {
            success: function (text, data, xhr) {
                var user = data.json();
                console.log(user);
                if (user != null) {
                    if (user.roleId === 1) {
                        userData = user;
                        companyData = null;
                        showApp();

                    } else {
                        webix.ajax().get("company/" + user.companyId, {
                            success: function (text, data, xhr) {
                                var company = data.json();
                                if (company != null) {
                                    userData = user;
                                    companyData = company;
                                    companyData.deleted = 0;
                                    showApp();
                                } else {
                                    util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");

                                }
                            },
                            error: function (text, data, xhr) {
                                util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
                            }
                        });
                    }
                } else {
                    util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
                }
            },
            error: function (text, data, xhr) {
                console.log("NIJE" + text);
                util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
            }
        });
    }

};

var logout = function () {
    webix.ajax().get("user/logout", function (text, data, xhr) {
        if (xhr.status == "200") {
            userData = null;
            companyData = null;
            util.messages.showLogoutMessage();
            connection.reload();
        }
    });
};
var mainLayout = {
    id: "app",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [{
                view: "template",
                width: 240,
                css: "logoInside",
                template: '<img id="appLogo" src="img/telegroup-logo.png"/>'
            }, {
                view: "toolbar",
                css: "mainToolbar",
                height: 50,
                cols: [
                    {
                        id: "appNameLabel",
                        view: "label",
                        css: "appNameLabel",
                        label: "Schedule Up"
                    }, {
                        id: "logoutBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Odjavite se",
                        click: "logout",
                        icon: "sign-out",
                        autowidth: true
                    }
                ]
            }
            ]

        },
        {
            id: "main", cols: [{
                rows: [
                    {id: "mainMenu", css: "mainMenu", view: "sidebar", gravity: 0.01, minWidth: 41, collapsed: true},
                    {
                        id: "sidebarBelow",
                        css: "sidebar-below",
                        view: "template",
                        template: "",
                        height: 50,
                        gravity: 0.01,
                        minWidth: 41,
                        width: 41,
                        type: "clean"
                    }
                ]
            },
                {id: "emptyRightPanel"}
            ]
        }
    ]
};

var menuEvents = {
    onItemClick: function (item) {
        menuActions(item);
    }
};

var showLogin = function () {
    var login = webix.copy(loginLayout);
    webix.ui(login, panel);
    panel = $$("login");
};

var showApp = function () {
    var main = webix.copy(mainLayout);
    webix.ui(main, panel);
    panel = $$("app");
    if (companyData!=null)
    document.getElementById("appLogo").src="data:image/jpg;base64,"+companyData.companyLogo;
    var localMenuData = null;
    switch (userData.roleId) {
        case 1:
            localMenuData = webix.copy(menuSuperAdmin);
            break;
        case 2:
            localMenuData = webix.copy(menuAdmin);
            break;
        case 3:
            localMenuData = webix.copy(menuAdvancedUser);
            break;
        case 4:
            localMenuData = webix.copy(menuUser);
            break;
    }

    webix.ui({
        id: "menu-collapse",
        view: "template",
        template: '<div id="menu-collapse" class="menu-collapse">' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '</div>',
        onClick: {
            "menu-collapse": function (e, id, trg) {
                var elem = document.getElementById("menu-collapse");
                if (menuState == MENU_STATES.COLLAPSED) {
                    elem.className = "menu-collapse open";
                    menuState = MENU_STATES.EXPANDED;
                    $$("mainMenu").toggle();
                } else {
                    elem.className = "menu-collapse";
                    menuState = MENU_STATES.COLLAPSED;
                    $$("mainMenu").toggle();
                }
            }
        }
    });

    $$("mainMenu").define("data", localMenuData);
    $$("mainMenu").define("on", menuEvents);

    rightPanel = "emptyRightPanel";
    if (userData.roleId===1){
        companyView.selectPanel();
        $$("mainMenu").select("company");
    } else{
        dashboardView.selectPanel();
        $$("mainMenu").select("dashboard");
    }
};


//main call
window.onload = function () {
    init();
};

