
var roomView = {

    panel: {
        id: "roomPanel",
        adjust: true,
        rows: [{
            view: "toolbar",
            padding: 8,
            css: "panelToolbar",
            cols: [{
                view: "label",
                width: 400,
                template: "<span class='fa fa-cube'></span> Sale"
            }, {}, {
                id: "addRoomBtn",
                view: "button",
                type: "iconButton",
                label: "Dodajte salu",
                icon: "plus-circle",
                click: 'roomView.showAddDialog',
                autowidth: true
            }]
        }, {
            view: "datatable",
            css: "webixDatatable",
            multiselect: false,
            id: "roomDT",
            resizeColumn: true,
            resizeRow: true,
            onContext: {},
            columns: [{
                id: "id",
                hidden: true,
                fillspace: true,

            }, {
                id: "name",
                editable:false,
                fillspace: true,
                editor: "text",
                sort: "string",
                header: [
                    "Naziv sale", {
                        content: "textFilter"
                    }
                ]
            }, {
                id: "floor",
                fillspace: true,
                editable:false,
                editor: "text",
                sort: "int",
                header: ["Sprat",
                    {
                        content: "numberFilter"
                    }]
            },
                {
                    id: "capacity",
                    fillspace: true,
                    editable:false,
                    editor: "text",
                    sort: "int",
                    header: ["Kapacitet",{
                        content: "numberFilter"
                    }],
                },
                {
                    id: "buildingName",
                    fillspace: true,
                    editable:false,
                    editor: "text",
                    sort: "string",
                    header: [
                        "Naziv zgrade", {
                            content: "textFilter"
                        }
                    ]
                },
                {
                    id: "description",
                    editable:false,
                    fillspace: true,
                    editor: "text",
                    sort: "string",
                    header: [
                        "Opis", {
                            content: "textFilter"
                        }
                    ]

                }
            ],
            select: "row",
            navigation: true,
            editable: false,
            url: "room/",
            on: {

                onAfterContextMenu: function (item) {
                    this.select(item.row);
                }
            }
        }]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "roomPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("roomDT", "room",true);
        $$("roomDT").detachEvent("onBeforeDelete");

        webix.ui({
            view: "contextmenu",
            id: "roomContextMenu",
            width: 200,
            data: [{
                id: "1",
                value: "Izmjenite",
                icon: "pencil-square-o"
            }, {
                $template: "Separator"
            }, {
                id: "2",
                value: "Obrišite",
                icon: "trash"
            }],
            master: $$("roomDT"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":

                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("sale","salu")));
                            var newItem=$$("roomDT").getItem(context.id.row);
                            delBox.callback = function (result) {
                                if (result == 1) {

                                    connection.sendAjax("DELETE", "room/"+newItem.id,
                                        function (text, data, xhr) {
                                            if (text) {
                                                util.messages.showMessage("Sala uspješno obrisana.");
                                                $$("roomDT").remove(context.id.row);
                                            } else
                                                util.messages.showErrorMessage("Neuspješno brisanje.");
                                        }, function () {
                                            util.messages.showErrorMessage("Neuspješno brisanje.");
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
        id: "addRoomDialog",
        modal: true,
        position: "center",
        body: {
            id: "addRoomInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-cube'></span> Dodavanje sale",
                    width: 400
                }, {}, {
                    hotkey: 'esc',
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('addRoomDialog');"
                }]
            }, {
                view: "form",
                id: "addRoomForm",
                width: 600,
                elementsConfig: {
                    labelWidth: 200,
                    bottomPadding: 18
                },
                elements: [{
                    view: "text",
                    id: "name",
                    name: "name",
                    label: "Naziv sale",
                    invalidMessage: "Unesite naziv sale!",
                    required: true
                }, {
                    view: "combo",
                    id: "buildingName",
                    name: "buildingName",
                    label: "Naziv zgrade",
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true,
                    options: {
                        filter:function(item, value){
                            if(item.name.toString().toLowerCase().indexOf(value.toLowerCase())===0)
                                return true;
                            return false;
                        },
                        body: {
                            template: "#name#",
                            yCount: 5,
                            url: "building"
                        }
                    }
                }, {
                    view: "counter",
                    id: "floor",
                    name: "floor",
                    label: "Broj sprata",
                    min: 0,
                    value: 0
                }, {
                    view: "counter",
                    id: "capacity",
                    name: "capacity",
                    label: "Kapacitet sale",
                    min: 1,
                    value: 1
                }, {
                    view: "text",
                    id: "pin",
                    name: "pin",
                    label: "PIN",
                    invalidMessage: "Unesite PIN!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis",
                    height: 90

                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveRoom",
                        view: "button",
                        value: "Dodajte salu",
                        type: "form",
                        click: "roomView.save",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addRoomForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "buildingName": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('addRoomForm').elements.buildingName.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "floor": function (value) {
                        if (isNaN(value) || value !== parseInt(value, 10)) {
                            $$('addRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value) || value !== parseInt(value, 10)) {
                            $$('addRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti cijeli broj!';
                            $$('addRoomForm').elements.capacity.setValue(1);
                            return false;
                        }
                        if (value < 1) {
                            $$('addRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti veći od 0!';
                            return false;
                        }
                        return true;
                    },
                    "pin": function (value) {
                        if (!value)
                            return false;
                        if (isNaN(value) || value != parseInt(value, 10)) {
                            $$('addRoomForm').elements.pin.config.invalidMessage = 'PIN može da sadrži samo cifre!';
                            return false;
                        }
                        if (value.length != 4) {
                            $$('addRoomForm').elements.pin.config.invalidMessage = 'PIN se sastoji iz 4 cifre!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (value && value.length > 500) {
                            $$('addRoomForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showAddDialog: function () {
        webix.ui(webix.copy(roomView.addDialog)).show();
        webix.UIManager.setFocus("name");
    },

    save: function () {
        var form = $$("addRoomForm");
        if (form.validate()) {
            var newRoom = {
                name: form.getValues().name,
                floor: form.getValues().floor,
                capacity: form.getValues().capacity,
                pin: form.getValues().pin,
                description: form.getValues().description,
                buildingId: form.getValues().buildingName,
                companyId: 1
            };
            //  $$("roomDT").add(newRoom);//jos nije kreiran roomDT
            util.dismissDialog('addRoomDialog');
        }
    },

    changeRoomDialog: {
        view: "popup",
        id: "changeRoomDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeRoomInside",
            rows: [{
                view: "toolbar",
                cols: [{
                    view: "label",
                    label: "<span class='webix_icon fa-cube'></span> Izmjena podataka o sali",
                    width: 400
                }, {}, {
                    view: "icon",
                    icon: "close",
                    align: "right",
                    click: "util.dismissDialog('changeRoomDialog');"
                }]
            }, {
                view: "form",
                id: "changeRoomForm",
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
                    label: "Naziv sale",
                    invalidMessage: "Unesite naziv sale!",
                    required: true
                }, {
                    view: "combo",
                    id: "buildingName",
                    name: "buildingName",
                    label: "Naziv zgrade",
                    invalidMessage: "Unesite naziv zgrade!",
                    required: true,
                    options: {
                        filter:function(item, value){
                            if(item.name.toString().toLowerCase().indexOf(value.toLowerCase())===0)
                                return true;
                            return false;
                        },
                        body: {
                            template: "#name#",
                            yCount: 5,
                            url: "building"

                        }
                    }
                }, {
                    view: "counter",
                    id: "floor",
                    name: "floor",
                    label: "Broj sprata",
                    min: 0,
                    value: 0
                }, {
                    view: "counter",
                    id: "capacity",
                    name: "capacity",
                    label: "Kapacitet sale",
                    min: 1,
                    value: 1
                }, {
                    view: "text",
                    id: "pin",
                    name: "pin",
                    label: "PIN",
                    invalidMessage: "Unesite PIN!",
                    required: true
                }, {
                    view: "textarea",
                    id: "description",
                    name: "description",
                    label: "Opis",
                    height: 90
                }, {
                    margin: 5,
                    cols: [{}, {
                        id: "saveRoom",
                        view: "button",
                        value: "Dodajte salu",
                        type: "form",
                        click: "roomView.saveChangedRoom",
                        hotkey: "enter",
                        width: 150
                    }]
                }],
                rules: {
                    "name": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeRoomForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "buildingName": function (value) {
                        if (!value)
                            return false;
                        if (value.length > 100) {
                            $$('changeRoomForm').elements.buildingName.config.invalidMessage = 'Maksimalan broj karaktera je 100!';
                            return false;
                        }
                        return true;
                    },
                    "floor": function (value) {
                        if (isNaN(value) || value !== parseInt(value, 10)) {
                            $$('changeRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value) || value !== parseInt(value, 10)) {
                            $$('changeRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti cijeli broj!';
                            $$('changeRoomForm').elements.capacity.setValue(1);
                            return false;
                        }
                        if (value < 1) {
                            $$('changeRoomForm').elements.capacity.config.invalidMessage = 'Kapacitet sale mora biti veći od 0!';
                            return false;
                        }
                        return true;
                    },
                    "pin": function (value) {
                        if (!value)
                            return false;
                        if (isNaN(value) || value !== parseInt(value, 10)) {
                            $$('changeRoomForm').elements.pin.config.invalidMessage = 'PIN može da sadrži samo cifre!';
                            return false;
                        }
                        if (value.length != 4) {
                            $$('changeRoomForm').elements.pin.config.invalidMessage = 'PIN se sastoji iz 4 cifre!';
                            return false;
                        }
                        return true;
                    },
                    "description": function (value) {
                        if (value && value.length > 500) {
                            $$('changeRoomForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500!';
                            return false;
                        }
                        return true;
                    }
                }
            }]
        }
    },

    showChangeRoomDialog: function (room) {
        webix.ui(webix.copy(roomView.changeRoomDialog));
        var form = $$("changeRoomForm");
        form.elements.id.setValue(room.id);
        form.elements.name.setValue(room.name);
        form.elements.buildingName.setValue(room.buildingId);
        form.elements.floor.setValue(room.floor);
        form.elements.capacity.setValue(room.capacity);
        form.elements.description.setValue(room.description);

        setTimeout(function () {
            $$("changeRoomDialog").show();
            webix.UIManager.setFocus("name");
        }, 0);
    },

    saveChangedRoom: function () {
        var form = $$("changeRoomForm");
        if (form.validate()) {
            var newRoom = {
                id: form.getValues().id,
                name: form.getValues().name,
                floor: form.getValues().floor,
                capacity: form.getValues().capacity,
                pin: form.getValues().pin,
                description: form.getValues().description,
                buildingId: form.getValues().buildingName,
                companyId: 1,
                deleted: 0
            };

            connection.sendAjax("PUT", "room/" + newRoom.id,
                function (text, data, xhr) {
                    if (text) {
                        util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                        //$$("roomDT").updateItem(newRoom.id, newRoom);
                    } else
                        util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, function () {
                    util.messages.showErrorMessage("Podaci nisu izmijenjeni.");
                }, newRoom);

            util.dismissDialog('changeRoomDialog');
        }
    }

};