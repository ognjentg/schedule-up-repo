var noteView = {
    panel: {
        id: "notePanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-note'></span> Oglasi"
            },{}, {
                id: "addNoteBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte oglas",
                icon: "plus-circle",
                click: "noteView.showAddDialog",
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "noteDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "publishTime",
                editable: false,
                fillspace: false,
                width:250,
                editor: "date",
                header: "Datum objave",

            }, {
                id: "name",
                editable: false,
                fillspace: true,
                editor: "text",
                header: "Naziv"

            },
                {
                id: "description",
                fillspace: true,
                editor: "text",
                editable:false,
                header: "Opis"

            }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "note/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                },
                onItemClick: function (item) {
                    console.log("prozor");
                            noteView.showNoteDialog($$("noteDT").getItem(item.row));
                    }
            }
        }]
    },
    selectPanel: function(){
        $$("main").removeView(rightPanel);
        rightPanel = "notePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        var my_format = webix.Date.strToDate("%d-%m-%Y ");
        connection.attachAjaxEvents("noteDT", "note");

    },
    changeNoteDialog: {
        view: "popup",
        id: "changeNoteDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeNoteInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-book'></span> Oglas",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeNoteDialog');"
                }]
            }, {
                view: "form",
                id: "changeNoteForm",
                width: 500,
                elementsConfig: {
                    labelWidth: 140,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    name: "id",
                    hidden: true
                }, {
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Name:",
                }, {
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Tekst:",
                }, {
                    margin: 5,
                }]

            }]
        }
    },
    showChangeNoteDialog: function (note) {
        webix.ui(webix.copy(buildingView.changeNoteDialog));
        var form = $$("changeNoteForm");
        form.elements.id.setValue(note.id);
        form.elements.name.setValue(note.name);
        form.elements.description.setValue(note.description);

        setTimeout(function () {
            $$("changeNoteDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },
    addDialog: {
        view: "popup",
        id: "addNoteDialog",
        modal: true,
        position: "center",
        body: {
            id: "addNoteInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-sticky-note'></span> Dodavanje oglasa",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addNoteDialog');"
                }]
            }, {
                view: "form",
                id: "addNoteForm",
                width: 500,
                elementsConfig: {
                    labelWidth: 140,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naslov",
                    invalidMessage: "Unesite naslov oglasa!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Tekst",
                    height:200,
                    invalidMessage: "Unesite tekst oglasa!",
                    required: true
                }, {
                        margin: 5,
                        cols: [{}, {
                            id: "saveNote",
                            view: "button",
                            value: "Dodajte oglas",
                            type: "form",
                            click: "noteView.save",
                            hotkey: "enter",
                            width: 150
                        }]
                    }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addNoteForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 500) {
                            $$('addNoteForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(noteView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addNoteForm");
        if (form.validate()) {
            var newNote = {
                name: form.getValues().name,
                description: form.getValues().description,
                userId:1, // we need to change this when userBean is made
                companyId:1 // also needs change
            };
            $$("noteDT").add(newNote);
            util.dismissDialog('addNoteDialog');
        }
    }

    

};