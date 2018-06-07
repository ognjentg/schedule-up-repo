
var roomView = {

    selectPanel: function () {

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
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis"
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
                        if (isNaN(value)) {
                            $$('addRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        if (value < 0) {
                            $$('addRoomForm').elements.floor.config.invalidMessage = 'Broj spratova ne smije biti manji od 0!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value)) {
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
                        if (isNaN(value)) {
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
                    view: "text",
                    id: "description",
                    name: "description",
                    label: "Opis"
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
                        if (isNaN(value)) {
                            $$('changeRoomForm').elements.floor.config.invalidMessage = 'Broj spratova mora biti cijeli broj!';
                            return false;
                        }
                        if (value < 0) {
                            $$('changeRoomForm').elements.floor.config.invalidMessage = 'Broj spratova ne smije biti manji od 0!';
                            return false;
                        }
                        return true;
                    },
                    "capacity": function (value) {
                        if (isNaN(value)) {
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
                        if (isNaN(value)) {
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