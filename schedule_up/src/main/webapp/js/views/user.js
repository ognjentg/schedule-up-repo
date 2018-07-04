userView = {

    panel: {
        id: "userPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-user'></span> Korisnici"
            }, {}, {
                id: "addUserBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte korisnika",
                icon: "plus-circle",
                click: 'userView.showAddDialog',
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "userDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
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
            }, {
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
            }, {
                id: "username",
                editable: false,
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Korisničko ime", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "email",
                fillspace: true,
                editable: false,
                editor: "text",
                sort: "text",
                header: [
                    "E-mail", {
                        content: "textFilter"
                    }
                ]
            }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "user",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },

    addDialog: {
        view: "popup",
        id: "addUserDialog",
        modal: true,
        position: "center",
        body: {
            id: "addUserInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-briefcase'></span> Dodavanje korisnika",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addUserDialog');"
                }]
            }, {
                view: "form",
                id: "addUserForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [
                    {
                        view: "text",
                        id: "email",
                        name: "email",
                        label: "E-mail",
                        required: true,
                        invalidMessage: "Unesite odgovarajuću email adresu"
                    },{
                        view: "richselect",
                        id: "role",
                        name: "role",
                        label: "uloga",
                        value: 4,
                        options: [
                            {id:4, "value":"korisnik"},
                            {id: 3, "value":"napredni korisnik"},
                            ]
                    },
                    {
                        margin: 5,
                        cols: [{}, {
                            id: "saveUser",
                            view: "button",
                            value: "Dodajte korisnika",
                            type: "form",
                            click: "userView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "email": function (value) {
                        if (!value) {
                            $$('addUserForm').elements.email.config.invalidMessage = 'Unesite E-mail!';
                            return false;
                        }
                        if (value.length > 100) {
                            $$('addUserForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 100';
                            return false;
                        }
                        if (!webix.rules.isEmail(value)) {
                            $$('addUserForm').elements.email.config.invalidMessage = 'E-mail nije u validnom formatu.';
                            return false;
                        }

                        return true;
                    }
                }
            }]
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "userPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("userDT", "user");

        webix.ui({
            view: "contextmenu",
            id: "userContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Deaktivirajte",
                icon: "trash"
            }],
            master: $$("userDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            var item = $$("userDT").getItem(context.id.row);
                            if(item.active == 0){
                                util.messages.showErrorMessage("Korisnik je već deaktiviran");
                                break;
                            }
                            var updateBox = (webix.copy(commonViews.deaktivacijaPotvrda("korisnika", "korisnika")));
                            updateBox.callback = function (result) {
                                if (result == 1) {
                                    item.active = 0;
                                    //$$("userDT").detachEvent("onBeforeDelete");
                                    connection.sendAjax("PUT", "/user/" + item.id, function (text, data, xhr) {
                                        if (text) {
                                            $$("userDT").updateItem(item.id, item);
                                            util.messages.showMessage("Uspjesno deaktiviranje");
                                        }
                                    }, function (text, data, xhr) {
                                        util.messages.showErrorMessage("Neuspjesno deaktiviranje");
                                    }, item);
                                }
                            };
                            webix.confirm(updateBox);
                            break;
                    }
                }
            }
        })
    },

    showAddDialog: function () {
        webix.ui(webix.copy(userView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addUserForm");
        if (form.validate()) {
            var newUser = {
                email: $$("addUserForm").getValues().email,
                roleId: $$("role").getValue(),
                companyId: userData.companyId,
                active: 1
            };
            $$("userDT").add(newUser);
            util.dismissDialog('addUserDialog');
        }
    }
}