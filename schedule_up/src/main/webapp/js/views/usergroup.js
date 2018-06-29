var usergroupView = {
    panel: {
        id: "usergroupPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-users'></span> Korisničke grupe"
            }, {}, {
                id: "addUsergroupBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte korisničku grupu",
                icon: "plus-circle",
                click: 'usergroupView.showAddDialog',
                autowidth: true
            }]
        }, {
            cols: [
                {
                    //jedna tabela
                    view: "datatable",
                    css: "webixDatatable",
                    multiselect: false,
                    gravity: 0.7,
                    id: "usergroupDT",
                    resizeColumn: true,
                    resizeRow: true,
                    onContext: {},
                    columns: [{
                        id: "id",
                        hidden: true,
                        fillspace: true,

                    },{
                        id: "name",
                        editable: false,
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        header: [
                            "Naziv", {
                                content: "textFilter"
                            }
                        ]
                    }
                    ],
                    select: "row",
                    navigation: true,
                    editable: false,
                    url: "user-group",
                    on: {

                        onAfterContextMenu: function (item) {
                            this.select(item.row);
                        },

                        onAfterSelect: function (item) {
                            var groupId = item.id;
                            $$("usersFromUserGroupDT").clearAll();
                            $$("usersFromUserGroupDT").load("user-group-has-user/custom/" + groupId);
                        }
                    }
                },
                {
                    //druga tabela
                    view: "datatable",
                    css: "webixDatatable",
                    multiselect: false,
                    id: "usersFromUserGroupDT",
                    resizeColumn: true,
                    resizeRow: true,
                    onContext: {},
                    columns: [{
                        id: "id",
                        hidden: true,
                        fillspace: true,

                    },{
                        id: "firstName",
                        editable: false,
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        header: [
                            "Ime", {
                                content: "textFilter"
                            }
                        ]
                    },{
                        id: "lastName",
                        editable: false,
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        header: [
                            "Prezime", {
                                content: "textFilter"
                            }
                        ]
                    }
                    ],
                    select: "row",
                    navigation: true,
                    editable: false,
                    on: {

                        onAfterContextMenu: function (item) {
                            this.select(item.row);
                        }
                    }
                }
            ]
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "usergroupPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("usergroupDT", "user-group");


        webix.ui({
            view: "contextmenu",
            id: "userGroupContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmijeni",
                icon: "pencil-square-o"
            },
                {
                id: "2",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("usergroupDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            usergroupView.showChangeUserGroupDialog($$("usergroupDT").getItem(context.id.row),context.id);
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("korisničke grupe", "korisničku grupu")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    var item = $$("usergroupDT").getItem(context.id.row);
                                    $$("usergroupDT").detachEvent("onBeforeDelete");
                                    connection.sendAjax("DELETE", "/user-group/" + item.id, function (text, data, xhr) {
                                        if (text) {
                                            $$("usergroupDT").remove(context.id.row);
                                            $$("usersFromUserGroupDT").clearAll();
                                            util.messages.showMessage("Uspjesno uklanjanje");
                                        }
                                    }, function (text, data, xhr) {
                                        util.messages.showErrorMessage("Neuspjesno uklanjanje");
                                    }, item);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        })
    },


    addDialog: {
        view: "popup",
        id: "addUsergroupDialog",
        modal: true,
        position: "center",
        body: {
            id: "addUsergroupInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-users'></span> Dodavanje korisničke grupe",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addUsergroupDialog');"
                }]
            }, {
                view: "form",
                id: "addUsergroupForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv korisničke grupe",
                    invalidMessage: "Unesite naziv korisničke grupe!",
                    required: true
                }, {
                    view: "multicombo",
                    id: "users",
                    name: "users",
                    label: "Korisnici",
                    suggest: {
                        body: {
                            template: "#firstName# #lastName#",
                            url: "user"
                        }
                    }
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveUsergroup",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "usergroupView.save",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addUsergroupForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    }

                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(usergroupView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addUsergroupForm");
        if (form.validate()) {
            var newUsergroup = {
                name: form.getValues().name,
                companyId: companyData.id
            };
            var userIdsStr = form.getValues().users;//format: v1,v2,...,v3
            if(userIdsStr != "")
                var userIds = userIdsStr.split(",");
            connection.sendAjax("POST", "user-group",
                function (text, data, xhr) {
                    if (text) {
                        $$("usergroupDT").load("user-group");
                        var usergroupId = Number(JSON.parse(text).id);
                        var i;
                        for (i = 0; i < userIds.length; i++) {
                            var newUserGroupHasUser = {
                                userGroupId: usergroupId,
                                userId: Number(userIds[i])
                            }
                            connection.sendAjax("POST", "user-group-has-user",
                                function (text, data, xhr) {
                                }, function () {
                                    util.messages.showErrorMessage("Podaci nisu dodati.");
                                }, newUserGroupHasUser);
                        }
                    }
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu dodati.");
                }, newUsergroup);
        }
        util.dismissDialog('addUsergroupDialog');

    },

    showChangeUserGroupDialog: function (usergroup,id) {
        webix.ui(webix.copy(usergroupView.changeUsergroupDialog));
        var form = $$("changeUsergroupForm");
        form.elements.name.setValue(usergroup.name);
        var temp= form.elements.users;
        //add "/user-group-has-user/custom/"+id to users? how?
        setTimeout(function () {
            $$("changeUsergroupDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    changeUsergroupDialog: {
        view: "popup",
        id: "changeUsergroupDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeUsergroupInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-book'></span> Izmjena podataka o korisnčkim grupama",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeUsergroupDialog');"
                }]
            }, {
                view: "form",
                id: "changeUsergroupForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv korisničke grupe",
                    invalidMessage: "Unesite naziv korisničke grupe!",
                    required: true
                }, {
                    view: "multicombo",
                    id: "users",
                    name: "users",
                    label: "Korisnici",
                    suggest: {
                        body: {
                            template: "#firstName# #lastName#"
                        }
                    }
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveChangedUsergroup",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "usergroupView.saveChangedUsergroup",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeUsergroupForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    }

                }
            }]
        }
    }
}