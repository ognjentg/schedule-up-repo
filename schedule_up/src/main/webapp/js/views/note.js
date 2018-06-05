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

    },
    changeNoteDialog: {
        view: "popup",
        id: "showNoteDialog",
        modal: true,
        position: "center",
        body: {
            id: "showNoteInside",
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
                    click: "util.dismissDialog('showNoteDialog');"
                }]
            }, {
                view: "form",
                id: "showNoteForm",
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
    showNoteDialog: function (note) {
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

};