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
            }, {
                id: "active",
                fillspace: true,
                editable: false,
                sort: "text",
                format: function (value) {
                    if (value == 1) return "Da";
                    else return "Ne";
                },
                header: [
                    "Aktivan", {
                        content: "textFilter"
                    }
                ]
            },
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

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "userPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("userDT", "user", true);

    }
}