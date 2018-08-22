var userGroupView = {
    panel: {
        id: "userGroupPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 200,
                template: "<span class='fa fa-users'></span> Korisničke grupe"
            },{},{
                id: "addUserGroupBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte grupu",
                icon: "plus-circle",
                click: 'userGroupView.showAddDialog',
                autowidth: true
            }]
        }, {
            cols: [

                {
                rows: [
                    {
                        view: "template",
                        template: "Grupe",
                        type: "header"
                    },

                    {
                    view: "list",
                    multiselect: false,
                    id: "userGroupList",
                    onContext: {},
                    select: "row",
                    navigation: true,
                    editable: false,
                    type: {
                        height: "auto",
                        template: function (value) {
                            var name = value.name;
                            return "<div class='noteName'>" + name + "</div>";
                        }
                    },
                    url: "user-group/",
                    on: {
                        onAfterContextMenu: function (id) {
                           this.select(id);
                        },

                        onAfterSelect: function (id) {
                            $$("inUsersList").clearAll();
                            $$("inUsersList").load("user-group-has-user/custom/" + id);
                            $$("outUsersList").clearAll();
                            $$("outUsersList").load("user/nonInGroup/" + id);
                        }
                    }
                }

                ]
            }, {
                rows: [

                    {
                    view: "template",
                    template: "Članovi",
                    type: "header"
                }, {
                    autowidth:true,
                    view: "list",
                    multiselect: true,
                    id: "inUsersList",
                    onContext: {},
                    select: "row",
                    navigation: true,
                    editable: false,
                    drag: true,
                    type: {
                        height: "auto",
                        template: function (value) {
                            var firstName = value.firstName;
                            var lastName = value.lastName;
                            var email = value.email;
                            return "<div>" + firstName + " " + lastName + "</div>" +
                                   "<div>" + email + "</div>";
                        }
                    },
                    on: {
                        onAfterDrop: function (context, event) {
                            if (context.from != context.to) {
                                var userIds = context.source;
                                for (var i = 0; i < userIds.length; i++) {
                                    var newUserGroupHasUser = {
                                        userGroupId: $$("userGroupList").getSelectedId(),
                                        userId: userIds[i]
                                    }
                                    connection.sendAjax("POST", "user-group-has-user",
                                        function (text, data, xhr) {
                                        }, function (text, data, xhr) {
                                            util.messages.showErrorMessage(text);
                                        }, newUserGroupHasUser);
                                }
                            }
                        }
                    }
                }

                ]
            }, {
                rows: [{
                    view: "template",
                    template: "Ostali korisnici",
                    type: "header"
                }, {
                    autowidth:true,

                    view: "list",
                    multiselect: true,
                    id: "outUsersList",
                    onContext: {},
                    select: "row",
                    navigation: true,
                    editable: false,
                    drag: true,
                    type: {
                        height: "auto",
                        template: function (value) {
                            var firstName = value.firstName;
                            var lastName = value.lastName;
                            var email = value.email;
                            return "<div>" + firstName + " " + lastName + "</div>" +
                                "<div>" + email + "</div>";
                        }
                    },
                    on: {
                        onAfterDrop: function (context, event) {
                            if (context.from != context.to) {
                                var userIds = context.source;
                                for (var i = 0; i < userIds.length; i++) {
                                    connection.sendAjax("DELETE", "user-group-has-user/" +
                                        $$("userGroupList").getSelectedId() + "/" + userIds[i],
                                        function (text, data, xhr) {
                                            if (!text)
                                                util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, function (text, data, xhr) {
                                            util.messages.showErrorMessage(text);
                                        }, null);
                                }
                            }
                        }
                    }
                }]
            }]
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "userGroupPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("userGroupList", "user-group");
        $$("userGroupList").detachEvent("onBeforeDelete");

        webix.ui({
            view: "contextmenu",
            id: "userGroupContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("userGroupList"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("korisničke grupe", "korisničku grupu")));
                            delBox.callback = function (result) {
                                if (result) {
                                    var itemId = $$("userGroupList").getSelectedId();
                                    connection.sendAjax("DELETE", "/user-group/" + itemId, function (text, data, xhr) {
                                        if (text) {
                                            $$("userGroupList").remove(itemId);
                                            $$("inUsersList").clearAll();
                                            $$("outUsersList").load("user/nonInGroup/" + itemId);
                                            util.messages.showMessage("Uspješno uklanjanje korisničke grupe");
                                        }
                                    }, function (text, data, xhr) {
                                        util.messages.showErrorMessage(text);
                                    }, null);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });


    },


    addDialog: {
        view: "popup",
        id: "addUserGroupDialog",
        modal: true,
        position: "center",
        body: {
            id: "addUserGroupInside",
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
                    click: "util.dismissDialog('addUserGroupDialog');"
                }]
            }, {
                view: "form",
                id: "addUserGroupForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv korisničke grupe:",
                    invalidMessage: "Unesite naziv korisničke grupe!",
                    required: true
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveUserGroup",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "userGroupView.save",
                        hotkey: "enter",
                        width: 150
                    }]
                }]
            }]
        }
    },

    showAddDialog: function () {
        if(util.popupIsntAlreadyOpened("addUserGroupDialog")){
            webix.ui(webix.copy(userGroupView.addDialog)).show();
            webix.UIManager.setFocus("name");
        }
    },

    save: function () {
        var form = $$("addUserGroupForm");
        if (form.validate()) {
            var newUserGroup = {
                name: form.getValues().name,
                companyId: companyData.id
            };
            $$("userGroupList").add(newUserGroup);
        }
        util.dismissDialog('addUserGroupDialog');
    }
};