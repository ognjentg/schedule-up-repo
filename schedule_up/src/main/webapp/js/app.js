var MENU_STATES = {
    COLLAPSED: 0,
    EXPANDED: 1
};
var menuState = MENU_STATES.COLLAPSED;

var menuData = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    },
    {
        id:"building",
        value:"Zgrade",
        icon:"building"
    }
];

var menuActions = function (id) {

    switch(id){
        case "company":
            companyView.selectPanel();
            break;
        case "building":
            buildingView.selectPanel();
            break;
    }
};

var panel = {id: "empty"};
var rightPanel = null;

var init = function () {
    if (!webix.env.touch && webix.ui.scrollSize) webix.CustomScroll.init();
    webix.ui(panel);
    panel = $$("empty");
    showApp();
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
                template: '<img src="img/telegroup-logo.png"/>'
            }, {
                view: "toolbar",
                css: "mainToolbar",
                height: 50,
                cols: [
                    {
                        id: "appNameLabel",
                        view: "label",
                        css: "appNameLabel",
                        label: "Schedule Up",
                        width: 400
                    },{}
                ]
            }]

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

var showApp = function () {
    var main = webix.copy(mainLayout);
    webix.ui(main, panel);
    panel = $$("app");

    var localMenuData = webix.copy(menuData);

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
};


//main call
window.onload = function () {
    init();
};

