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
        connection.attachAjaxEvents("usergroupDT", "user-group", true);


        /*webix.ui({
            view: "contextmenu",
            id: "companyContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmijenite",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("companyDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            companyView.showChangeCompanyDialog($$("companyDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.deleteConfirm("company")));
                            delBox.callback = function (result) {
                                if (result == 1) {
                                    var item = $$("companyDT").getItem(context.id.row);
                                    $$("companyDT").detachEvent("onBeforeDelete");
                                    connection.sendAjax("DELETE", "/company/" + item.id, function (text, data, xhr) {
                                        if (text) {
                                            $$("companyDT").remove(context.id.row);
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
        })*/
    }
}