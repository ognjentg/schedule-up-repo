var formatter = webix.Date.dateToStr("%d-%m-%Y %H:%i");

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
                template: "<span class='fa fa-sticky-note'></span> Oglasi"
            }, {}, {
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
            //css: "webixDatatable",
            multiselect: false,
            id: "noteDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [
                {
                    id: "id",
                    hidden: true,
                    fillspace: true
                }, {
                    id: "publishTime",
                    editable: false,
                    fillspace: false,
                    width: 150,
                    sort: "string",
                    tooltip: false,
                    header: ["Datum objave", {
                        content: "dateFilter"
                    }],
                    format: function (value) {
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();

                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        var strTime = hours + ':' + minutes + "h";
                        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".  " + strTime;
                    }

                }, {
                    id: "username",
                    fillspace: false,
                    width: 200,
                    tooltip: false,
                    editable: false,
                    header: ["Korisnik", {
                        content: "textFilter"
                    }]

                }, {
                    id: "name",
                    fillspace: false, width: 400,
                    editor: "text",
                    tooltip: false,
                    editable:true,
                    header: ["Naslov", {
                        content: "textFilter"
                    }],

                },
                {
                    id: "description",
                    fillspace: true,
                    editable: true,

                    editor: "text",
                    header: ["Opis", {
                        content: "textFilter"
                    }]

                },{
                    id: "expiredTime",
                    editable: false,
                    fillspace: false,
                    width: 150,
                    tooltip: false,

                    header: ["Datum isteka", {
                        content: "dateFilter"
                    }],
                    format: function (value) {
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();

                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        var strTime = hours + ':' + minutes + "h";
                        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".  " + strTime;
                    }

                }
            ],
            select: "row",
            navigation: true,
            editable: true,
            tooltip: true,
            editaction: "dblclick",
            url: "note/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },
    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "notePanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("noteDT", "note");
        $$("noteDT").detachEvent("onBeforeDelete");

        webix.ui({
            view: "contextmenu",
            id: "noteContextMenu",
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
            master: $$("noteDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            noteView.showChangeNoteDialog($$("noteDT").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("oglasa", "oglas "+$$("noteDT").getItem(context.id.row).name)));
                            var newItem = $$("noteDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {

                                    connection.sendAjax("DELETE", "note/" + newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Oglas uspješno uklonjen.");
                                                $$("noteDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno uklanjanje oglasa.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno uklanjanje oglasa.");
                                        }, null);

                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });
    }
    ,
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
                    label: "Naslov:",
                    invalidMessage: "Unesite naslov oglasa!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Tekst:",
                    height: 200,
                    invalidMessage: "Unesite tekst oglasa!",
                    required: true
                },{
                    view: "datepicker",
                    value: new Date(Date.now() + 1296000000),
                    timepicker: true,
                    id: "expiredTime",
                    name: "expiredTime",
                    label: "Datum isteka:",
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
                            $$('addNoteForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    },
                    "expiredTime": function(value){
                        if(!value)
                            return false;
                        if(value<new Date(Date.now())){
                            $$('addNoteForm').elements.expiredTime.config.invalidMessage = 'Datum isteka ne smije biti prije trenutnog datuma!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addNoteDialog")) {
            webix.ui(webix.copy(noteView.addDialog)).show();
            webix.UIManager.setFocus("name");
        }
    },

    save: function () {
        var form = $$("addNoteForm");
        if (form.validate()) {
            var newNote = {
                name: form.getValues().name,
                description: form.getValues().description,
                userId: userData.id,
                companyId: companyData.id,
                expiredTime: form.getValues().expiredTime
            };
            $$("noteDT").add(newNote);
            util.dismissDialog('addNoteDialog');
        }

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
                    label: "<span class='webix_icon fa-sticky-note'></span> Izmjena oglasa",
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
                    labelWidth: 200,
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
                    label: "Naslov:",
                    invalidMessage: "Unesite naslov oglasa!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis:",
                    height: 200,
                    invalidMessage: "Unesite tekst oglasa!",
                    required: true
                },{
                    view: "datepicker",
                    timepicker: true,
                    id: "expiredTime",
                    name: "expiredTime",
                    label: "Datum isteka:",
                    invalidMessage: "Unesite validan datum isteka oglasa!",
                    required: true
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveChangedNote",
                        view: "button",
                        value: "Sačuvajte",
                        type: "form",
                        click: "noteView.saveChangedNote",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeNoteForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 500) {
                            $$('changeNoteForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    },
                    "expiredTime": function(value){
                        if(!value)
                            return false;
                        if(value<new Date(Date.now())){
                            $$('changeNoteForm').elements.expiredTime.config.invalidMessage = 'Datum isteka ne smije biti prije trenutnog datuma!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeNoteDialog: function (note) {
        if (util.popupIsntAlreadyOpened("changeNoteDialog")) {
            webix.ui(webix.copy(noteView.changeNoteDialog));
            var form = $$("changeNoteForm");
            form.elements.id.setValue(note.id);
            form.elements.name.setValue(note.name);
            form.elements.description.setValue(note.description);
            form.elements.expiredTime.setValue(new Date(note.expiredTime));
            // form.elements.publishedTime.setValue(note.publishedTime);
            //datum?!?
            setTimeout(function () {
                $$("changeNoteDialog").show();
                webix.UIManager.setFocus("name");
            }, 0);
        }
    },

    saveChangedNote: function () {
        if ($$("changeNoteForm").validate()) {
            //changeItem is a copy of add new item, same atributes
            var oldItem = $$("noteDT").getSelectedItem();

            var newItem = {
                id: $$("changeNoteForm").getValues().id,
                name: $$("changeNoteForm").getValues().name,
                description: $$("changeNoteForm").getValues().description,
                publishTime: new Date(),
                deleted: 0,
                userId: userData.id,
                companyId: companyData.id,
                expiredTime: $$("changeNoteForm").getValues().expiredTime
            };

            connection.sendAjax("PUT", "note/" + newItem.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Oglas uspješno izmjenjen.");
                        $$("noteDT").updateItem(newItem.id, newItem);
                    } else
                        util.messages.showErrorMessage("Neuspješna izmjena oglasa.");
                }, function () {
                    util.messages.showErrorMessage("Neuspješna izmjena oglasa.");
                }, newItem);

            util.dismissDialog('changeNoteDialog');
        }
    }
};