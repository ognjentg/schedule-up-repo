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
            columns: [
                {
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "publishTime",
                editable: false,
                fillspace: false,
                width:150,
                editor: "date",
                header: ["Datum objave", {
                    content: "textFilter"
                }],
                    format:function(value){
                        date = new Date(value);
                        var hours = date.getHours();
                        var minutes = date.getMinutes();

                        minutes = minutes < 10 ? '0'+minutes : minutes;
                        var strTime = hours + ':' + minutes+"h";
                        return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear() + ".  " + strTime;
                         }

            }, {
                    id: "username",
                    fillspace: false,
                    editor: "text",
                    width:200,
                    editable:false,
                    header: ["Korisnik", {
                    content: "textFilter"
                }],

                }, {
                id: "name",
                editable: false,
                fillspace: false, width:400,
                editor: "text",
                header: ["Naziv", {
                    content: "textFilter"
                }],

            },
                {
                id: "description",
                fillspace: true,
                editor: "text",
                editable:false,
                header: ["Opis", {
                    content: "textFilter"
                }],

            }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "note/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },
    selectPanel: function(){
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
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("oglasa","oglas")));
                            var newItem=$$("noteDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {

                                    connection.sendAjax("DELETE", "note/"+newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Oglas uspješno uklonjen.");
                                                $$("noteDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno uklanjanje.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno uklanjanje.");
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
                userId: 1, // we need to change this when userBean is made
                companyId: 1, // also needs change
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
                width: 600,
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
                    label: "Naslov: ",
                    invalidMessage: "Unesite naslov oglasa !",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis",
                    height:200,
                    invalidMessage: "Unesite tekst oglasa!",
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
                    "noteName": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 15) {
                            $$('changeNoteForm').elements.noteName.config.invalidMessage = 'Maksimalan broj karaktera je 15!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeNoteDialog: function (note) {
        webix.ui(webix.copy(noteView.changeNoteDialog));
        var form = $$("changeNoteForm");
        form.elements.id.setValue(note.id);
        setTimeout(function () {
            $$("changeNoteDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedNote: function () {
        if ($$("changeNoteForm").validate()) {
            //changeItem is a copy of add new item, same atributes
            var newItem = {
                name: form.getValues().name,
                description: form.getValues().description,
                userId: 1, // we need to change this when userBean is made
                companyId: 1, // also needs change
            };
            // connection.sendAjax("PUT", "note/"+newItem.id,
            //     function (text, data, xhr) {
            //         if (text) {
            //             util.messages.showMessage("Oglas uspješno izmjenjen.");
            //             $$("companyDT").updateItem(newItem.id, newItem);
            //         } else
            //             util.messages.showErrorMessage("Neuspješna izmjena.");
            //     }, function () {
            //         util.messages.showErrorMessage("Neuspješna izmjena.");
            //     }, newItem);

            util.dismissDialog('changeNoteDialog');
        }
    }

    };